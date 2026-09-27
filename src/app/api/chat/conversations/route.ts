import { NextRequest, NextResponse } from 'next/server'
import { connectDB, ChatConversation } from '@/lib/db'
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
    const filter: any = {}
    if (status) filter.status = status

    const conversations = await ChatConversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .limit(200)
      .lean()

    const result = conversations.map((c: any) => ({
      id: c._id.toString(),
      sessionId: c.sessionId,
      patientName: c.patientName,
      patientPhone: c.patientPhone,
      status: c.status,
      handoffReason: c.handoffReason,
      appointmentId: c.appointmentId ? c.appointmentId.toString() : null,
      messageCount: c.messages?.length || 0,
      lastMessage: c.messages?.length ? c.messages[c.messages.length - 1] : null,
      createdAt: c.createdAt,
      lastMessageAt: c.lastMessageAt,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('List chat conversations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
