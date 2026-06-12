import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isValidObjectId, Dentist, Appointment } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await connectDB()

    const { id } = await params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid dentist ID' },
        { status: 400 }
      )
    }

    const dentist = await Dentist.findById(id).lean()

    if (!dentist) {
      return NextResponse.json(
        { error: 'Dentist not found' },
        { status: 404 }
      )
    }

    const appointmentCount = await Appointment.countDocuments({
      dentistId: id,
    })

    return NextResponse.json({
      ...dentist,
      id: dentist._id.toString(), // Mapped for frontend
      _id: dentist._id.toString(),
      _count: {
        appointments: appointmentCount,
      },
    })
  } catch (error) {
    console.error('Get dentist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid dentist ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.specialty !== undefined) updateData.specialty = body.specialty
    if (body.experience !== undefined)
      updateData.experience = Number(body.experience)
    if (body.image !== undefined) updateData.image = body.image
    if (body.description !== undefined)
      updateData.description = body.description
    if (body.qualifications !== undefined)
      updateData.qualifications = body.qualifications
    if (body.available !== undefined) updateData.available = body.available

    const updated = await Dentist.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean()

    if (!updated) {
      return NextResponse.json(
        { error: 'Dentist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...updated,
      id: updated._id.toString(), // Mapped for frontend
      _id: updated._id.toString(),
    })
  } catch (error) {
    console.error('Update dentist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(_.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid dentist ID' },
        { status: 400 }
      )
    }

    const deleted = await Dentist.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Dentist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete dentist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}