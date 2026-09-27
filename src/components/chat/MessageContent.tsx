// Lightweight markdown-lite renderer for chat bubbles — the AI receptionist
// often replies with **bold** and "- " bullet lists, which must not show up
// as literal asterisks/dashes in the widget or the admin transcript viewer.
// Deliberately not a full markdown parser (no dependency, no raw HTML) —
// just the handful of patterns the model actually produces.

// For single-line truncated previews (e.g. a conversation list row) where
// there's no room to render real markdown — strips the markers instead of
// showing literal asterisks/dashes.
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/\s*\n+\s*/g, ' ')
    .trim()
}

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

export default function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let currentList: string[] = []

  const flushList = (key: string) => {
    if (currentList.length === 0) return
    blocks.push(
      <ul key={key} className="list-disc pl-4 space-y-0.5">
        {currentList.map((item, i) => (
          <li key={i}>{renderInline(item, `${key}-li-${i}`)}</li>
        ))}
      </ul>
    )
    currentList = []
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    const listMatch = /^[-*]\s+(.*)$/.exec(trimmed)
    if (listMatch) {
      currentList.push(listMatch[1])
      return
    }
    flushList(`list-${idx}`)
    if (trimmed.length > 0) {
      blocks.push(<p key={`p-${idx}`}>{renderInline(trimmed, `p-${idx}`)}</p>)
    }
  })
  flushList('list-end')

  return <div className="space-y-1.5">{blocks}</div>
}
