import { useState, useRef, useEffect } from 'react'
import { Send, ArrowUpRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

// ---------------------------------------------------------------------------
// Pre-text prompts
// ---------------------------------------------------------------------------

type PanelVariant = 'default'

const PROMPTS: Record<PanelVariant, string[]> = {
  default: [
    'Summarize the discussion so far',
    'How well am I doing so far?',
    'Suggest follow-up questions',
    'What was discussed in the last two minutes?',
  ],
}

// ---------------------------------------------------------------------------
// Mock AI responses (will be replaced with real API calls)
// ---------------------------------------------------------------------------

function getMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase()

  if (lower.includes('summarize') || lower.includes('summary')) {
    return 'The discussion has covered several key topics including project timelines, resource allocation, and team responsibilities. The main decisions so far align on prioritising the Q3 launch, with additional QA resources approved. Open items include final budget sign-off and the marketing rollout plan.'
  }
  if (lower.includes('how well') || lower.includes('doing')) {
    return 'You\'re doing well so far. Your responses are clear and structured. A few areas to strengthen: try anchoring more answers with specific metrics or data points, and consider bridging back to the company\'s goals more explicitly. Overall, confident tone and good engagement.'
  }
  if (lower.includes('follow') || lower.includes('question')) {
    return 'Based on the conversation, consider asking:\n\n1. "What does success look like in the first 90 days?"\n2. "How does the team handle disagreements on priorities?"\n3. "What\'s the biggest challenge the team is facing right now?"\n4. "How do you measure performance for this role?"'
  }
  if (lower.includes('last two') || lower.includes('recent')) {
    return 'In the last two minutes, the conversation touched on upcoming product milestones and the need for cross-functional alignment. The interviewer mentioned a potential restructure of the design team and asked about your experience managing competing deadlines.'
  }
  if (lower.includes('action')) {
    return 'Key action items identified:\n\n• Finalise Q3 roadmap by end of week\n• Schedule follow-up with engineering lead\n• Share portfolio examples of past cross-functional work\n• Send thank-you email within 24 hours'
  }
  if (lower.includes('haven') || lower.includes('cover') || lower.includes('topic')) {
    return 'Topics not yet discussed that may come up:\n\n• Salary expectations and compensation structure\n• Team size and reporting lines\n• Remote/hybrid work policy\n• Professional development opportunities\n• Company culture and values alignment'
  }
  return `Here's my analysis of your query:\n\n"${prompt}"\n\nBased on the current conversation context, I'd recommend staying focused on demonstrating measurable impact and connecting your experience directly to the role's requirements. Keep answers concise and data-driven.`
}

// ---------------------------------------------------------------------------
// AIAssistantPanel Component
// ---------------------------------------------------------------------------

interface AIAssistantPanelProps {
  /** Extra context string injected into mock responses (e.g. job title) */
  context?: string
  /** Compact mode — smaller font, tighter spacing */
  compact?: boolean
  /** Window transparency percentage inherited from the desktop copilot shell */
  transparency?: number
  /** Callback to close the panel (shows close button) */
  onClose?: () => void
}

function transparentSurface(hex: string, transparency = 0, minAlpha = 0) {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const alpha = Math.max(minAlpha, (100 - transparency) / 100)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function AIAssistantPanel({ context, compact, transparency = 0, onClose }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prompts = PROMPTS.default
  const panelBg = transparentSurface('#0D1929', transparency)
  const bubbleBg = transparentSurface('#1A2F4A', transparency, 0.28)
  const inputBg = transparentSurface('#0A1628', transparency, 0.24)
  const glassBorder = transparency > 0 ? 'rgba(255, 255, 255, 0.24)' : '#1E2D45'
  const glassDivider = transparency > 0 ? 'rgba(255, 255, 255, 0.16)' : '#1E2D45'

  // Auto-scroll to bottom on new messages (scrollTo is absent in jsdom, hence the optional call)
  useEffect(() => {
    panelRef.current?.scrollTo?.({ top: panelRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  function handleSend(text?: string) {
    const query = (text || input).trim()
    if (!query || isTyping) return

    const userMsg: ChatMessage = { role: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getMockResponse(query)
      setMessages(prev => [...prev, { role: 'assistant', text: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[6px]"
      style={{ background: panelBg, border: `1px solid ${glassBorder}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: glassDivider }}>
        <div className="flex items-center text-sm font-medium text-white">
          AI Assistant
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Chat messages */}
      <div ref={panelRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[90%] rounded-lg px-3 py-2',
                compact ? 'text-xs' : 'text-sm',
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100'
                  : 'text-slate-200',
              )}
              style={msg.role === 'assistant' ? { background: bubbleBg } : undefined}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2" style={{ background: bubbleBg }}>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-slate-500"
                    style={{
                      animation: 'aiTypingDot 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pre-text prompts (only show when no messages yet) */}
      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex flex-col gap-1.5">
            {prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="group flex min-w-0 items-center gap-1 rounded-[3px] px-2.5 py-1 text-left text-[10px] font-medium text-slate-200/85 transition-colors hover:bg-white/10 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.16)' }}
              >
                <ArrowUpRight className="h-2.5 w-2.5 shrink-0 text-slate-300/70 transition-colors group-hover:text-blue-400" />
                <span className="min-w-0 flex-1 truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t px-3 py-2.5" style={{ borderColor: glassDivider }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: inputBg, border: `1px solid ${glassBorder}` }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI anything..."
            className={cn(
              'flex-1 bg-transparent text-white placeholder:text-slate-400 outline-none',
              compact ? 'text-xs' : 'text-sm',
            )}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              input.trim() && !isTyping
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'text-slate-400',
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Inject keyframe for typing dots */}
      <style>{`
        @keyframes aiTypingDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
