import OpenAI from 'openai'

// BrightSmile's AI receptionist runs on OpenRouter so it can fail over
// between models automatically (a model outage or a free-tier rate limit
// shouldn't take the chat widget down).
const DEFAULT_MODELS = [
  'anthropic/claude-3.5-haiku',
  'openai/gpt-4o-mini',
  'google/gemini-2.0-flash-001',
]

let client: OpenAI | null = null

export function getOpenRouterClient(): OpenAI {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set. Add it to .env.local')
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://brightsmile-dental-clinic.example.com',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'BrightSmile Dental Clinic',
      },
    })
  }
  return client
}

// Comma-separated list in OPENROUTER_MODELS; first is primary, rest are
// fallbacks OpenRouter tries in order if the primary errors or is rate-limited.
export const CHAT_MODELS: string[] = (process.env.OPENROUTER_MODELS || DEFAULT_MODELS.join(','))
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)
