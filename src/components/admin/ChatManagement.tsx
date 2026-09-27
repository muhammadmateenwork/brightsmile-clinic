'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  RefreshCw,
  Phone,
  UserRound,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'
import MessageContent, { stripMarkdown } from '@/components/chat/MessageContent'

interface ChatManagementProps {
  token: string
}

interface ConversationSummary {
  id: string
  sessionId: string
  patientName: string
  patientPhone: string
  status: 'active' | 'handoff' | 'booked' | 'resolved'
  handoffReason: string
  appointmentId: string | null
  messageCount: number
  lastMessage: { role: string; content: string } | null
  createdAt: string
  lastMessageAt: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  createdAt?: string
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
  active: { label: 'Active', variant: 'secondary', icon: Clock },
  handoff: { label: 'Needs Human', variant: 'destructive', icon: UserRound },
  booked: { label: 'Booked', variant: 'default', icon: CheckCircle2 },
  resolved: { label: 'Resolved', variant: 'outline', icon: CheckCircle2 },
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function ChatManagement({ token }: ChatManagementProps) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<ConversationSummary | null>(null)
  const [detail, setDetail] = useState<{ messages: ChatMessage[] } | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setConversations(data)
    } catch {
      setError('Failed to load chat conversations')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const openDetail = useCallback(
    async (conv: ConversationSummary) => {
      setSelected(conv)
      setDetail(null)
      setDetailLoading(true)
      try {
        const res = await fetch(`/api/chat/conversations/${conv.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setDetail(data)
      } catch {
        toast({ title: 'Error', description: 'Failed to load conversation', variant: 'destructive' })
      } finally {
        setDetailLoading(false)
      }
    },
    [token]
  )

  const markResolved = useCallback(async () => {
    if (!selected) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/chat/conversations/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'resolved' }),
      })
      if (!res.ok) throw new Error('Failed')
      toast({ title: 'Marked as resolved' })
      setSelected(null)
      fetchConversations()
    } catch {
      toast({ title: 'Error', description: 'Failed to update conversation', variant: 'destructive' })
    } finally {
      setUpdating(false)
    }
  }, [selected, token, fetchConversations])

  const needsHumanCount = conversations.filter((c) => c.status === 'handoff').length
  const bookedCount = conversations.filter((c) => c.status === 'booked').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dental-900">AI Chats & Leads</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conversations handled by the AI receptionist widget
          </p>
        </div>
        <Button variant="outline" onClick={fetchConversations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-dental-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-dental-100 text-dental-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Conversations</p>
              <p className="text-2xl font-bold text-foreground">{conversations.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-dental-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Needs Human</p>
              <p className="text-2xl font-bold text-foreground">{needsHumanCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-dental-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Booked via AI</p>
              <p className="text-2xl font-bold text-foreground">{bookedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchConversations} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      ) : conversations.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No chat conversations yet. Once a visitor uses the chat widget on your site, they&apos;ll show up here.
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => {
            const cfg = statusConfig[conv.status] || statusConfig.active
            return (
              <Card
                key={conv.id}
                onClick={() => openDetail(conv)}
                className="p-4 border-dental-100/60 hover:shadow-md hover:border-dental-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-dental-100 text-dental-600 flex items-center justify-center shrink-0">
                    <cfg.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-dental-800 truncate">
                        {conv.patientName || 'Anonymous visitor'}
                      </p>
                      {conv.patientPhone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Phone className="w-3 h-3" />
                          {conv.patientPhone}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage ? stripMarkdown(conv.lastMessage.content) : 'No messages'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDateTime(conv.lastMessageAt)}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-dental-100 flex items-center justify-between shrink-0">
                <div>
                  <p className="font-bold text-dental-800">{selected.patientName || 'Anonymous visitor'}</p>
                  {selected.patientPhone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {selected.patientPhone}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dental-50/40">
                {detailLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-3/4 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  detail?.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-dental-600 text-white rounded-br-sm'
                            : 'bg-white text-dental-800 border border-dental-100 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        <MessageContent content={m.content} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-dental-100 shrink-0 space-y-2">
                {selected.patientPhone && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={`tel:${selected.patientPhone.replace(/[^+\d]/g, '')}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call {selected.patientPhone}
                    </a>
                  </Button>
                )}
                {selected.status !== 'resolved' && (
                  <Button
                    onClick={markResolved}
                    disabled={updating}
                    className="w-full bg-dental-600 hover:bg-dental-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
