import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isValidObjectId, Appointment, Patient } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const dentistId = searchParams.get('dentistId')

    const filter: any = {}

    if (status) filter.status = status

    if (dentistId) {
      if (!isValidObjectId(dentistId)) {
        return NextResponse.json({ error: 'Invalid dentist ID' }, { status: 400 })
      }
      filter.dentistId = dentistId
    }

    const appointments = await Appointment.find(filter)
      .populate('dentistId', 'name specialty')
      .sort({ createdAt: -1 })
      .lean()

    // Map dentistId to dentist to match the frontend interface
    const formattedAppointments = appointments.map((apt: any) => ({
      ...apt,
      id: apt._id.toString(),
      dentist: apt.dentistId,
      dentistId: apt.dentistId?._id?.toString() || apt.dentistId
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error('Get appointments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      patientName,
      patientPhone,
      patientEmail,
      dentistId,
      date,
      time,
      message,
    } = body

    if (!patientName || !patientPhone || !dentistId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!isValidObjectId(dentistId)) {
      return NextResponse.json({ error: 'Invalid dentist ID' }, { status: 400 })
    }

    let patient = await Patient.findOne({
      phone: patientPhone,
      fullName: patientName,
    })

    if (!patient) {
      patient = await Patient.create({
        fullName: patientName,
        phone: patientPhone,
        email: patientEmail || '',
      })
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      dentistId,
      date,
      time,
      message: message || '',
      status: 'pending',
      patientName,
      patientPhone,
      patientEmail: patientEmail || '',
    })

    const result = await Appointment.findById(appointment._id).lean()

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Create appointment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}