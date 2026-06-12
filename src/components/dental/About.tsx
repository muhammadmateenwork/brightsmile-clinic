'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Cpu, UserCheck, Heart, DollarSign } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Advanced Technology',
    description:
      'State-of-the-art equipment including 3D imaging, laser dentistry, and digital impressions for precise, comfortable treatments.',
    color: 'bg-dental-50 text-dental-600',
    borderColor: 'border-dental-100',
    hoverShadow: 'hover:shadow-dental-100/40',
  },
  {
    icon: UserCheck,
    title: 'Expert Team',
    description:
      'Board-certified specialists with decades of combined experience across all dental disciplines under one roof.',
    color: 'bg-sky-50 text-sky-600',
    borderColor: 'border-sky-100',
    hoverShadow: 'hover:shadow-sky-100/40',
  },
  {
    icon: Heart,
    title: 'Patient Comfort',
    description:
      'Sedation options, pain-free procedures, and a relaxing environment designed to make every visit stress-free.',
    color: 'bg-rose-50 text-rose-500',
    borderColor: 'border-rose-100',
    hoverShadow: 'hover:shadow-rose-100/40',
  },
  {
    icon: DollarSign,
    title: 'Affordable Care',
    description:
      'Flexible payment plans, insurance assistance, and transparent pricing so quality dental care is accessible to everyone.',
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'border-emerald-100',
    hoverShadow: 'hover:shadow-emerald-100/40',
  },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime
    const increment = target / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-20 sm:py-28 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Decorative gradient orb */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-dental-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-dental-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-dental-500 tracking-wide uppercase">
            Who We Are
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900 tracking-tight">
            About BrightSmile
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-dental-800 mb-6 leading-tight">
              Transforming Smiles with{' '}
              <span className="text-dental-600">Compassion & Excellence</span>
            </h3>
            <p className="text-dental-600/80 leading-relaxed mb-4 text-base">
              At BrightSmile Dental Clinic, we believe everyone deserves a
              confident, healthy smile. Founded over 15 years ago, our clinic
              has grown into one of the most trusted dental practices, combining
              advanced technology with personalized care.
            </p>
            <p className="text-dental-600/80 leading-relaxed mb-8 text-base">
              Our team of 25+ board-certified dentists and specialists work
              together to provide comprehensive dental solutions — from routine
              cleanings to complex restorations — all under one roof. We are
              committed to making every visit comfortable, efficient, and
              tailored to your unique needs.
            </p>

            {/* Animated Counters */}
            <div className="relative grid grid-cols-3 gap-0 bg-white rounded-2xl border border-dental-100/60 overflow-hidden shadow-sm">
              {/* Gradient top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dental-400 via-dental-500 to-dental-400" />
              <div className="text-center py-5 px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-dental-600 tracking-tight">
                  <AnimatedCounter target={15} suffix="+" />
                </p>
                <p className="text-sm text-dental-500 mt-1 font-medium">Years</p>
              </div>
              <div className="text-center py-5 px-4 border-x border-dental-100/60">
                <p className="text-2xl sm:text-3xl font-extrabold text-dental-600 tracking-tight">
                  <AnimatedCounter target={10000} suffix="+" />
                </p>
                <p className="text-sm text-dental-500 mt-1 font-medium">Patients</p>
              </div>
              <div className="text-center py-5 px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-dental-600 tracking-tight">
                  <AnimatedCounter target={25} suffix="+" />
                </p>
                <p className="text-sm text-dental-500 mt-1 font-medium">Dentists</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className={`group p-6 rounded-2xl border ${feature.borderColor} bg-white hover:shadow-xl ${feature.hoverShadow} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-dental-800 mb-2 text-base">
                  {feature.title}
                </h4>
                <p className="text-sm text-dental-600/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
