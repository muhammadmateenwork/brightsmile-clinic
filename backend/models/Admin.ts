import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'Admin'
})

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema, 'Admin')