import mongoose from 'mongoose'

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
export default mongoose.models.Dentist || mongoose.model('Dentist', DentistSchema, 'Dentist')