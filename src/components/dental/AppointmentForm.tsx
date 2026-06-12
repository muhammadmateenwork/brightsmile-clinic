'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarIcon, Clock, Loader2, CheckCircle2, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface Dentist {
  id: string
  name: string
  specialty: string
}

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export default function AppointmentForm() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingDentists, setFetchingDentists] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [selectedDentist, setSelectedDentist] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState('')
  const [message, setMessage] = useState('')

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDentists() {
      try {
        const res = await fetch('/api/dentists')
        if (res.ok) {
          const data = await res.json()
          setDentists(data)
        }
      } catch {
        // Silently handle
      } finally {
        setFetchingDentists(false)
      }
    }
    fetchDentists()
  }, [])

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!patientName.trim()) newErrors.patientName = 'Full name is required'
    if (!patientPhone.trim()) newErrors.patientPhone = 'Phone number is required'
    if (!selectedDentist) newErrors.selectedDentist = 'Please select a dentist'
    if (!selectedDate) newErrors.selectedDate = 'Please select a date'
    if (!selectedTime) newErrors.selectedTime = 'Please select a time slot'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [patientName, patientPhone, selectedDentist, selectedDate, selectedTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const dateStr = format(selectedDate!, 'yyyy-MM-dd')
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientEmail: patientEmail.trim(),
          dentistId: selectedDentist,
          date: dateStr,
          time: selectedTime,
          message: message.trim(),
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast({
          title: 'Appointment Booked!',
          description: 'We will confirm your appointment shortly.',
        })
        // Reset form
        setPatientName('')
        setPatientPhone('')
        setPatientEmail('')
        setSelectedDentist('')
        setSelectedDate(undefined)
        setSelectedTime('')
        setMessage('')
        setErrors({})
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to book appointment. Please try again.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="appointment" className="py-20 sm:py-28 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-dental-500 tracking-wide uppercase">
            Schedule a Visit
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900 tracking-tight">
            Book Your Appointment
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
          <p className="mt-6 text-lg text-dental-600/80 max-w-2xl mx-auto">
            Fill out the form below and our team will confirm your appointment
            within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left side - Trust indicators */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:flex flex-col justify-center space-y-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dental-800 text-sm">100% Safe</h4>
                  <p className="text-xs text-dental-500 mt-0.5 leading-relaxed">Sterilized equipment and infection control protocols</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-dental-50 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-dental-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dental-800 text-sm">Quick Response</h4>
                  <p className="text-xs text-dental-500 mt-0.5 leading-relaxed">We confirm appointments within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-dental-800 text-sm">Flexible Scheduling</h4>
                  <p className="text-xs text-dental-500 mt-0.5 leading-relaxed">Evening and weekend slots available</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <Card className="border-dental-100/60 shadow-xl shadow-dental-100/20 rounded-2xl">
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6 }}
                      >
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-dental-800 mb-2">
                        Appointment Booked!
                      </h3>
                      <p className="text-dental-600/70 mb-6">
                        We&apos;ll send you a confirmation shortly. Thank you for
                        choosing BrightSmile!
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="border-dental-300 text-dental-700 hover:bg-dental-50"
                      >
                        Book Another Appointment
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Row 1: Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-dental-700 font-medium text-sm">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={patientName}
                            onChange={(e) => {
                              setPatientName(e.target.value)
                              if (errors.patientName)
                                setErrors((prev) => ({ ...prev, patientName: '' }))
                            }}
                            className={`border-dental-200 focus:border-dental-500 focus:ring-dental-500/20 h-11 ${
                              errors.patientName ? 'border-red-400' : ''
                            }`}
                          />
                          {errors.patientName && (
                            <p className="text-xs text-red-500">{errors.patientName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-dental-700 font-medium text-sm">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 000-0000"
                            value={patientPhone}
                            onChange={(e) => {
                              setPatientPhone(e.target.value)
                              if (errors.patientPhone)
                                setErrors((prev) => ({ ...prev, patientPhone: '' }))
                            }}
                            className={`border-dental-200 focus:border-dental-500 focus:ring-dental-500/20 h-11 ${
                              errors.patientPhone ? 'border-red-400' : ''
                            }`}
                          />
                          {errors.patientPhone && (
                            <p className="text-xs text-red-500">{errors.patientPhone}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-dental-700 font-medium text-sm">
                          Email <span className="text-dental-400 text-xs font-normal">(optional)</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="border-dental-200 focus:border-dental-500 focus:ring-dental-500/20 h-11"
                        />
                      </div>

                      {/* Dentist Select */}
                      <div className="space-y-2">
                        <Label className="text-dental-700 font-medium text-sm">
                          Select Dentist <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={selectedDentist}
                          onValueChange={(val) => {
                            setSelectedDentist(val)
                            if (errors.selectedDentist)
                              setErrors((prev) => ({ ...prev, selectedDentist: '' }))
                          }}
                        >
                          <SelectTrigger
                            className={`w-full border-dental-200 focus:border-dental-500 h-11 ${
                              errors.selectedDentist ? 'border-red-400' : ''
                            }`}
                          >
                            <SelectValue
                              placeholder={
                                fetchingDentists
                                  ? 'Loading dentists...'
                                  : 'Choose a dentist'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {dentists.map((d) => (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name} — {d.specialty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.selectedDentist && (
                          <p className="text-xs text-red-500">{errors.selectedDentist}</p>
                        )}
                      </div>

                      {/* Date Picker & Time Slot */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date Picker */}
                        <div className="space-y-2">
                          <Label className="text-dental-700 font-medium text-sm">
                            Preferred Date <span className="text-red-500">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal border-dental-200 hover:bg-dental-50 hover:text-dental-700 h-11 ${
                                  !selectedDate && 'text-muted-foreground'
                                } ${errors.selectedDate ? 'border-red-400' : ''}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate
                                  ? format(selectedDate, 'PPP')
                                  : 'Pick a date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                  setSelectedDate(date)
                                  if (errors.selectedDate)
                                    setErrors((prev) => ({ ...prev, selectedDate: '' }))
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {errors.selectedDate && (
                            <p className="text-xs text-red-500">{errors.selectedDate}</p>
                          )}
                        </div>

                        {/* Time Slot */}
                        <div className="space-y-2">
                          <Label className="text-dental-700 font-medium text-sm">
                            Time Slot <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={selectedTime}
                            onValueChange={(val) => {
                              setSelectedTime(val)
                              if (errors.selectedTime)
                                setErrors((prev) => ({ ...prev, selectedTime: '' }))
                            }}
                          >
                            <SelectTrigger
                              className={`w-full border-dental-200 focus:border-dental-500 h-11 ${
                                errors.selectedTime ? 'border-red-400' : ''
                              }`}
                            >
                              <SelectValue placeholder="Select time">
                                {selectedTime && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {selectedTime}
                                  </span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.selectedTime && (
                            <p className="text-xs text-red-500">{errors.selectedTime}</p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-dental-700 font-medium text-sm">
                          Describe Your Problem
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your dental concern or what you need help with..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                          className="border-dental-200 focus:border-dental-500 focus:ring-dental-500/20 resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dental-600 hover:bg-dental-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-dental-600/20 hover:shadow-dental-700/25 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          'Book Appointment'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
