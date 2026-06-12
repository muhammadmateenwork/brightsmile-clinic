import { NextRequest, NextResponse } from 'next/server'
import { connectDB, Dentist, Appointment, Patient } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [
      totalDentists,
      totalAppointments,
      totalPatients,
      pendingAppointments,
      approvedAppointments,
      rejectedAppointments,
      recentAppointmentsData,
      dentistsWithCount,
    ] = await Promise.all([
      Dentist.countDocuments(),
      Appointment.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'approved' }),
      Appointment.countDocuments({ status: 'rejected' }),
      Appointment.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('dentistId', 'name specialty') // Fixed field reference
        .lean(),
      Dentist.find({}).select('name').lean(),
    ])

    // Map dentistId to dentist to match the frontend DashboardStats interface
    const recentAppointments = recentAppointmentsData.map((apt: any) => ({
      ...apt,
      id: apt._id.toString(),
      dentist: apt.dentistId,
      dentistId: apt.dentistId?._id?.toString() || apt.dentistId
    }))

    // Get appointment count per dentist
    const appointmentsByDentist = await Promise.all(
      dentistsWithCount.map(async (dentist) => {
        const count = await Appointment.countDocuments({ dentistId: dentist._id })
        return { name: dentist.name, _count: { appointments: count } }
      })
    )

    return NextResponse.json({
      totalDentists,
      totalAppointments,
      totalPatients,
      pendingAppointments,
      approvedAppointments,
      rejectedAppointments,
      recentAppointments,
      appointmentsByDentist,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}