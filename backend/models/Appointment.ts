import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    dentistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dentist', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientEmail: { type: String, default: '' },
  },
  { 
    timestamps: true,
    collection: 'Appointment'
  }
)

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema, 'Appointment')