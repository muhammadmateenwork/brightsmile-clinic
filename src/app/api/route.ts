import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'BrightSmile Dental API is running', database: 'MongoDB Atlas' })
}
