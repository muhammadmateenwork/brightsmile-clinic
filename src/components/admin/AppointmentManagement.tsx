'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  CalendarDays,
  Clock,
  Phone,
  MessageSquare,
  Search,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

interface AppointmentManagementProps {
  token: string
}

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  patientEmail: string
  dentistId: string
  date: string
  time: string
  message: string
  status: string
  createdAt: string
  dentist: { name: string; specialty: string }
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
  if (/am|pm/i.test(time)) return time
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

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; color: string }> = {
  pending: { label: 'Pending', variant: 'secondary', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  approved: { label: 'Approved', variant: 'default', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Rejected', variant: 'destructive', color: 'text-red-600 bg-red-50 border-red-200' },
}

export default function AppointmentManagement({ token }: AppointmentManagementProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/appointments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAppointments(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load appointments', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Failed to update')

      toast({
        title: `Appointment ${status}`,
        description: `The appointment has been ${status}`,
      })

      fetchAppointments()
    } catch {
      toast({ title: 'Error', description: 'Failed to update appointment', variant: 'destructive' })
    } finally {
      setActionLoading(null)
    }
  }

  const deleteAppointment = async () => {
    if (!deletingId) return

    try {
      const res = await fetch(`/api/appointments/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast({ title: 'Appointment Deleted', description: 'The appointment has been removed' })
      setDeleteOpen(false)
      setDeletingId(null)
      fetchAppointments()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete appointment', variant: 'destructive' })
    }
  }

  // Safe filtering logic
  const filteredAppointments = appointments.filter((apt) => {
    const pName = (apt.patientName || '').toLowerCase()
    const pPhone = (apt.patientPhone || '').toLowerCase()
    const dName = (apt.dentist?.name || '').toLowerCase()
    const term = search.toLowerCase()

    return pName.includes(term) || pPhone.includes(term) || dName.includes(term)
  })

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    approved: appointments.filter((a) => a.status === 'approved').length,
    rejected: appointments.filter((a) => a.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-96" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dental-800">Appointment Management</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {appointments.length} total appointments
          </p>
        </div>
        <Button variant="outline" onClick={fetchAppointments} size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient name, phone, or dentist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{counts.approved}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">{counts.rejected}</Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          {filteredAppointments.length > 0 ? (
            <Card className="border-dental-100/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Dentist</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredAppointments.map((apt, index) => {
                        const config = statusConfig[apt.status] || statusConfig.pending
                        const isLoading = actionLoading === apt.id

                        return (
                          <motion.tr
                            key={apt.id || `fallback-row-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-dental-50 hover:bg-dental-50/30 transition-colors"
                          >
                            <TableCell className="font-medium">{apt.patientName || 'Unknown'}</TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {apt.patientPhone || 'N/A'}
                                </div>
                                {apt.patientEmail && (
                                  <div className="text-xs text-muted-foreground">{apt.patientEmail}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{apt.dentist?.name || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 text-sm">
                                  <CalendarDays className="w-3.5 h-3.5 text-dental-500" />
                                  {formatDate(apt.date)}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(apt.time)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              {apt.message ? (
                                <div className="flex items-start gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-muted-foreground line-clamp-2">
                                    {apt.message}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={config.variant} className="text-xs">
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {apt.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      onClick={() => updateStatus(apt.id, 'approved')}
                                      disabled={!!actionLoading}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => updateStatus(apt.id, 'rejected')}
                                      disabled={!!actionLoading}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => {
                                    setDeletingId(apt.id)
                                    setDeleteOpen(true)
                                  }}
                                  disabled={!!actionLoading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                {isLoading && (
                                  <div className="w-4 h-4 border-2 border-dental-300 border-t-dental-600 rounded-full animate-spin" />
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No Appointments Found</h3>
              <p className="text-muted-foreground text-sm">
                {search
                  ? 'Try adjusting your search criteria'
                  : `No ${statusFilter === 'all' ? '' : statusFilter + ' '}appointments to display`}
              </p>
            </Card>
          )}
        </div>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAppointment}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}