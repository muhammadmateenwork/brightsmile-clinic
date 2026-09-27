import { NextRequest, NextResponse } from 'next/server'
import { connectDB, ChatConversation, Dentist } from '@/lib/db'
import { getOpenRouterClient, CHAT_MODELS } from '@/lib/chat/client'
import { CHAT_TOOLS, executeTool } from '@/lib/chat/tools'
import { buildSystemPrompt } from '@/lib/chat/systemPrompt'
import type OpenAI from 'openai'

const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_MESSAGES = 40
const MAX_TOOL_ITERATIONS = 5
const COMPLETION_RETRY_ATTEMPTS = 3

async function createCompletionWithRetry(
  openrouter: OpenAI,
  params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
) {
  let lastError: unknown
  for (let attempt = 1; attempt <= COMPLETION_RETRY_ATTEMPTS; attempt++) {
    try {
      return await openrouter.chat.completions.create(params)
    } catch (error) {
      lastError = error
      const status = (error as { status?: number })?.status
      console.error(`OpenRouter request failed (attempt ${attempt}/${COMPLETION_RETRY_ATTEMPTS}, status ${status ?? 'n/a'}):`, error)
      if (attempt < COMPLETION_RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt))
      }
    }
  }
  throw lastError
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'chat_not_configured', message: 'The AI receptionist is not set up yet. Please call or use the contact form instead.' },
        { status: 503 }
      )
    }

    await connectDB()

    const body = await request.json()
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    let sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
    }

    let conversation = sessionId ? await ChatConversation.findOne({ sessionId }) : null
    if (!conversation) {
      sessionId = crypto.randomUUID()
      conversation = await ChatConversation.create({ sessionId, messages: [] })
    }

    conversation.messages.push({ role: 'user', content: message })

    const dentists = await Dentist.find({}).select('name specialty available').lean()
    const systemPrompt = buildSystemPrompt(
      dentists.map((d: any) => ({ name: d.name, specialty: d.specialty, available: d.available }))
    )

    const history = conversation.messages.slice(-MAX_HISTORY_MESSAGES)
    let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    const openrouter = getOpenRouterClient()
    const toolCtx = {
      conversation: {
        patientName: conversation.patientName,
        patientPhone: conversation.patientPhone,
        status: conversation.status as 'active' | 'handoff' | 'booked' | 'resolved',
        handoffReason: conversation.handoffReason,
        appointmentId: conversation.appointmentId,
      },
    }

    let finalText = ''

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      // OpenRouter tries `models` in order, automatically failing over to the
      // next one if the primary errors out or hits a rate limit. We also
      // retry the whole request a couple of times for transient network blips.
      const response = await createCompletionWithRetry(openrouter, {
        model: CHAT_MODELS[0],
        models: CHAT_MODELS,
        max_tokens: 1024,
        messages,
        tools: CHAT_TOOLS,
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming)

      const choice = response.choices[0]
      if (!choice) break
      const responseMessage = choice.message

      finalText = (responseMessage.content || '').trim()

      const toolCalls = responseMessage.tool_calls
      if (!toolCalls || toolCalls.length === 0) break

      messages = [...messages, responseMessage]

      for (const call of toolCalls) {
        if (call.type !== 'function') continue
        let args: Record<string, any> = {}
        try {
          args = JSON.parse(call.function.arguments || '{}')
        } catch {
          args = {}
        }
        const result = await executeTool(call.function.name, args, toolCtx)
        messages = [...messages, { role: 'tool', tool_call_id: call.id, content: result }]
      }
    }

    if (!finalText) {
      finalText = "Sorry, I'm having trouble responding right now. Please try again or call us directly."
    }

    conversation.messages.push({ role: 'assistant', content: finalText })
    conversation.patientName = toolCtx.conversation.patientName
    conversation.patientPhone = toolCtx.conversation.patientPhone
    conversation.status = toolCtx.conversation.status
    conversation.handoffReason = toolCtx.conversation.handoffReason
    conversation.appointmentId = toolCtx.conversation.appointmentId as any
    conversation.lastMessageAt = new Date()
    await conversation.save()

    return NextResponse.json({
      sessionId,
      reply: finalText,
      status: conversation.status,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
