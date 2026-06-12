import mongoose from 'mongoose'

const PatientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
}, { 
  timestamps: true,
  collection: 'Patient'
})

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema, 'Patient')