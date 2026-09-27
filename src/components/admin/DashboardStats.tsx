'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  CalendarDays,
  UserCheck,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DashboardStatsProps {
  token: string
}

interface StatsData {
  totalDentists: number
  totalAppointments: number
  totalPatients: number
  pendingAppointments: number
  approvedAppointments: number
  rejectedAppointments: number
  recentAppointments: Array<{
    id: string
    patientName: string
    patientPhone: string
    date: string
    time: string
    message: string
    status: string
    createdAt: string
    dentist: { name: string; specialty: string }
  }>
  appointmentsByDentist: Array<{
    name: string
    _count: { appointments: number }
  }>
}

const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444']

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardStats({ token }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch {
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchStats} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Card>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      label: 'Total Dentists',
      value: stats.totalDentists || 0,
      icon: Users,
      color: 'bg-dental-100 text-dental-600',
      trend: '+2',
      trendUp: true,
    },
    {
      label: 'Total Appointments',
      value: stats.totalAppointments || 0,
      icon: CalendarDays,
      color: 'bg-emerald-100 text-emerald-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients || 0,
      icon: UserCheck,
      color: 'bg-violet-100 text-violet-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingAppointments || 0,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
      trend: (stats.pendingAppointments || 0) > 3 ? 'Needs attention' : 'On track',
      trendUp: (stats.pendingAppointments || 0) <= 3,
    },
  ]

  // Safe mapping for charts
  const barChartData = (stats.appointmentsByDentist || []).map((d) => ({
    name: (d.name || 'Unknown').replace('Dr. ', '').split(' ')[0],
    appointments: d._count?.appointments || 0,
  }))

  const pieChartData = [
    { name: 'Pending', value: stats.pendingAppointments || 0 },
    { name: 'Approved', value: stats.approvedAppointments || 0 },
    { name: 'Rejected', value: stats.rejectedAppointments || 0 },
  ]

  const recentList = stats.recentAppointments || []

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="p-6 hover:shadow-md transition-shadow border-dental-100/60">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trendUp ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-amber-500" />
                    )}
                    <span className={stat.trendUp ? 'text-emerald-600' : 'text-amber-600'}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-dental-100/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-dental-800">
                Appointments by Dentist
              </CardTitle>
            </CardHeader>
            <CardContent>
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar
                      dataKey="appointments"
                      fill="#0284c7"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-dental-100/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-dental-800">
                Appointment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value: string) => (
                        <span className="text-sm text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div variants={itemVariants}>
        <Card className="border-dental-100/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-dental-800">
                Recent Appointments
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Last 10
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {recentList.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Dentist</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentList.map((apt, index) => (
                      <TableRow key={apt.id || `fallback-apt-${index}`}>
                        <TableCell className="font-medium">{apt.patientName || 'Unknown'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {apt.dentist?.name || 'N/A'}
                        </TableCell>
                        <TableCell>{formatDate(apt.date)}</TableCell>
                        <TableCell>{formatTime(apt.time)}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {apt.message || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant[apt.status] || 'secondary'}>
                            {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Unknown'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No appointments yet
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}