'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Phone, Award, Users, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stats = [
  { icon: Clock, value: '15+', label: 'Years Experience' },
  { icon: Users, value: '10,000+', label: 'Happy Patients' },
  { icon: Award, value: '25+', label: 'Expert Dentists' },
]

export default function Hero() {
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-dental-50/60 via-white to-white" />
        <div className="absolute top-20 right-0 w-[700px] h-[700px] bg-dental-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-dental-50/40 rounded-full blur-3xl" />
        {/* Decorative circles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute top-32 right-20 w-80 h-80 border border-dental-200/15 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute top-48 right-36 w-56 h-56 border border-dental-300/10 rounded-full hidden lg:block"
        />
        {/* Floating smile decorative dot pattern */}
        <svg
          className="absolute top-40 right-8 w-40 h-40 opacity-[0.07] hidden lg:block"
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="80" cy="40" r="6" fill="#0284c7" />
          <circle cx="40" cy="80" r="4" fill="#0ea5e9" />
          <circle cx="120" cy="80" r="4" fill="#0ea5e9" />
          <circle cx="80" cy="120" r="5" fill="#0284c7" />
          <circle cx="56" cy="56" r="3" fill="#0ea5e9" />
          <circle cx="104" cy="56" r="3" fill="#0ea5e9" />
          <circle cx="56" cy="104" r="3" fill="#0ea5e9" />
          <circle cx="104" cy="104" r="3" fill="#0ea5e9" />
          <circle cx="80" cy="80" r="8" fill="#0284c7" />
          <circle cx="30" cy="40" r="2.5" fill="#0ea5e9" />
          <circle cx="130" cy="40" r="2.5" fill="#0ea5e9" />
          <circle cx="30" cy="120" r="2.5" fill="#0ea5e9" />
          <circle cx="130" cy="120" r="2.5" fill="#0ea5e9" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <motion.div
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 bg-white border border-dental-200/50 rounded-full px-5 py-2 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-dental-700">
                Now Accepting New Patients
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-7xl font-extrabold text-dental-900 leading-[1.08] tracking-tight"
            >
              Your Perfect{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-dental-600">Smile</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8.5C30 2.5 70 2 100 5.5C130 9 170 4 198 7"
                    stroke="#0ea5e9"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.3"
                  />
                </svg>
              </span>{' '}
              Starts Here
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mt-7 text-lg sm:text-xl text-dental-600/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Experience world-class dental care with cutting-edge technology and
              a compassionate team dedicated to giving you the smile you deserve.
            </motion.p>

            <motion.div
              custom={3}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={() => scrollToSection('#appointment')}
                size="lg"
                className="bg-dental-600 hover:bg-dental-700 text-white rounded-xl px-8 h-13 text-base font-semibold shadow-lg shadow-dental-600/20 hover:shadow-xl hover:shadow-dental-700/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => scrollToSection('#dentists')}
                variant="outline"
                size="lg"
                className="border-dental-200 text-dental-700 hover:bg-dental-50 hover:border-dental-300 rounded-xl px-8 h-13 text-base font-medium transition-all duration-300"
              >
                <Phone className="w-4 h-4 mr-2" />
                Consult a Dentist
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              custom={4}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mt-10 flex items-center gap-4 justify-center lg:justify-start bg-white/60 backdrop-blur-sm border border-dental-100/50 rounded-xl px-5 py-3 shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-dental-800 ml-1">4.9</span>
              </div>
              <div className="w-px h-5 bg-dental-200" />
              <span className="text-sm text-dental-700 font-semibold">2,500+ Reviews</span>
              <div className="w-px h-5 bg-dental-200 hidden sm:block" />
              <span className="text-sm text-dental-700 font-semibold hidden sm:inline">ADA Certified</span>
            </motion.div>
          </div>

          {/* Right: Dental clinic image with floating badges */}
          <motion.div
            custom={5}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-[480px] h-[420px]">
              {/* Main image */}
              <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl shadow-dental-200/40 border border-white/80">
                <img
                  src="/dental-clinic-hero.png"
                  alt="BrightSmile Dental Clinic Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dental-900/20 to-transparent" />
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-0 bg-white rounded-2xl shadow-xl p-4 border border-dental-50 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dental-50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-dental-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dental-800">Top Rated</p>
                    <p className="text-[11px] text-dental-500 font-medium">4.9/5 Stars</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl p-4 border border-dental-50 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dental-800">10K+ Patients</p>
                    <p className="text-[11px] text-dental-500 font-medium">Satisfied</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [-3, 7, -3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 right-8 bg-white rounded-2xl shadow-xl p-4 border border-dental-50 z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dental-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-dental-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dental-800">15+ Years</p>
                    <p className="text-[11px] text-dental-500 font-medium">Experience</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          custom={6}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-16 sm:mt-20"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-dental-100/40 rounded-2xl p-6 sm:p-8 shadow-sm border-l-4 border-l-dental-500">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto lg:mx-0">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-1.5">
                    <div className="w-9 h-9 rounded-xl bg-dental-50 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-dental-500" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-dental-800 tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-dental-500 font-medium pl-0 lg:pl-12">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
