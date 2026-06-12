import mongoose from 'mongoose'

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
export default mongoose.models.BeforeAfterCase || mongoose.model('BeforeAfterCase', BeforeAfterCaseSchema, 'BeforeAfterCase')