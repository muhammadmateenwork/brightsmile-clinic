// Single source of truth for BrightSmile Dental Clinic's public info.
// The AI receptionist (src/lib/chat) grounds its answers in this data so it
// never invents prices, hours, or policies.

export const CLINIC_ADDRESS = {
  street: '123 Dental Avenue, Suite 200',
  city: 'New York, NY 10001',
  country: 'United States',
  full: '123 Dental Avenue, Suite 200, New York, NY 10001, United States',
  phone: '+1 (555) 123-4567',
  email: 'hello@brightsmile.com',
  googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=123+Dental+Avenue+New+York+NY+10001',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1623456789!5m2!1sen!2sus',
}

export const WORKING_HOURS = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { day: 'Saturday', time: '9:00 AM – 4:00 PM', days: ['Saturday'] },
  { day: 'Sunday', time: 'Closed', days: ['Sunday'] },
]

// Days the clinic is closed (JS Date.getDay(): 0 = Sunday)
export const CLOSED_WEEKDAYS = [0]

// The clinic's local timezone — used to ground "today"/"tomorrow" so the AI
// receptionist doesn't guess the current date (it has no other way to know it).
export const CLINIC_TIMEZONE = 'America/New_York'

export function getClinicToday(): { dateStr: string; weekday: string; display: string } {
  const now = new Date()
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: CLINIC_TIMEZONE, weekday: 'long' }).format(now)
  const display = new Intl.DateTimeFormat('en-US', {
    timeZone: CLINIC_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now)
  return { dateStr, weekday, display }
}

// Bookable time slots, matching the public appointment form.
export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export interface ServiceInfo {
  name: string
  description: string
  duration: string
  priceRange: string
}

export const SERVICES: ServiceInfo[] = [
  {
    name: 'Teeth Cleaning',
    description: 'Professional deep cleaning and polishing to remove plaque, tartar, and stains.',
    duration: '45-60 minutes',
    priceRange: '$90 - $150',
  },
  {
    name: 'Dental Implants',
    description: 'Permanent tooth replacement using biocompatible titanium implants.',
    duration: '1-2 hours (surgery), 3-6 months (full process)',
    priceRange: '$2,500 - $4,500 per implant',
  },
  {
    name: 'Braces & Orthodontics',
    description: 'Traditional braces and clear aligner therapy to straighten teeth and correct bite issues.',
    duration: '12-24 months',
    priceRange: '$3,000 - $6,500',
  },
  {
    name: 'Teeth Whitening',
    description: 'Professional in-office and take-home whitening treatments, up to 8 shades brighter.',
    duration: '60-90 minutes (in-office)',
    priceRange: '$250 - $600',
  },
  {
    name: 'Root Canal Treatment',
    description: 'Pain-free root canal therapy using advanced rotary instruments and microscope-assisted techniques.',
    duration: '60-90 minutes (1-2 visits)',
    priceRange: '$700 - $1,500 per tooth',
  },
]

export const CLINIC_POLICIES = [
  'New patients should arrive 15 minutes early to complete intake paperwork.',
  'Appointments booked online or through the chat assistant are marked "pending" until our front desk confirms them, usually within a few hours during business hours.',
  'We accept most major dental insurance plans — patients should bring their insurance card to their first visit.',
  'Cancellations should be made at least 24 hours in advance.',
  'For dental emergencies (severe pain, trauma, uncontrolled bleeding), call the clinic directly or go to the nearest emergency room — the chat assistant cannot handle emergencies.',
]

export function formatWorkingHours(): string {
  return WORKING_HOURS.map((wh) => `${wh.day}: ${wh.time}`).join('\n')
}

export function formatServices(): string {
  return SERVICES.map(
    (s) => `- ${s.name}: ${s.description} (Duration: ${s.duration}, Price: ${s.priceRange})`
  ).join('\n')
}
