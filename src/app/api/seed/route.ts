import { NextResponse } from 'next/server'
import { connectDB, Admin, Dentist, Patient, Appointment, BeforeAfterCase } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    await connectDB()

    // Check if already seeded
    const adminCount = await Admin.countDocuments()
    if (adminCount > 0) {
      return NextResponse.json({ message: 'Database already seeded' })
    }

    // Create admin
    const hashedPassword = await hashPassword('admin123')
    await Admin.create({
      email: 'admin@brightsmile.com',
      password: hashedPassword,
      name: 'Dr. Admin',
    })

    // Create dentists
    const dentists = await Dentist.insertMany([
      {
        name: 'Dr. Sarah Mitchell',
        specialty: 'Orthodontics',
        experience: 12,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
        description: 'Specialist in braces and clear aligner therapy with over 12 years of experience creating beautiful smiles.',
        qualifications: 'DDS, MS Orthodontics - Harvard School of Dental Medicine',
        available: true,
      },
      {
        name: 'Dr. James Rodriguez',
        specialty: 'Dental Implants',
        experience: 15,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
        description: 'Expert in implant dentistry and full mouth rehabilitation. Pioneer in minimally invasive implant techniques.',
        qualifications: 'DMD, FICOI - UCLA School of Dentistry',
        available: true,
      },
      {
        name: 'Dr. Emily Chen',
        specialty: 'Cosmetic Dentistry',
        experience: 9,
        image: '/dentist-emily-chen.png',
        description: 'Passionate about creating stunning smile transformations through veneers, whitening, and aesthetic procedures.',
        qualifications: 'DDS, AACD Member - Columbia University College of Dental Medicine',
        available: true,
      },
      {
        name: 'Dr. Michael Thompson',
        specialty: 'Endodontics',
        experience: 18,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
        description: 'Root canal specialist utilizing advanced microscope-assisted techniques for pain-free procedures.',
        qualifications: 'DDS, MS Endodontics - University of Michigan School of Dentistry',
        available: true,
      },
    ])

    // Create before/after cases
    await BeforeAfterCase.insertMany([
      {
        title: 'Professional Teeth Whitening',
        category: 'Teeth Whitening',
        beforeImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop',
        description: 'Dramatic whitening results achieved with our advanced laser whitening system. Patient saw 8 shades of improvement in a single session.',
      },
      {
        title: 'Clear Aligner Treatment',
        category: 'Braces Alignment',
        beforeImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=600&h=400&fit=crop',
        description: 'Complete alignment correction using clear aligners over 14 months. No traditional braces needed.',
      },
      {
        title: 'Porcelain Veneer Transformation',
        category: 'Cosmetic Restoration',
        beforeImage: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&h=400&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1581585090258-1b0e1b6b16b5?w=600&h=400&fit=crop',
        description: 'Complete smile makeover with custom porcelain veneers. Natural-looking results that last 15+ years.',
      },
      {
        title: 'Dental Implant Restoration',
        category: 'Dental Implants',
        beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=400&fit=crop',
        afterImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop',
        description: 'Single tooth implant with natural-looking crown. Permanent solution that looks and functions like a real tooth.',
      },
    ])

    // Create sample patients
    const patients = await Patient.insertMany([
      { fullName: 'Alice Johnson', phone: '+1-555-0101', email: 'alice@email.com' },
      { fullName: 'Bob Smith', phone: '+1-555-0102', email: 'bob@email.com' },
      { fullName: 'Carol Davis', phone: '+1-555-0103', email: 'carol@email.com' },
      { fullName: 'David Wilson', phone: '+1-555-0104', email: 'david@email.com' },
      { fullName: 'Eva Martinez', phone: '+1-555-0105', email: 'eva@email.com' },
    ])

    // Create sample appointments
    const statuses = ['pending', 'approved', 'rejected']
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    const messages = [
      'Regular checkup and cleaning',
      'Tooth pain in lower right molar',
      'Interested in teeth whitening',
      'Need braces consultation',
      'Broken filling needs replacement',
      'Root canal consultation',
    ]

    const appointmentData = []
    for (let i = 0; i < 8; i++) {
      const patient = patients[i % patients.length]
      const dentist = dentists[i % dentists.length]
      const date = new Date()
      date.setDate(date.getDate() + Math.floor(Math.random() * 14))

      appointmentData.push({
        patientId: patient._id,
        dentistId: dentist._id,
        date: date.toISOString().split('T')[0],
        time: times[i % times.length],
        message: messages[i % messages.length],
        status: statuses[i % 3],
        patientName: patient.fullName,
        patientPhone: patient.phone,
        patientEmail: patient.email,
      })
    }

    await Appointment.insertMany(appointmentData)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      credentials: { email: 'admin@brightsmile.com', password: 'admin123' },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
