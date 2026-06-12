import { NextRequest, NextResponse } from 'next/server'
import { connectDB, isValidObjectId, BeforeAfterCase } from '@/lib/db'
import { verifyToken, getTokenFromHeaders } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.title) updateData.title = body.title
    if (body.category) updateData.category = body.category
    if (body.beforeImage) updateData.beforeImage = body.beforeImage
    if (body.afterImage) updateData.afterImage = body.afterImage
    if (body.description !== undefined) updateData.description = body.description

    const beforeAfterCase = await BeforeAfterCase.findByIdAndUpdate(id, updateData, { new: true }).lean()

    return NextResponse.json(beforeAfterCase)
  } catch (error) {
    console.error('Update before/after error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid case ID' }, { status: 400 })
    }

    await BeforeAfterCase.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete before/after error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
