import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

const globalForMongoose = globalThis as unknown as {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const cached = globalForMongoose.mongoose || {
  conn: null,
  promise: null,
}

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  cached.conn = await cached.promise
  return cached.conn
}

export function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}