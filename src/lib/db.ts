import mongoose from 'mongoose'

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set. Add it to .env.local')
  }
  return uri
}

const MONGODB_URI = getMongoUri()

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as unknown as {
  mongoose: MongooseCache | undefined
}

const cached: MongooseCache = globalForMongoose.mongoose ?? { conn: null, promise: null }

if (process.env.NODE_ENV !== 'production') globalForMongoose.mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// MongoDB ObjectId validation helper
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && /^[a-fA-F0-9]{24}$/.test(id)
}

// ============ Mongoose Models ============

// Admin Schema
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'Admin'
})

// Dentist Schema
const DentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  qualifications: { type: String, default: '' },
  available: { type: Boolean, default: true },
}, { 
  timestamps: true,
  collection: 'Dentist'
})

// Patient Schema
const PatientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
}, { 
  timestamps: true,
  collection: 'Patient'
})

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  dentistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dentist', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String, default: '' },
}, { 
  timestamps: true,
  collection: 'Appointment'
})

// BeforeAfterCase Schema
const BeforeAfterCaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true },
  description: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'BeforeAfterCase'
})

// ContactMessage Schema
const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, {
  timestamps: true,
  collection: 'ContactMessage'
})

// ChatMessage sub-schema (embedded in ChatConversation)
const ChatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
  _id: false,
})

// ChatConversation Schema - AI receptionist widget conversations
const ChatConversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  messages: { type: [ChatMessageSchema], default: [] },
  patientName: { type: String, default: '' },
  patientPhone: { type: String, default: '' },
  status: { type: String, enum: ['active', 'handoff', 'booked', 'resolved'], default: 'active' },
  handoffReason: { type: String, default: '' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
  lastMessageAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  collection: 'ChatConversation'
})

// Export models (prevent OverwriteModelError in dev) with strict 3rd arguments
export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema, 'Admin')
export const Dentist = mongoose.models.Dentist || mongoose.model('Dentist', DentistSchema, 'Dentist')
export const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema, 'Patient')
export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema, 'Appointment')
export const BeforeAfterCase = mongoose.models.BeforeAfterCase || mongoose.model('BeforeAfterCase', BeforeAfterCaseSchema, 'BeforeAfterCase')
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema, 'ContactMessage')
export const ChatConversation = mongoose.models.ChatConversation || mongoose.model('ChatConversation', ChatConversationSchema, 'ChatConversation')