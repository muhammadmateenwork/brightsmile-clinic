'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/dental/Navbar'
import Hero from '@/components/dental/Hero'
import About from '@/components/dental/About'
import Services from '@/components/dental/Services'
import Dentists from '@/components/dental/Dentists'
import Testimonials from '@/components/dental/Testimonials'
import BeforeAfter from '@/components/dental/BeforeAfter'
import AppointmentForm from '@/components/dental/AppointmentForm'
import Contact from '@/components/dental/Contact'
import Footer from '@/components/dental/Footer'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DashboardStats from '@/components/admin/DashboardStats'
import DentistManagement from '@/components/admin/DentistManagement'
import AppointmentManagement from '@/components/admin/AppointmentManagement'
import PatientManagement from '@/components/admin/PatientManagement'
import { Menu, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'

type View = 'public' | 'admin'
type AdminTab = 'dashboard' | 'dentists' | 'appointments' | 'patients'

export default function Home() {
  const [view, setView] = useState<View>('public')
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard')
  const [token, setToken] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    let cancelled = false
    const savedToken = localStorage.getItem('dental_admin_token')
    if (savedToken) {
      // Verify token
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (!cancelled) {
            if (data.valid) {
              setToken(savedToken)
            } else {
              localStorage.removeItem('dental_admin_token')
            }
            setIsAuthLoading(false)
          }
        })
        .catch(() => {
          if (!cancelled) {
            localStorage.removeItem('dental_admin_token')
            setIsAuthLoading(false)
          }
        })
    } else {
      // Use microtask to avoid synchronous setState in effect
      queueMicrotask(() => {
        if (!cancelled) setIsAuthLoading(false)
      })
    }
    return () => { cancelled = true }
  }, [])

  const handleAdminClick = useCallback(() => {
    setView('admin')
  }, [])

  const handleLogin = useCallback((newToken: string) => {
    setToken(newToken)
    localStorage.setItem('dental_admin_token', newToken)
  }, [])

  const handleLogout = useCallback(() => {
    setToken(null)
    localStorage.removeItem('dental_admin_token')
    setView('public')
    setAdminTab('dashboard')
  }, [])

  const handleBackToSite = useCallback(() => {
    setView('public')
    setMobileMenuOpen(false)
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    setAdminTab(tab as AdminTab)
    setMobileMenuOpen(false)
  }, [])

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dental-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-dental-200 border-t-dental-600 rounded-full animate-spin" />
          <p className="text-dental-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {view === 'public' ? (
          <motion.div
            key="public"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <Navbar />
            <main className="flex-1">
              <Hero />
              <About />
              <Services />
              <Dentists />
              <Testimonials />
              <BeforeAfter />
              <AppointmentForm />
              <Contact />
            </main>
            <Footer onAdminClick={handleAdminClick} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            {!token ? (
              <AdminLogin onLogin={handleLogin} onBackToSite={handleBackToSite} />
            ) : (
              <div className="flex min-h-screen">
                <AdminSidebar
                  activeTab={adminTab}
                  onTabChange={handleTabChange}
                  onLogout={handleLogout}
                  onBackToSite={handleBackToSite}
                  mobileOpen={mobileMenuOpen}
                  onMobileClose={() => setMobileMenuOpen(false)}
                />
                <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
                  {/* Mobile Header - only visible on small screens */}
                  <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-dental-100 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        className="h-9 w-9 text-dental-700 hover:bg-dental-50"
                      >
                        <Menu className="w-5 h-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 dental-gradient rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-dental-800 text-sm">BrightSmile</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium capitalize">
                      {adminTab === 'dashboard' ? 'Dashboard' : adminTab}
                    </span>
                  </header>

                  {/* Main content */}
                  <main className="flex-1 p-4 md:p-8 bg-gray-50/50 overflow-auto">
                    <AnimatePresence mode="wait">
                      {adminTab === 'dashboard' && (
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DashboardStats token={token} />
                        </motion.div>
                      )}
                      {adminTab === 'dentists' && (
                        <motion.div
                          key="dentists"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DentistManagement token={token} />
                        </motion.div>
                      )}
                      {adminTab === 'appointments' && (
                        <motion.div
                          key="appointments"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AppointmentManagement token={token} />
                        </motion.div>
                      )}
                      {adminTab === 'patients' && (
                        <motion.div
                          key="patients"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <PatientManagement token={token} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </main>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
