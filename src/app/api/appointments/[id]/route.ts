import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isValidObjectId, Appointment } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    const body = await request.json()

    const appointment: any = await Appointment.findByIdAndUpdate(
      id,
      { ...(body.status ? { status: body.status } : {}) },
      { new: true }
    ).lean()

    return NextResponse.json({
      ...appointment,
      id: appointment._id.toString() // Mapped for frontend consistency
    })
  } catch (error) {
    console.error('Update appointment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid appointment ID' }, { status: 400 })
    }

    await Appointment.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete appointment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}