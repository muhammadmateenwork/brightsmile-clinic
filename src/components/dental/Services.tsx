'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Sparkles,
  CircleDot,
  AlignLeft,
  Sun,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ServiceDetail {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  iconBg: string
  popular?: boolean
  fullDescription: string
  benefits: string[]
  process: { step: string; description: string }[]
  duration: string
  recovery: string
}

const services: ServiceDetail[] = [
  {
    icon: Sparkles,
    title: 'Teeth Cleaning',
    description:
      'Professional deep cleaning and polishing to remove plaque, tartar, and stains — keeping your gums healthy and breath fresh.',
    color: 'from-dental-500 to-dental-600',
    iconBg: 'bg-dental-50 text-dental-600',
    fullDescription:
      'Our professional teeth cleaning service goes beyond what regular brushing can achieve. Using ultrasonic scalers and professional-grade polishers, we remove stubborn plaque and tartar buildup that leads to cavities and gum disease. The procedure is thorough yet gentle, leaving your teeth feeling incredibly smooth and fresh.',
    benefits: [
      'Removes plaque and tartar buildup',
      'Prevents gum disease and cavities',
      'Freshens breath significantly',
      'Brightens teeth by removing surface stains',
      'Early detection of dental issues',
    ],
    process: [
      { step: 'Examination', description: 'Thorough inspection of teeth and gums for any concerns' },
      { step: 'Scaling', description: 'Ultrasonic removal of plaque and tartar from all surfaces' },
      { step: 'Polishing', description: 'Professional polishing with special paste for a smooth finish' },
      { step: 'Fluoride', description: 'Optional fluoride treatment to strengthen enamel' },
    ],
    duration: '45-60 minutes',
    recovery: 'No downtime — return to normal activities immediately',
  },
  {
    icon: CircleDot,
    title: 'Dental Implants',
    description:
      'Permanent tooth replacement solutions using biocompatible titanium implants that look, feel, and function like natural teeth.',
    color: 'from-sky-500 to-sky-600',
    iconBg: 'bg-sky-50 text-sky-600',
    fullDescription:
      'Dental implants are the gold standard for replacing missing teeth. A titanium post is surgically placed into the jawbone, where it fuses naturally through osseointegration. Once healed, a custom-crafted crown is attached, creating a replacement tooth that looks, feels, and functions exactly like a natural one. With proper care, implants can last a lifetime.',
    benefits: [
      'Permanent, lifelong tooth replacement',
      'Looks and feels completely natural',
      'Preserves jawbone structure and facial shape',
      'No impact on adjacent teeth',
      '98% success rate',
    ],
    process: [
      { step: 'Consultation', description: '3D imaging and treatment planning with your specialist' },
      { step: 'Implant Placement', description: 'Titanium post is precisely placed into the jawbone' },
      { step: 'Healing Period', description: '3-6 months for the implant to fuse with the bone' },
      { step: 'Crown Attachment', description: 'Custom crown is crafted and permanently attached' },
    ],
    duration: '1-2 hours (surgery), 3-6 months (full process)',
    recovery: '2-7 days for initial healing, soft diet recommended',
  },
  {
    icon: AlignLeft,
    title: 'Braces & Orthodontics',
    description:
      'Traditional braces and modern clear aligner therapy to straighten teeth and correct bite issues for a perfectly aligned smile.',
    color: 'from-violet-500 to-violet-600',
    iconBg: 'bg-violet-50 text-violet-600',
    fullDescription:
      'Whether you prefer traditional braces or modern clear aligners, our orthodontic treatments are designed to give you a perfectly aligned smile. We use digital scanning and 3D treatment planning to create a personalized approach. Clear aligners offer a nearly invisible way to straighten teeth, while traditional braces provide precise control for complex cases.',
    benefits: [
      'Perfectly aligned teeth and correct bite',
      'Improved oral hygiene with straighter teeth',
      'Boosted confidence and self-esteem',
      'Custom treatment plans with 3D technology',
      'Options for invisible or discreet treatment',
    ],
    process: [
      { step: 'Digital Scan', description: '3D digital scan of your teeth for precise treatment planning' },
      { step: 'Treatment Plan', description: 'Custom plan showing step-by-step movement of your teeth' },
      { step: 'Active Treatment', description: 'Regular adjustments or aligner changes every 4-8 weeks' },
      { step: 'Retention', description: 'Custom retainers to maintain your beautiful new smile' },
    ],
    duration: '12-24 months (varies by case)',
    recovery: 'Mild discomfort for 1-3 days after adjustments',
  },
  {
    icon: Sun,
    title: 'Teeth Whitening',
    description:
      'Professional in-office and take-home whitening treatments that deliver dazzling results — up to 8 shades brighter in one visit.',
    color: 'from-amber-500 to-amber-600',
    iconBg: 'bg-amber-50 text-amber-600',
    popular: true,
    fullDescription:
      'Transform your smile with our professional whitening treatments. Our in-office Zoom whitening can brighten your teeth up to 8 shades in a single one-hour session. For a more gradual approach, our take-home whitening kits use custom-fitted trays with professional-grade gel for stunning results over 2 weeks. Both options are safe, effective, and supervised by our dental team.',
    benefits: [
      'Up to 8 shades brighter in one visit',
      'Safe, professional-grade whitening agents',
      'Long-lasting results with proper care',
      'Custom treatment for sensitive teeth',
      'Supervised by dental professionals',
    ],
    process: [
      { step: 'Shade Assessment', description: 'Current tooth shade is recorded for comparison' },
      { step: 'Preparation', description: 'Gums and soft tissues are protected with a special barrier' },
      { step: 'Whitening Application', description: 'Professional-grade gel is applied and activated' },
      { step: 'Results Review', description: 'New shade is assessed and aftercare instructions provided' },
    ],
    duration: '60-90 minutes (in-office)',
    recovery: 'No downtime — avoid dark foods/drinks for 48 hours',
  },
  {
    icon: Shield,
    title: 'Root Canal Treatment',
    description:
      'Pain-free root canal therapy using advanced rotary instruments and microscope-assisted techniques to save damaged teeth.',
    color: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600',
    fullDescription:
      'Modern root canal treatment is virtually painless thanks to advanced anesthetics and microscope-assisted techniques. The procedure removes infected pulp from inside the tooth, cleans and shapes the root canals, then seals them to prevent reinfection. A crown is placed to restore the tooth to full function, saving your natural tooth for years to come.',
    benefits: [
      'Saves your natural tooth from extraction',
      'Virtually painless with modern techniques',
      'Eliminates infection and relieves pain',
      'Restores full chewing function',
      'Prevents spread of infection to other teeth',
    ],
    process: [
      { step: 'Diagnosis', description: 'Digital X-rays and examination to confirm infection' },
      { step: 'Anesthesia', description: 'Local anesthesia ensures complete comfort throughout' },
      { step: 'Canal Treatment', description: 'Infected pulp is removed and canals are cleaned and shaped' },
      { step: 'Restoration', description: 'Canals are sealed and a protective crown is placed' },
    ],
    duration: '60-90 minutes (1-2 visits)',
    recovery: 'Mild soreness for 1-3 days, managed with over-the-counter pain relief',
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const handleBookFromService = () => {
    setSelectedService(null)
    setTimeout(() => {
      const el = document.querySelector('#appointment')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <section
      id="services"
      className="py-20 sm:py-28 dental-gradient-light relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Decorative dot pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="2" fill="#0284c7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-dental-500 tracking-wide uppercase">
            What We Offer
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900 tracking-tight">
            Our Services
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
          <p className="mt-6 text-lg text-dental-600/80 max-w-2xl mx-auto">
            From preventive care to advanced restorations, we offer a full
            spectrum of dental services to keep your smile healthy and beautiful.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-dental-100/60 bg-white hover:border-dental-200 hover:shadow-2xl hover:shadow-dental-100/30 transition-all duration-500 rounded-2xl h-full hover:-translate-y-1">
                {/* Top accent bar */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${service.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                />
                {/* Popular badge for Teeth Whitening */}
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                    Popular
                  </div>
                )}
                <CardContent className="p-7">
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-dental-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-dental-600/70 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center text-sm font-semibold text-dental-600 hover:text-dental-700 hover:bg-dental-50 rounded-lg px-3 py-1.5 -ml-3 transition-all duration-200"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl border-dental-100 max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <div>
              {/* Accessibility Header */}
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedService.title}</DialogTitle>
                <DialogDescription>
                  Details and booking information for {selectedService.title}
                </DialogDescription>
              </DialogHeader>

              {/* Header with gradient */}
              <div className={`relative bg-gradient-to-r ${selectedService.color} p-6 sm:p-8`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <selectedService.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedService.title}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedService.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-base font-bold text-dental-800 mb-2">About This Service</h3>
                  <p className="text-sm text-dental-600/80 leading-relaxed">
                    {selectedService.fullDescription}
                  </p>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-base font-bold text-dental-800 mb-3">Key Benefits</h3>
                  <div className="space-y-2.5">
                    {selectedService.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-dental-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div>
                  <h3 className="text-base font-bold text-dental-800 mb-3">What to Expect</h3>
                  <div className="space-y-3">
                    {selectedService.process.map((step, idx) => (
                      <div key={step.step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-dental-50 border-2 border-dental-200 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-dental-600">{idx + 1}</span>
                          </div>
                          {idx < selectedService.process.length - 1 && (
                            <div className="w-px h-full bg-dental-100 my-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-semibold text-dental-800">{step.step}</p>
                          <p className="text-xs text-dental-600/70 mt-0.5 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration & Recovery */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dental-50 rounded-xl">
                    <Clock className="w-5 h-5 text-dental-500 mb-2" />
                    <p className="text-xs text-dental-500 font-medium mb-0.5">Duration</p>
                    <p className="text-sm font-semibold text-dental-800">{selectedService.duration}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-xs text-emerald-600 font-medium mb-0.5">Recovery</p>
                    <p className="text-sm font-semibold text-dental-800">{selectedService.recovery}</p>
                  </div>
                </div>

                {/* Book CTA */}
                <Button
                  onClick={handleBookFromService}
                  className="w-full bg-dental-600 hover:bg-dental-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-dental-600/20 hover:shadow-dental-700/25 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book {selectedService.title} Appointment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}