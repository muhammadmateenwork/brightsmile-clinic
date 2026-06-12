'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  RefreshCw,
  UserCheck,
  Phone,
  Mail,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'

interface PatientManagementProps {
  token: string
}

interface Patient {
  id: string
  fullName: string
  phone: string
  email: string
  createdAt: string
  _count: { appointments: number }
  appointments: Array<{
    id: string
    date: string
    time: string
    status: string
    dentistId: string
  }>
}

const statusBadgeVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'N/A'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatTime(time: string) {
  if (!time) return 'N/A'
  try {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${m} ${ampm}`
  } catch {
    return time
  }
}

function getInitials(name: string) {
  if (!name) return 'UN' // Fallback for undefined names
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const avatarColors = [
  'bg-dental-100 text-dental-600',
  'bg-emerald-100 text-emerald-600',
  'bg-violet-100 text-violet-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
  'bg-cyan-100 text-cyan-600',
]

export default function PatientManagement({ token }: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      // Safely ensure data is an array
      setPatients(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load patients', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Safely filter to prevent crashes from undefined properties
  const filteredPatients = patients.filter((p) => {
    const nameMatch = (p.fullName || '').toLowerCase().includes(search.toLowerCase())
    const phoneMatch = (p.phone || '').includes(search)
    return nameMatch || phoneMatch
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dental-800">Patient Management</h2>
          <p className="text-muted-foreground text-sm mt-1">{patients.length} patients registered</p>
        </div>
        <Button variant="outline" onClick={fetchPatients} size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient Cards */}
      {filteredPatients.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredPatients.map((patient, index) => {
              const isExpanded = expandedId === patient.id
              const lastAppointment = patient.appointments?.[0]

              return (
                <motion.div
                  key={patient.id || `fallback-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow border-dental-100/60">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 border-2 border-dental-100 flex-shrink-0">
                          <AvatarFallback className={avatarColors[index % avatarColors.length]}>
                            {getInitials(patient.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {patient.fullName || 'Unknown Patient'}
                          </h3>
                          <div className="space-y-1 mt-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{patient.phone || 'No phone'}</span>
                            </div>
                            {patient.email && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-dental-50">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {patient._count?.appointments || 0} appointments
                          </Badge>
                          {lastAppointment && (
                            <span className="text-xs text-muted-foreground">
                              Last: {formatDate(lastAppointment.date)}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(patient.id)}
                          className="h-7 px-2 text-xs text-dental-600 hover:text-dental-800 hover:bg-dental-50"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5 mr-1" />
                              Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5 mr-1" />
                              History
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Expanded Appointment History */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-3" />
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              <p className="text-xs font-medium text-dental-700 mb-2">
                                Appointment History
                              </p>
                              {patient.appointments && patient.appointments.length > 0 ? (
                                patient.appointments.map((apt, idx) => (
                                  <div
                                    key={apt.id || `apt-${idx}`}
                                    className="flex items-center justify-between p-2 rounded-lg bg-dental-50/50 text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <CalendarDays className="w-3 h-3 text-dental-500" />
                                      <span>{formatDate(apt.date)}</span>
                                      <span className="text-muted-foreground">
                                        {formatTime(apt.time)}
                                      </span>
                                    </div>
                                    <Badge
                                      variant={statusBadgeVariant[apt.status] || 'secondary'}
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Unknown'}
                                    </Badge>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-muted-foreground">No appointments</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <UserCheck className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No Patients Found</h3>
          <p className="text-muted-foreground text-sm">
            {search ? 'Try adjusting your search criteria' : 'No patients registered yet'}
          </p>
        </Card>
      )}
    </div>
  )
}