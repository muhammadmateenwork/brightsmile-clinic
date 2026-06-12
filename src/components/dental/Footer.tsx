'use client'

import { Smile, Phone, Mail, MapPin, Heart, Navigation } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Dentists', href: '#dentists' },
  { label: 'Book Appointment', href: '#appointment' },
  { label: 'Contact', href: '#contact' },
]

const serviceLinks = [
  { label: 'Teeth Cleaning', href: '#services' },
  { label: 'Dental Implants', href: '#services' },
  { label: 'Braces & Orthodontics', href: '#services' },
  { label: 'Teeth Whitening', href: '#services' },
  { label: 'Root Canal Treatment', href: '#services' },
]

interface FooterProps {
  onAdminClick?: () => void
}

export default function Footer({ onAdminClick }: FooterProps) {
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-dental-900 text-white mt-auto">
      {/* Top gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-dental-400 via-dental-500 to-dental-400" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dental-500 to-dental-600 flex items-center justify-center shadow-lg shadow-dental-600/30">
                <Smile className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Bright<span className="text-dental-300">Smile</span>
              </span>
            </div>
            <p className="text-dental-200/50 text-sm leading-relaxed max-w-xs mb-5">
              Transforming smiles with compassion and excellence. Your trusted
              partner for premium dental care since 2009.
            </p>
            {/* Google Maps button */}
            <Button
              onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=123+Dental+Avenue+New+York+NY+10001', '_blank', 'noopener,noreferrer')}
              variant="outline"
              size="sm"
              className="border-dental-700/50 text-dental-300/70 hover:bg-dental-800 hover:text-white hover:border-dental-600 rounded-lg text-xs font-medium transition-all duration-200"
            >
              <Navigation className="w-3.5 h-3.5 mr-1.5" />
              Get Directions
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-dental-200/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-dental-200/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Info</h4>
            <div className="space-y-4">
              <a
                href="tel:+15551234567"
                className="flex items-center gap-3 text-sm text-dental-200/50 hover:text-white transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-dental-800/60 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-dental-400/70" />
                </div>
                +1 (555) 123-4567
              </a>
              <a
                href="mailto:hello@brightsmile.com"
                className="flex items-center gap-3 text-sm text-dental-200/50 hover:text-white transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-dental-800/60 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-dental-400/70" />
                </div>
                hello@brightsmile.com
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=123+Dental+Avenue+New+York+NY+10001"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-dental-200/50 hover:text-white transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-dental-800/60 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-dental-400/70" />
                </div>
                123 Dental Avenue, Suite 200, New York, NY 10001
              </a>
            </div>
          </div>
        </div>

        <Separator className="mb-6 bg-dental-800/60" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-dental-200/30">
          <p>
            &copy; {new Date().getFullYear()} BrightSmile Dental Clinic. All
            rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-400/70 fill-red-400/70" /> for healthy smiles
            </p>
            {onAdminClick && (
              <>
                <span className="text-dental-700/50">|</span>
                <button
                  onClick={onAdminClick}
                  className="text-xs text-dental-200/20 hover:text-dental-200/50 transition-colors duration-200"
                >
                  Clinic Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
