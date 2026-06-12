'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bug,
  Palette,
  AlignLeft,
  CircleDot,
  Droplets,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TreatmentCase {
  id: string
  title: string
  condition: string
  treatment: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  beforeDescription: string
  afterDescription: string
  severity: 'Mild' | 'Moderate' | 'Severe'
  improvement: number // percentage 0-100
}

const treatmentCases: TreatmentCase[] = [
  {
    id: 'cavities',
    title: 'Dental Cavities & Decay',
    condition: 'Cavities',
    treatment: 'Restorative Fillings',
    category: 'Restorative',
    icon: Bug,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    beforeDescription: 'Visible tooth decay with dark cavities and damaged enamel on molars requiring immediate restorative treatment.',
    afterDescription: 'Cavities fully treated with composite fillings, enamel restored to natural healthy appearance with no visible damage.',
    severity: 'Moderate',
    improvement: 90,
  },
  {
    id: 'discoloration',
    title: 'Teeth Discoloration',
    condition: 'Severe Staining',
    treatment: 'Professional Whitening',
    category: 'Cosmetic',
    icon: Palette,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    beforeDescription: 'Heavy yellow and brown staining from coffee, tea, and nicotine causing significant discoloration and self-consciousness.',
    afterDescription: 'Professional whitening treatment restored teeth to a bright, natural white appearance — up to 8 shades lighter.',
    severity: 'Moderate',
    improvement: 95,
  },
  {
    id: 'misalignment',
    title: 'Teeth Misalignment',
    condition: 'Malocclusion',
    treatment: 'Orthodontic Braces',
    category: 'Orthodontics',
    icon: AlignLeft,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    beforeDescription: 'Overcrowded and crooked teeth with overlapping front teeth causing bite misalignment and difficulty cleaning.',
    afterDescription: 'After orthodontic treatment, teeth are perfectly aligned with uniform spacing, correct bite, and a confident smile.',
    severity: 'Severe',
    improvement: 98,
  },
  {
    id: 'missing',
    title: 'Missing Tooth',
    condition: 'Tooth Loss',
    treatment: 'Dental Implant',
    category: 'Restorative',
    icon: CircleDot,
    iconColor: 'text-dental-500',
    iconBg: 'bg-dental-50',
    beforeDescription: 'Visible gap from missing tooth causing adjacent teeth to shift, affecting smile and chewing function.',
    afterDescription: 'Dental implant placed seamlessly, restoring complete smile with a natural-looking prosthetic tooth that functions perfectly.',
    severity: 'Severe',
    improvement: 97,
  },
  {
    id: 'gum-disease',
    title: 'Gum Disease',
    condition: 'Gingivitis',
    treatment: 'Periodontal Therapy',
    category: 'Periodontal',
    icon: Droplets,
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-50',
    beforeDescription: 'Red, inflamed, and swollen gums with visible signs of gingivitis, bleeding during brushing, and receding gumline.',
    afterDescription: 'Healthy pink gums restored after periodontal treatment — firm tissue with no inflammation or bleeding.',
    severity: 'Moderate',
    improvement: 88,
  },
  {
    id: 'chipped',
    title: 'Chipped Tooth',
    condition: 'Tooth Fracture',
    treatment: 'Dental Bonding',
    category: 'Cosmetic',
    icon: Zap,
    iconColor: 'text-sky-500',
    iconBg: 'bg-sky-50',
    beforeDescription: 'Chipped front tooth with visible fracture line and cracked enamel affecting smile aesthetics and confidence.',
    afterDescription: 'Tooth perfectly restored with dental bonding — smooth enamel with natural appearance, shape, and color seamlessly matched.',
    severity: 'Mild',
    improvement: 92,
  },
]

const categories = ['All', ...Array.from(new Set(treatmentCases.map((c) => c.category)))]

const severityColors: Record<string, { bg: string; text: string; dot: string }> = {
  Mild: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Moderate: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  Severe: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
}

/* Shimmer keyframes injected once via inline style */
const shimmerKeyframes = `
@keyframes shimmer-after {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes pulse-arrow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
}
@keyframes progress-fill {
  0% { width: 0%; }
}
`

export default function BeforeAfter() {
  const [activeCategory, setActiveCategory] = useState('All')
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const filteredCases =
    activeCategory === 'All'
      ? treatmentCases
      : treatmentCases.filter((c) => c.category === activeCategory)

  return (
    <section
      id="results"
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Inject shimmer keyframes */}
      <style>{shimmerKeyframes}</style>

      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dental-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/15 rounded-full blur-3xl" />
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
            Real Results
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900 tracking-tight">
            Treatment Transformations
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
          <p className="mt-6 text-lg text-dental-600/80 max-w-2xl mx-auto">
            Every case represents a real condition we treat and the successful
            outcome our patients experience. See the difference expert care makes.
          </p>
        </motion.div>

        {/* Category Tabs - Polished */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-dental-50/80 border border-dental-100 rounded-2xl backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-dental-600 text-white shadow-lg shadow-dental-600/25'
                    : 'text-dental-700 hover:text-dental-800 hover:bg-white/60'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-dental-600 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((c, i) => {
            const severity = severityColors[c.severity]
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="group overflow-hidden border-dental-100/60 bg-white hover:border-dental-200 hover:shadow-2xl hover:shadow-dental-100/30 transition-all duration-500 rounded-2xl h-full hover:-translate-y-1">
                  {/* Full-width gradient header */}
                  <div className="relative px-6 pt-6 pb-4">
                    {/* Gradient background for card top */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dental-50/60 via-white to-white rounded-t-2xl" />

                    <div className="relative flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center shadow-sm`}>
                        <c.icon className={`w-6 h-6 ${c.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] font-semibold border-0 ${severity.bg} ${severity.text} px-2 py-0.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${severity.dot} mr-1 inline-block`} />
                          {c.severity}
                        </Badge>
                        <Badge className="bg-dental-50 text-dental-700 border-dental-200 hover:bg-dental-100 text-[10px] font-medium px-2 py-0.5">
                          {c.category}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="relative text-lg font-bold text-dental-900 mb-1">
                      {c.title}
                    </h3>
                  </div>

                  {/* Before/After transformation */}
                  <div className="px-6 pb-6 space-y-3">
                    {/* BEFORE */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-red-50/90 via-orange-50/60 to-red-50/30 border border-red-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100/80 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-[11px] font-bold text-red-900/80 uppercase tracking-widest">Before</span>
                        <span className="text-[11px] font-medium text-red-700/60">— {c.condition}</span>
                      </div>
                      <p className="text-sm text-red-800/70 leading-relaxed pl-9">
                        {c.beforeDescription}
                      </p>
                    </div>

                    {/* Animated Transformation Arrow */}
                    <div className="flex items-center justify-center py-1">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-red-200/60 via-dental-300/40 to-dental-300/60 min-w-[40px]" />
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-dental-100 to-dental-200 border border-dental-200/60 flex items-center justify-center shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 text-dental-600" />
                        </motion.div>
                        <div className="h-px flex-1 bg-gradient-to-r from-dental-300/60 via-dental-300/40 to-emerald-200/60 min-w-[40px]" />
                      </div>
                    </div>

                    {/* AFTER with shimmer */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-emerald-50/30 via-teal-50/60 to-emerald-50/90 border border-emerald-200/50 overflow-hidden">
                      {/* Shimmer overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.07] pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer-after 3s ease-in-out infinite',
                        }}
                      />
                      <div className="relative flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-900/80 uppercase tracking-widest">After</span>
                        <span className="text-[11px] font-medium text-emerald-700/60">— {c.treatment}</span>
                      </div>
                      <p className="relative text-sm text-emerald-800/70 leading-relaxed pl-9">
                        {c.afterDescription}
                      </p>
                    </div>

                    {/* Transformation Meter */}
                    <div className="mt-4 px-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-dental-500" />
                          <span className="text-[11px] font-semibold text-dental-700 uppercase tracking-wider">Improvement</span>
                        </div>
                        <span className="text-[13px] font-bold text-dental-600">{c.improvement}%</span>
                      </div>
                      <div className="relative h-2 rounded-full bg-dental-100/80 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${c.improvement}%` } : {}}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-dental-400 via-dental-500 to-emerald-400"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${c.improvement}%` } : {}}
                          transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-dental-400 via-dental-500 to-emerald-400 opacity-30 blur-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA - More prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dental-600 via-dental-600 to-dental-700 p-8 sm:p-10 text-center shadow-2xl shadow-dental-600/20">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            </div>

            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Ready to Start Your Transformation?
              </h3>
              <p className="text-dental-100/90 text-sm sm:text-base max-w-lg mx-auto mb-6">
                Our expert team is here to guide you through every step of your dental journey. Book a consultation today.
              </p>
              <button
                onClick={() => {
                  const el = document.querySelector('#appointment')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-dental-700 text-sm font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:bg-dental-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Your Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-dental-400 mt-4 text-center">
            * Results may vary. Consult our dentists for a personalized treatment plan.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
