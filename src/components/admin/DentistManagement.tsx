'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Stethoscope,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

interface DentistManagementProps {
  token: string
}

interface Dentist {
  id: string
  name: string
  specialty: string
  experience: number
  image: string
  description: string
  qualifications: string
  available: boolean
  createdAt: string
  _count?: { appointments: number }
}

const SPECIALTIES = [
  'Orthodontics',
  'Dental Implants',
  'Cosmetic Dentistry',
  'Endodontics',
  'Periodontics',
  'Prosthodontics',
  'Pediatric Dentistry',
  'Oral Surgery',
  'General Dentistry',
]

const emptyForm = {
  name: '',
  specialty: '',
  experience: '',
  image: '',
  description: '',
  qualifications: '',
  available: true,
}

export default function DentistManagement({ token }: DentistManagementProps) {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingDentist, setEditingDentist] = useState<Dentist | null>(null)
  const [deletingDentist, setDeletingDentist] = useState<Dentist | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const fetchDentists = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/dentists')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      // Guarantee array
      setDentists(Array.isArray(data) ? data : [])
    } catch {
      toast({ title: 'Error', description: 'Failed to load dentists', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDentists()
  }, [fetchDentists])

  const openAddDialog = () => {
    setEditingDentist(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEditDialog = (dentist: Dentist) => {
    setEditingDentist(dentist)
    setForm({
      name: dentist.name || '',
      specialty: dentist.specialty || '',
      experience: String(dentist.experience || 0),
      image: dentist.image || '',
      description: dentist.description || '',
      qualifications: dentist.qualifications || '',
      available: dentist.available ?? true,
    })
    setFormOpen(true)
  }

  const openDeleteDialog = (dentist: Dentist) => {
    setDeletingDentist(dentist)
    setDeleteOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.specialty || !form.experience || !form.image) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields', variant: 'destructive' })
      return
    }

    setSubmitting(true)
    try {
      const url = editingDentist ? `/api/dentists/${editingDentist.id}` : '/api/dentists'
      const method = editingDentist ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      toast({
        title: editingDentist ? 'Dentist Updated' : 'Dentist Added',
        description: `${form.name} has been ${editingDentist ? 'updated' : 'added'} successfully`,
      })

      setFormOpen(false)
      fetchDentists()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save dentist',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingDentist) return

    try {
      const res = await fetch(`/api/dentists/${deletingDentist.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast({
        title: 'Dentist Deleted',
        description: `${deletingDentist.name} has been removed`,
      })

      setDeleteOpen(false)
      setDeletingDentist(null)
      fetchDentists()
    } catch {
      toast({ title: 'Error', description: 'Failed to delete dentist', variant: 'destructive' })
    }
  }

  // Safe filtering
  const filteredDentists = dentists.filter((d) => {
    const matchesSearch =
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.specialty || '').toLowerCase().includes(search.toLowerCase())
    const matchesSpecialty = specialtyFilter === 'all' || d.specialty === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  // Safely extract unique specialties (ignore undefined)
  const uniqueSpecialties = [...new Set(dentists.map((d) => d.specialty).filter(Boolean))]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
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
          <h2 className="text-2xl font-bold text-dental-800">Dentist Management</h2>
          <p className="text-muted-foreground text-sm mt-1">{dentists.length} dentists registered</p>
        </div>
        <Button onClick={openAddDialog} className="dental-gradient text-white hover:opacity-90 shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Add Dentist
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {uniqueSpecialties.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={fetchDentists} className="flex-shrink-0">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Dentist Grid */}
      {filteredDentists.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredDentists.map((dentist, i) => (
              <motion.div
                key={dentist.id || `dentist-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow border-dental-100/60 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-dental-100 flex-shrink-0">
                        <AvatarImage src={dentist.image} alt={dentist.name || 'Dentist'} />
                        <AvatarFallback className="bg-dental-100 text-dental-600">
                          <Stethoscope className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate">{dentist.name || 'Unknown'}</h3>
                            <p className="text-sm text-dental-600">{dentist.specialty || 'General'}</p>
                          </div>
                          <Badge variant={dentist.available ? 'default' : 'secondary'} className="flex-shrink-0 text-xs">
                            {dentist.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{dentist.experience || 0} yrs exp.</span>
                          {dentist._count && (
                            <span>{dentist._count.appointments} appointments</span>
                          )}
                        </div>
                        {dentist.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {dentist.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-dental-50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(dentist)}
                        className="text-dental-600 hover:text-dental-800 hover:bg-dental-50"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(dentist)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="p-12 text-center">
          <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No Dentists Found</h3>
          <p className="text-muted-foreground text-sm">
            {search || specialtyFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first dentist to get started'}
          </p>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dental-800">
              {editingDentist ? 'Edit Dentist' : 'Add New Dentist'}
            </DialogTitle>
            <DialogDescription>
              {editingDentist
                ? 'Update the dentist information below'
                : 'Fill in the details to add a new dentist'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dentist-name">Name *</Label>
                <Input
                  id="dentist-name"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dentist-specialty">Specialty *</Label>
                <Select
                  value={form.specialty}
                  onValueChange={(value) => setForm({ ...form, specialty: value })}
                >
                  <SelectTrigger id="dentist-specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dentist-experience">Experience (years) *</Label>
                <Input
                  id="dentist-experience"
                  type="number"
                  min="0"
                  placeholder="10"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dentist-image">Image URL *</Label>
                <Input
                  id="dentist-image"
                  placeholder="https://example.com/photo.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentist-qualifications">Qualifications</Label>
              <Input
                id="dentist-qualifications"
                placeholder="DDS, MS Orthodontics - Harvard"
                value={form.qualifications}
                onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentist-description">Description</Label>
              <Textarea
                id="dentist-description"
                placeholder="Brief description about the dentist..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="dentist-available" className="font-medium">Available</Label>
                <p className="text-xs text-muted-foreground">Make this dentist visible for bookings</p>
              </div>
              <Switch
                id="dentist-available"
                checked={form.available}
                onCheckedChange={(checked) => setForm({ ...form, available: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="dental-gradient text-white hover:opacity-90"
            >
              {submitting ? 'Saving...' : editingDentist ? 'Update Dentist' : 'Add Dentist'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dentist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingDentist?.name}</strong>? This action
              cannot be undone and will remove all associated appointment data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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