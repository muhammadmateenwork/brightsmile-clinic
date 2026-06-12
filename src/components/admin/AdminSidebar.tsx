'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserCheck,
  LogOut,
  X,
  Menu,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  onBackToSite?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'dentists', label: 'Dentists', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'patients', label: 'Patients', icon: UserCheck },
]

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  onBackToSite,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    onMobileClose?.()
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 dental-gradient rounded-xl flex items-center justify-center shadow-md shadow-dental-300/30 flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-dental-800 text-lg leading-tight truncate">BrightSmile</h2>
            <p className="text-xs text-muted-foreground truncate">Admin Panel</p>
          </div>
        </div>
      </div>

      <Separator className="mx-4 w-auto" />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${
                  isActive
                    ? 'bg-dental-600 text-white shadow-md shadow-dental-400/30'
                    : 'text-muted-foreground hover:bg-dental-50 hover:text-dental-700'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-dental-600 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-dental-600'}`} />
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <Separator className="mx-4 w-auto" />

      {/* Logout */}
      <div className="p-3 space-y-1">
        {onBackToSite && (
          <Button
            variant="ghost"
            onClick={onBackToSite}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-dental-700 hover:bg-dental-50 transition-colors"
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Site</span>
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r border-dental-100 bg-white h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl lg:hidden"
            >
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onMobileClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="lg:hidden h-9 w-9"
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}
