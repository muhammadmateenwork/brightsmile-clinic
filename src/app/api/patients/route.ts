import { NextRequest, NextResponse } from 'next/server'
import { connectDB, Patient, Appointment } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patients = await Patient.find({})
      .sort({ createdAt: -1 })
      .lean()

    // Add appointment count and recent appointments for each patient
    const patientsWithAppointments = await Promise.all(
      patients.map(async (patient: any) => {
        const appointmentCount = await Appointment.countDocuments({ patientId: patient._id })
        const recentAppointments = await Appointment.find({ patientId: patient._id })
          .select('_id date time status dentistId')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean()
        
        return {
          ...patient,
          id: patient._id?.toString(), 
          _id: patient._id?.toString(),
          _count: { appointments: appointmentCount || 0 },
          appointments: recentAppointments.map((apt: any) => ({
            ...apt,
            id: apt._id?.toString()
          })),
        }
      })
    )

    return NextResponse.json(patientsWithAppointments)
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}