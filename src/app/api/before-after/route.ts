import { NextRequest, NextResponse } from 'next/server'
import { connectDB, BeforeAfterCase } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const cases = await BeforeAfterCase.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(cases)
  } catch (error) {
    console.error('Get before/after error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
    const { title, category, beforeImage, afterImage, description } = body

    if (!title || !category || !beforeImage || !afterImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const beforeAfterCase = await BeforeAfterCase.create({
      title,
      category,
      beforeImage,
      afterImage,
      description: description || '',
    })

    return NextResponse.json(beforeAfterCase, { status: 201 })
  } catch (error) {
    console.error('Create before/after error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
