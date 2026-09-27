import type OpenAI from 'openai'
import { connectDB, isValidObjectId, Dentist, Patient, Appointment } from '@/lib/db'
import { CLOSED_WEEKDAYS, TIME_SLOTS, getClinicToday } from '@/lib/clinicInfo'

// Mutable state the tool handlers can update; the route persists it after the turn.
export interface ChatToolContext {
  conversation: {
    patientName: string
    patientPhone: string
    status: 'active' | 'handoff' | 'booked' | 'resolved'
    handoffReason: string
    appointmentId: unknown
  }
}

export const CHAT_TOOLS: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'check_availability',
      description:
        'Look up open appointment time slots on a given date. Always call this before promising a specific time. If the patient has no preferred dentist (or just wants to be seen as soon as possible), omit the dentist field to search across all dentists and find the earliest opening that day.',
      parameters: {
        type: 'object',
        properties: {
          dentist: {
            type: 'string',
            description: 'Dentist name (or partial name/specialty) the patient wants to see. Omit this entirely if the patient has no preference — do not guess a dentist.',
          },
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        },
        required: ['date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'book_appointment',
      description:
        'Book a confirmed appointment in the real booking system. Only call this after the patient has explicitly confirmed a dentist, date, and time that check_availability showed as open.',
      parameters: {
        type: 'object',
        properties: {
          dentist: { type: 'string', description: 'Dentist name (or partial name/specialty)' },
          date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
          time: { type: 'string', description: 'One of the exact time slot strings returned by check_availability, e.g. "10:00 AM"' },
          patientName: { type: 'string', description: "Patient's full name" },
          patientPhone: { type: 'string', description: "Patient's phone number" },
          patientEmail: { type: 'string', description: "Patient's email address, if given" },
          reason: { type: 'string', description: 'Short reason for the visit, if the patient mentioned one' },
        },
        required: ['dentist', 'date', 'time', 'patientName', 'patientPhone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'capture_lead',
      description:
        "Save the patient's name and phone number as a lead for the front desk, even if they haven't booked yet. Call this as soon as you learn both.",
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
        },
        required: ['name', 'phone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'request_human_handoff',
      description:
        "Flag this conversation for a human staff member to follow up — use when you can't help, the patient asks for a person, seems frustrated, or describes an emergency.",
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Short reason for the handoff' },
        },
        required: ['reason'],
      },
    },
  },
]

async function resolveDentist(query: string) {
  await connectDB()
  if (isValidObjectId(query)) {
    const byId = await Dentist.findById(query).lean()
    if (byId) return byId
  }
  const needle = query.trim().toLowerCase()
  const all = await Dentist.find({}).lean()
  return (
    all.find((d: any) => d.name.toLowerCase() === needle) ||
    all.find((d: any) => d.name.toLowerCase().includes(needle) || needle.includes(d.name.toLowerCase())) ||
    all.find((d: any) => d.specialty.toLowerCase().includes(needle)) ||
    null
  )
}

function isValidDateStr(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T00:00:00`)
  return !Number.isNaN(parsed.getTime())
}

function isPastDate(date: string): boolean {
  // Plain YYYY-MM-DD strings compare lexically the same as chronologically,
  // and comparing against the clinic's own local "today" (rather than the
  // server process's timezone) avoids off-by-one-day mismatches.
  return date < getClinicToday().dateStr
}

function isClosedDate(date: string): boolean {
  // Parse at noon UTC so the weekday can't shift to an adjacent day due to
  // the server's local timezone offset.
  return CLOSED_WEEKDAYS.includes(new Date(`${date}T12:00:00Z`).getUTCDay())
}

async function getFreeSlots(dentistId: string, date: string): Promise<string[]> {
  await connectDB()
  const booked = await Appointment.find({
    dentistId,
    date,
    status: { $ne: 'rejected' },
  })
    .select('time')
    .lean()
  const bookedTimes = new Set(booked.map((a: any) => a.time))
  return TIME_SLOTS.filter((slot) => !bookedTimes.has(slot))
}

export async function executeTool(
  name: string,
  input: Record<string, any>,
  ctx: ChatToolContext
): Promise<string> {
  try {
    switch (name) {
      case 'check_availability': {
        const date = String(input.date || '')
        if (!isValidDateStr(date)) return 'Invalid date format. Use YYYY-MM-DD and ask the patient to confirm the date.'
        if (isPastDate(date)) return 'That date is in the past. Ask the patient for a future date.'
        if (isClosedDate(date)) return 'The clinic is closed on Sundays. Ask the patient to pick a different day.'

        const dentistQuery = String(input.dentist || '').trim()
        const wantsAnyDentist = !dentistQuery || /^(any|anyone|whoever|no preference|any\s*one)\b/i.test(dentistQuery)

        if (!wantsAnyDentist) {
          const dentist = await resolveDentist(dentistQuery)
          if (!dentist) return `No dentist found matching "${input.dentist}". Ask the patient to pick from the listed dentists.`

          const free = await getFreeSlots(String((dentist as any)._id), date)
          if (free.length === 0) {
            return `${(dentist as any).name} has no open slots on ${date}. Ask the patient if they'd like to try a different date or dentist.`
          }
          return `${(dentist as any).name} has these open slots on ${date}: ${free.join(', ')}.`
        }

        // No preferred dentist — search across all available dentists for the earliest opening.
        await connectDB()
        const allDentists = await Dentist.find({ available: true }).lean()
        if (allDentists.length === 0) return 'No dentists are currently available for booking. Offer a human handoff.'

        const byDentist: { name: string; slots: string[] }[] = []
        for (const d of allDentists) {
          const free = await getFreeSlots(String((d as any)._id), date)
          if (free.length > 0) byDentist.push({ name: (d as any).name, slots: free })
        }

        if (byDentist.length === 0) {
          return `No dentists have open slots on ${date}. Ask the patient if they'd like to try a different date.`
        }

        byDentist.sort((a, b) => TIME_SLOTS.indexOf(a.slots[0]) - TIME_SLOTS.indexOf(b.slots[0]))
        const earliest = byDentist[0]
        const fullSummary = byDentist.map((d) => `${d.name}: ${d.slots.join(', ')}`).join('\n')
        return `On ${date}, the earliest opening is with ${earliest.name} at ${earliest.slots[0]}. Full availability that day:\n${fullSummary}`
      }

      case 'book_appointment': {
        const dentist = await resolveDentist(String(input.dentist || ''))
        if (!dentist) return `No dentist found matching "${input.dentist}". Booking failed — ask the patient to pick from the listed dentists.`

        const date = String(input.date || '')
        const time = String(input.time || '')
        if (!isValidDateStr(date)) return 'Invalid date format. Booking failed — use YYYY-MM-DD.'
        if (isPastDate(date)) return 'That date is in the past. Booking failed — ask for a future date.'
        if (isClosedDate(date)) return 'The clinic is closed on Sundays. Booking failed — ask for a different day.'
        if (!TIME_SLOTS.includes(time)) {
          return `"${time}" is not a valid slot. Valid slots are: ${TIME_SLOTS.join(', ')}. Call check_availability again.`
        }

        const patientName = String(input.patientName || '').trim()
        const patientPhone = String(input.patientPhone || '').trim()
        if (!patientName || !patientPhone) return 'Missing patient name or phone. Booking failed — ask the patient for both.'

        const free = await getFreeSlots(String((dentist as any)._id), date)
        if (!free.includes(time)) {
          return `Sorry, "${time}" on ${date} was just taken. Still open: ${free.join(', ') || 'none'}. Ask the patient to pick another slot.`
        }

        await connectDB()
        let patient = await Patient.findOne({ phone: patientPhone, fullName: patientName })
        if (!patient) {
          patient = await Patient.create({
            fullName: patientName,
            phone: patientPhone,
            email: input.patientEmail || '',
          })
        }

        const appointment = await Appointment.create({
          patientId: patient._id,
          dentistId: (dentist as any)._id,
          date,
          time,
          message: input.reason ? `[Booked via AI receptionist] ${input.reason}` : '[Booked via AI receptionist]',
          status: 'pending',
          patientName,
          patientPhone,
          patientEmail: input.patientEmail || '',
        })

        ctx.conversation.patientName = patientName
        ctx.conversation.patientPhone = patientPhone
        ctx.conversation.status = 'booked'
        ctx.conversation.appointmentId = appointment._id

        return `Booked! ${(dentist as any).name} on ${date} at ${time} for ${patientName}. Status is pending confirmation from our front desk. Let the patient know they'll receive confirmation soon.`
      }

      case 'capture_lead': {
        const name = String(input.name || '').trim()
        const phone = String(input.phone || '').trim()
        if (!name || !phone) return 'Need both name and phone to save a lead.'
        ctx.conversation.patientName = name
        ctx.conversation.patientPhone = phone
        return 'Lead saved.'
      }

      case 'request_human_handoff': {
        ctx.conversation.status = 'handoff'
        ctx.conversation.handoffReason = String(input.reason || 'Not specified')
        return 'Flagged for a human team member to follow up.'
      }

      default:
        return `Unknown tool: ${name}`
    }
  } catch (error) {
    console.error(`Chat tool "${name}" error:`, error)
    return 'Something went wrong running that action. Apologize and offer a human handoff.'
  }
}
