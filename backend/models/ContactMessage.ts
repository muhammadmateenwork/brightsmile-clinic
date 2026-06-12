import mongoose from 'mongoose'

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
export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema, 'ContactMessage')