'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Navigation,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { CLINIC_ADDRESS, WORKING_HOURS as workingHours } from '@/lib/clinicInfo'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { toast } = useToast()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!subject.trim()) newErrors.subject = 'Subject is required'
    if (!message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        toast({
          title: 'Message Sent!',
          description: 'We will get back to you shortly.',
        })
        setName('')
        setEmail('')
        setPhone('')
        setSubject('')
        setMessage('')
        setErrors({})
      } else {
        const data = await res.json()
        toast({
          title: 'Error',
          description: data.error || 'Failed to send message.',
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

  const openGoogleMaps = () => {
    window.open(CLINIC_ADDRESS.googleMapsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="contact"
      className="py-20 sm:py-28 dental-gradient-light"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-dental-500 tracking-wide uppercase">
            Reach Out
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-dental-900">
            Get in Touch
          </h2>
          <div className="mt-4 w-20 h-1 dental-gradient rounded-full mx-auto" />
          <p className="mt-6 text-lg text-dental-700/70 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="border-dental-100 shadow-xl shadow-dental-100/30 rounded-2xl">
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
                      Message Sent!
                    </h3>
                    <p className="text-dental-600/70 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you soon.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-dental-300 text-dental-700 hover:bg-dental-50"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name" className="text-dental-700 font-medium">
                          Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value)
                            if (errors.name)
                              setErrors((prev) => ({ ...prev, name: '' }))
                          }}
                          className={`border-dental-200 focus:border-dental-500 ${
                            errors.name ? 'border-red-400' : ''
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email" className="text-dental-700 font-medium">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (errors.email)
                              setErrors((prev) => ({ ...prev, email: '' }))
                          }}
                          className={`border-dental-200 focus:border-dental-500 ${
                            errors.email ? 'border-red-400' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone" className="text-dental-700 font-medium">
                          Phone
                        </Label>
                        <Input
                          id="contact-phone"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-dental-200 focus:border-dental-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-subject" className="text-dental-700 font-medium">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contact-subject"
                          placeholder="How can we help?"
                          value={subject}
                          onChange={(e) => {
                            setSubject(e.target.value)
                            if (errors.subject)
                              setErrors((prev) => ({ ...prev, subject: '' }))
                          }}
                          className={`border-dental-200 focus:border-dental-500 ${
                            errors.subject ? 'border-red-400' : ''
                          }`}
                        />
                        {errors.subject && (
                          <p className="text-xs text-red-500">{errors.subject}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-dental-700 font-medium">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="contact-message"
                        placeholder="Write your message here..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          if (errors.message)
                            setErrors((prev) => ({ ...prev, message: '' }))
                        }}
                        rows={5}
                        className={`border-dental-200 focus:border-dental-500 resize-none ${
                          errors.message ? 'border-red-400' : ''
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-dental-600 hover:bg-dental-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-dental-600/25 hover:shadow-dental-700/30 transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Clinic Location - Prominent Card */}
            <Card className="border-dental-100 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Map Preview */}
                <div className="relative h-48 bg-dental-100 overflow-hidden">
                  <iframe
                    src={CLINIC_ADDRESS.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="BrightSmile Dental Clinic Location"
                    className="w-full h-full"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-dental-600" />
                    <h3 className="text-lg font-bold text-dental-800">
                      Our Location
                    </h3>
                  </div>
                  <div className="space-y-2 mb-5">
                    <p className="text-sm font-medium text-dental-800">
                      {CLINIC_ADDRESS.street}
                    </p>
                    <p className="text-sm text-dental-600/70">
                      {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.country}
                    </p>
                  </div>

                  {/* Open in Google Maps Button */}
                  <Button
                    onClick={openGoogleMaps}
                    className="w-full bg-gradient-to-r from-dental-500 to-dental-600 hover:from-dental-600 hover:to-dental-700 text-white rounded-xl h-11 shadow-lg shadow-dental-600/25 hover:shadow-dental-700/30 transition-all duration-200 font-medium"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open in Google Maps
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card className="border-dental-100 bg-white rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-dental-800 mb-5">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${CLINIC_ADDRESS.phone.replace(/[^+\d]/g, '')}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-dental-100 text-dental-600 flex items-center justify-center shrink-0 group-hover:bg-dental-600 group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-dental-500 font-medium">Phone</p>
                      <p className="text-sm font-medium text-dental-800 group-hover:text-dental-700 transition-colors">
                        {CLINIC_ADDRESS.phone}
                      </p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${CLINIC_ADDRESS.email}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-dental-100 text-dental-600 flex items-center justify-center shrink-0 group-hover:bg-dental-600 group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-dental-500 font-medium">Email</p>
                      <p className="text-sm font-medium text-dental-800 group-hover:text-dental-700 transition-colors">
                        {CLINIC_ADDRESS.email}
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-dental-100 bg-white rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-dental-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-dental-500" />
                  Working Hours
                </h3>
                <div className="space-y-3">
                  {workingHours.map((wh) => {
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
                    const isToday = wh.days.includes(today)
                    return (
                      <div
                        key={wh.day}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 -mx-3 transition-colors duration-200 ${
                          isToday ? 'bg-dental-50 border border-dental-200/50' : ''
                        }`}
                      >
                        <span className={`text-sm ${isToday ? 'text-dental-800 font-semibold' : 'text-dental-700'}`}>
                          {wh.day}
                          {isToday && <span className="ml-1.5 text-[10px] font-bold text-dental-500 uppercase tracking-wider">Today</span>}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            wh.time === 'Closed'
                              ? 'text-red-500'
                              : isToday ? 'text-dental-700 font-semibold' : 'text-dental-600'
                          }`}
                        >
                          {wh.time}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
