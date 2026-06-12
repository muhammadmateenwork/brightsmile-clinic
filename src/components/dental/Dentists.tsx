'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Clock, Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'

interface Dentist {
  _id?: string
  id?: string
  name: string
  specialty: string
  experience: number
  image?: string
  description: string
  qualifications?: string
  available: boolean
  _count?: { appointments?: number }
}

export default function Dentists() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null)

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const res = await fetch('/api/dentists')
        if (!res.ok) throw new Error('Failed to fetch dentists')

        const data = await res.json()
        setDentists(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching dentists:', err)
        setDentists([])
      } finally {
        setLoading(false)
      }
    }

    fetchDentists()
  }, [])

  const handleBookAppointment = () => {
    setSelectedDentist(null)

    setTimeout(() => {
      document.querySelector('#appointment')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 300)
  }

  return (
    <section id="dentists" className="py-20 sm:py-28 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-dental-500 uppercase">
            Our Team
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900">
            Meet Our Dentists
          </h2>
        </motion.div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="overflow-hidden rounded-2xl">
                <Skeleton className="w-full h-56" />
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {dentists.map((dentist, i) => {
              const key =
                dentist._id ||
                dentist.id ||
                `${dentist.name?.replace(/\s/g, '-')}-${i}`

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="group overflow-hidden rounded-2xl hover:shadow-lg transition">

                    {/* IMAGE */}
                    <div className="relative h-56 overflow-hidden bg-dental-100 flex items-center justify-center">
                      <img
                        src={dentist.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name || 'D')}&background=e0f2fe&color=0284c7&size=400`}
                        alt={dentist.name || 'Dentist'}
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Instantly swap broken images for a professional generated avatar
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.name || 'D')}&background=e0f2fe&color=0284c7&size=400`;
                        }}
                      />

                      {/* OVERLAY */}
                      <div
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                        onClick={() => setSelectedDentist(dentist)}
                      >
                        <button className="bg-white px-4 py-2 rounded-lg text-sm font-medium">
                          View Profile
                        </button>
                      </div>

                      <Badge className="absolute top-3 right-3">
                        {dentist.specialty}
                      </Badge>

                      {dentist.available && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-xs shadow-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Available
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        {dentist.experience || 0} yrs experience
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3">
                        {dentist.description || 'No description available'}
                      </p>
                    </CardContent>

                  </Card>
                </motion.div>
              )
            })}

          </div>
        )}
      </div>

      {/* DIALOG */}
      <Dialog
        open={!!selectedDentist}
        onOpenChange={(open) => {
          if (!open) setSelectedDentist(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          {selectedDentist && (
            <div className="p-6">
              
              {/* Accessibility Header */}
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedDentist.name}</DialogTitle>
                <DialogDescription>Profile details for {selectedDentist.name}</DialogDescription>
              </DialogHeader>

              <h2 className="text-2xl font-bold text-dental-900">
                {selectedDentist.name}
              </h2>

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {selectedDentist.description}
              </p>

              <Button onClick={handleBookAppointment} className="mt-5 w-full bg-dental-600 hover:bg-dental-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}