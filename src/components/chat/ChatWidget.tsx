'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Stethoscope, CheckCircle2, UserRound, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MessageContent from './MessageContent'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Each page load starts a brand new conversation — nothing is persisted
// across refreshes. Within the same page view, "New chat" resets it too.
const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi, I'm Bright 🦷 — BrightSmile's AI assistant. I can answer questions about our services, hours, and pricing, or book your appointment right now. How can I help?",
}

const QUICK_ACTIONS = ['Book an appointment', 'What are your working hours?', 'Talk to a human']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [configError, setConfigError] = useState(false)
  const sessionIdRef = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, open])

  const resetConversation = useCallback(() => {
    sessionIdRef.current = null
    setMessages([GREETING])
    setStatus(null)
    setInput('')
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      const next = [...messages, { role: 'user' as const, content: trimmed }]
      setMessages(next)
      setInput('')
      setLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current, message: trimmed }),
        })

        if (res.status === 503) {
          setConfigError(true)
          setMessages([
            ...next,
            {
              role: 'assistant' as const,
              content:
                "Our AI assistant isn't fully set up yet — please call us or use the contact form and our team will help you directly.",
            },
          ])
          return
        }

        if (!res.ok) throw new Error('Request failed')

        const data = await res.json()
        if (data.sessionId) {
          sessionIdRef.current = data.sessionId
        }
        setStatus(data.status || null)
        setMessages([...next, { role: 'assistant' as const, content: data.reply }])
      } catch {
        setMessages([
          ...next,
          {
            role: 'assistant' as const,
            content: "Sorry, something went wrong on my end. Please try again in a moment, or call the clinic directly.",
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[360px] max-w-[calc(100vw-2.5rem)] h-[540px] max-h-[75vh] bg-white rounded-2xl shadow-2xl shadow-dental-900/20 border border-dental-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="dental-gradient px-4 py-3.5 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white leading-tight">Bright — AI Assistant</p>
                <p className="text-[11px] text-white/80 leading-tight">BrightSmile Dental Clinic</p>
              </div>
              {messages.length > 1 && (
                <button
                  onClick={resetConversation}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:bg-white/20 transition-colors shrink-0"
                  aria-label="Start new conversation"
                  title="Start new conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/90 hover:bg-white/20 transition-colors shrink-0"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === 'booked' && (
              <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2 text-xs font-medium text-emerald-700 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Appointment request sent — pending confirmation
              </div>
            )}
            {status === 'handoff' && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs font-medium text-amber-700 shrink-0">
                <UserRound className="w-3.5 h-3.5" />
                A team member will follow up with you shortly
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-dental-50/40">
              {messages.map((m, i) => (
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
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-dental-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-dental-500" />
                  </div>
                </div>
              )}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      className="text-xs font-medium text-dental-700 bg-white border border-dental-200 rounded-full px-3 py-1.5 hover:bg-dental-50 hover:border-dental-300 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-dental-100 flex items-center gap-2 shrink-0 bg-white">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={configError ? 'Assistant unavailable — call us instead' : 'Type your message...'}
                disabled={loading || configError}
                className="border-dental-200 focus-visible:ring-dental-500/30 h-10"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || configError || !input.trim()}
                className="bg-dental-600 hover:bg-dental-700 text-white h-10 w-10 shrink-0 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className="dental-gradient w-14 h-14 rounded-full shadow-lg shadow-dental-600/30 flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
