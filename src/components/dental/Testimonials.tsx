'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Testimonial {
  id: string
  name: string
  treatment: string
  rating: number
  review: string
  time: string
  initials: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    treatment: 'Teeth Whitening',
    rating: 5,
    review: 'The whitening results were incredible! My teeth went from coffee-stained to brilliantly white in just one session. Dr. Chen is amazing!',
    time: '2 weeks ago',
    initials: 'SJ',
  },
  {
    id: '2',
    name: 'Michael Torres',
    treatment: 'Dental Implants',
    rating: 5,
    review: 'After losing a tooth in an accident, I was self-conscious about my smile. The implant looks and feels completely natural. Life-changing!',
    time: '1 month ago',
    initials: 'MT',
  },
  {
    id: '3',
    name: 'Emily Watson',
    treatment: 'Braces',
    rating: 5,
    review: 'Dr. Mitchell made the entire orthodontic process so comfortable. My teeth are now perfectly aligned and I can\'t stop smiling!',
    time: '3 weeks ago',
    initials: 'EW',
  },
  {
    id: '4',
    name: 'David Park',
    treatment: 'Root Canal',
    rating: 5,
    review: 'I was terrified of getting a root canal, but Dr. Thompson made it completely pain-free. The whole experience was surprisingly pleasant.',
    time: '1 week ago',
    initials: 'DP',
  },
  {
    id: '5',
    name: 'Lisa Chen',
    treatment: 'Teeth Cleaning',
    rating: 5,
    review: 'Best dental cleaning I\'ve ever had. The hygienist was thorough yet gentle, and my teeth have never felt so clean and fresh.',
    time: '5 days ago',
    initials: 'LC',
  },
  {
    id: '6',
    name: 'Robert Kim',
    treatment: 'Dental Bonding',
    rating: 5,
    review: 'Chipped my front tooth right before a big event. Dr. Chen fixed it in one visit and you can\'t even tell it was ever damaged!',
    time: '2 months ago',
    initials: 'RK',
  },
]

const avatarColors = [
  'from-dental-400 to-dental-600',
  'from-emerald-400 to-emerald-600',
  'from-sky-400 to-sky-600',
  'from-violet-400 to-violet-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
]

export default function Testimonials() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      id="testimonials"
      className="py-20 sm:py-28 bg-gradient-to-b from-dental-50/50 to-white relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-80 h-80 bg-dental-100/25 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-dental-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-dental-500 tracking-wide uppercase">
            Patient Reviews
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900 tracking-tight">
            What Our Patients Say
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
          <p className="mt-6 text-lg text-dental-600/80 max-w-2xl mx-auto">
            Real stories from real patients. Discover why thousands trust BrightSmile
            for their dental care.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border-dental-100/60 bg-white hover:border-dental-200 hover:shadow-2xl hover:shadow-dental-100/30 transition-all duration-500 rounded-2xl hover:-translate-y-1">
                <div className="p-6 flex flex-col h-full">
                  {/* Quote icon and rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-dental-50 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-dental-400" />
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <Star
                          key={si}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-dental-700/80 leading-relaxed mb-5 flex-1">
                    &ldquo;{t.review}&rdquo;
                  </p>

                  {/* Treatment badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-dental-50 text-dental-600 text-[11px] font-semibold tracking-wide">
                      {t.treatment}
                    </span>
                  </div>

                  {/* Patient info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-dental-100/60">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center shadow-sm`}>
                      <span className="text-xs font-bold text-white">{t.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dental-800 truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-dental-400">{t.time}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
