import { NextRequest, NextResponse } from 'next/server'
import { connectDB, Dentist, Appointment } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const dentists = await Dentist.find({}).sort({ createdAt: -1 }).lean()

    const dentistsWithCount = await Promise.all(
      dentists.map(async (dentist: any) => {
        const appointmentCount = await Appointment.countDocuments({
          dentistId: dentist._id,
        })

        return {
          ...dentist,
          id: dentist._id.toString(), // Mapped for frontend
          _id: dentist._id.toString(),
          _count: {
            appointments: appointmentCount,
          },
        }
      })
    )

    return NextResponse.json(dentistsWithCount)
  } catch (error) {
    console.error('Get dentists error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      specialty,
      experience,
      image,
      description,
      qualifications,
      available,
    } = body

    if (!name || !specialty || experience === undefined || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dentist = await Dentist.create({
      name,
      specialty,
      experience: Number(experience),
      image,
      description: description || '',
      qualifications: qualifications || '',
      available: available ?? true,
    })

    const result = {
      ...dentist.toObject(),
      id: dentist._id.toString(), // Mapped for frontend
      _id: dentist._id.toString()
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Create dentist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}