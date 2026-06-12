import { NextRequest, NextResponse } from 'next/server'
import { connectDB, ContactMessage } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    })

    return NextResponse.json({ success: true, id: contactMessage._id.toString() }, { status: 201 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
