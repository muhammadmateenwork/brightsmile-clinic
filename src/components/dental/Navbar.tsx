'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, Smile, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Dentists', href: '#dentists' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Results', href: '#results' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_60px_rgba(0,0,0,0.03)] border-b border-dental-100/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dental-600 flex items-center justify-center shadow-md shadow-dental-600/30 group-hover:shadow-lg group-hover:shadow-dental-600/40 group-hover:bg-dental-700 transition-all duration-300">
              <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-dental-800 tracking-tight">
              Bright<span className="text-dental-500">Smile</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="relative px-4 py-2 text-sm font-medium text-dental-700/80 hover:text-dental-800 rounded-lg transition-colors duration-200 hover:bg-dental-50/80"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => scrollToSection('#appointment')}
              className="bg-dental-600 hover:bg-dental-700 text-white rounded-xl px-6 h-10 font-semibold shadow-md shadow-dental-600/20 hover:shadow-lg hover:shadow-dental-600/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Book Appointment
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-dental-700 hover:bg-dental-50">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
                <SheetHeader className="p-6 pb-4 border-b border-dental-100">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-dental-600 flex items-center justify-center shadow-md shadow-dental-600/30">
                      <Smile className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-dental-800 tracking-tight">
                      Bright<span className="text-dental-500">Smile</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4 gap-1">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => scrollToSection(link.href)}
                      className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-dental-700 hover:text-dental-800 hover:bg-dental-50 rounded-xl transition-all"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-dental-300" />
                    </motion.button>
                  ))}
                </div>
                <div className="p-4 pt-0">
                  <SheetClose asChild>
                    <Button
                      onClick={() => scrollToSection('#appointment')}
                      className="w-full bg-dental-600 hover:bg-dental-700 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-dental-600/25"
                    >
                      Book Appointment
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
