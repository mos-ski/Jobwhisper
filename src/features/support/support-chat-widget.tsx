import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bot,
  ChevronRight,
  Headphones,
  Mail,
  Minus,
  Send,
  User,
  X,
} from 'lucide-react'

import type {
  ChatState,
  KBArticle,
  QuickReply,
  SupportChatMessage,
} from '@/contracts/support-chat'
import { cn } from '@/ui'

/* ── Types ──────────────────────────────────────────────────────────────── */

export type SupportChatWidgetProps = {
  readonly messages: readonly SupportChatMessage[]
  readonly quickReplies: readonly QuickReply[]
  readonly chatState: ChatState
  readonly onSend: (text: string) => void
  readonly onQuickReply: (reply: QuickReply) => void
  readonly onClose: () => void
  readonly onOpenMenu: () => void
  readonly onMinimize: () => void
  readonly onFindAnswers: () => void
  readonly onContactUs: () => void
  readonly onSuggestImprovement: () => void
  readonly onStartEmail: () => void
  readonly onStartLiveChat: () => void
  readonly onGoBack: () => void
  readonly kbArticles?: readonly KBArticle[]
  readonly onKbArticleClick?: (article: KBArticle) => void
  readonly consentText?: string
  readonly onConsentDismiss?: () => void
}

/* ── FAB Button ──────────────────────────────────────────────────────────── */

function SupportFab({ onClick }: { readonly onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open support menu"
      className="group fixed bottom-4 end-4 z-sticky flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-200 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      style={{ backgroundColor: '#1E1E1F' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2A2A2B' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E1E1F' }}
    >
      <Headphones aria-hidden="true" className="size-5" />
      <span className="hidden sm:inline">Support</span>
    </button>
  )
}

/* ── Panel Header ────────────────────────────────────────────────────────── */

function PanelHeader({
  title,
  onBack,
  onClose,
}: {
  readonly title: string
  readonly onBack?: () => void
  readonly onClose: () => void
}) {
  return (
    <header className="flex items-center gap-2 border-b border-border px-4 py-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="grid size-8 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <ChevronRight aria-hidden="true" className="size-4 rotate-180" />
        </button>
      )}
      <h2 className="font-gowun text-base font-semibold text-ink">{title}</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close support"
        className="ms-auto grid size-8 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </header>
  )
}

/* ── Menu Panel ──────────────────────────────────────────────────────────── */

function MenuPanel({
  onFindAnswers,
  onContactUs,
  onSuggestImprovement,
  onClose,
}: {
  readonly onFindAnswers: () => void
  readonly onContactUs: () => void
  readonly onSuggestImprovement: () => void
  readonly onClose: () => void
}) {
  const items: readonly {
    readonly label: string
    readonly description: string
    readonly onClick: () => void
  }[] = [
    {
      label: 'Find answers',
      description: 'Browse our help articles',
      onClick: onFindAnswers,
    },
    {
      label: 'Contact us',
      description: 'Send an email or chat with us',
      onClick: onContactUs,
    },
    {
      label: 'Suggest improvement',
      description: 'Help us make Jobwhisper better',
      onClick: onSuggestImprovement,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Support" onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        <nav aria-label="Support options" className="grid gap-2">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-accent hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{item.label}</span>
                <span className="block text-xs text-ink-muted">{item.description}</span>
              </span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
            </button>
          ))}
        </nav>
      </div>
      <div className="border-t border-border px-4 py-2.5 text-center text-[11px] text-ink-muted">
        Powered by Jobwhisper Support
      </div>
    </div>
  )
}

/* ── Contact Sub-Menu ────────────────────────────────────────────────────── */

function ContactPanel({
  onStartEmail,
  onStartLiveChat,
  onGoBack,
  onClose,
}: {
  readonly onStartEmail: () => void
  readonly onStartLiveChat: () => void
  readonly onGoBack: () => void
  readonly onClose: () => void
}) {
  const methods: readonly {
    readonly icon: ReactNode
    readonly label: string
    readonly description: string
    readonly onClick: () => void
  }[] = [
    {
      icon: <Mail aria-hidden="true" className="size-5 text-accent" />,
      label: 'Send an email',
      description: 'We respond within 24 hours',
      onClick: onStartEmail,
    },
    {
      icon: <Headphones aria-hidden="true" className="size-5 text-accent" />,
      label: 'Live chat',
      description: 'Chat with our team in real time',
      onClick: onStartLiveChat,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Contact us" onBack={onGoBack} onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        <nav aria-label="Contact methods" className="grid gap-2">
          {methods.map((method) => (
            <button
              key={method.label}
              type="button"
              onClick={method.onClick}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-accent hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/10">{method.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">{method.label}</span>
                <span className="block text-xs text-ink-muted">{method.description}</span>
              </span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-ink-muted" />
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

/* ── Find Answers Panel ──────────────────────────────────────────────────── */

function FindAnswersPanel({
  articles,
  onArticleClick,
  onGoBack,
  onClose,
}: {
  readonly articles: readonly KBArticle[]
  readonly onArticleClick: (article: KBArticle) => void
  readonly onGoBack: () => void
  readonly onClose: () => void
}) {
  const [search, setSearch] = useState('')
  const filtered = articles.filter(
    (a) =>
      a.question.toLowerCase().includes(search.toLowerCase()) ||
      a.answer.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Find answers" onBack={onGoBack} onClose={onClose} />
      <div className="border-b border-border px-4 py-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help articles..."
          aria-label="Search help articles"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">No articles found</p>
        ) : (
          <div className="grid gap-2">
            {filtered.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => onArticleClick(article)}
                className="rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-accent hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="block text-sm font-semibold text-ink">{article.question}</span>
                <span className="mt-1 block text-xs text-ink-muted line-clamp-2">{article.answer}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Suggest Improvement Panel ───────────────────────────────────────────── */

function SuggestPanel({
  onGoBack,
  onClose,
}: {
  readonly onGoBack: () => void
  readonly onClose: () => void
}) {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(() => {
    if (!feedback.trim()) return
    setSubmitted(true)
  }, [feedback])

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Suggest improvement" onBack={onGoBack} onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-4">
        {submitted ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-positive/10 text-positive">
              <Sparkles aria-hidden="true" className="size-6" />
            </span>
            <p className="mt-4 font-gowun text-base font-semibold text-ink">Thanks for your feedback!</p>
            <p className="mt-1 text-sm text-ink-muted">We really appreciate you helping us improve.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-muted">What could we do better?</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you'd like to see improved..."
              rows={4}
              aria-label="Your feedback"
              className="mt-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
            >
              Submit feedback
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Email Compose Panel ─────────────────────────────────────────────────── */

function EmailPanel({
  onGoBack,
  onClose,
}: {
  readonly onGoBack: () => void
  readonly onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = useCallback(() => {
    if (!subject.trim() || !body.trim()) return
    setSent(true)
  }, [subject, body])

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Send an email" onBack={onGoBack} onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-4">
        {sent ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-positive/10 text-positive">
              <Mail aria-hidden="true" className="size-6" />
            </span>
            <p className="mt-4 font-gowun text-base font-semibold text-ink">Email sent!</p>
            <p className="mt-1 text-sm text-ink-muted">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <label htmlFor="support-email-subject" className="mb-1 block text-xs font-medium text-ink-muted">Subject</label>
            <input
              id="support-email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <label htmlFor="support-email-body" className="mb-1 mt-3 block text-xs font-medium text-ink-muted">Message</label>
            <textarea
              id="support-email-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!subject.trim() || !body.trim()}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40"
            >
              Send email
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Typing Indicator ────────────────────────────────────────────────────── */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-subtle">
        <Bot aria-hidden="true" className="size-4 text-ink-muted" />
      </span>
      <div className="rounded-lg rounded-tl-none bg-surface-subtle px-3.5 py-2.5">
        <span className="flex gap-1" aria-label="Bot is typing">
          <span className="inline-block size-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:0ms]" />
          <span className="inline-block size-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:150ms]" />
          <span className="inline-block size-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  )
}

/* ── Chat Message Bubble ─────────────────────────────────────────────────── */

function ChatBubble({ message }: { readonly message: SupportChatMessage }) {
  const isUser = message.sender === 'user'
  const isSystem = message.sender === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-1.5">
        <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs text-ink-muted">{message.body}</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-2.5 px-4 py-1.5', isUser ? 'flex-row-reverse' : '')}>
      <span className={cn(
        'grid size-7 shrink-0 place-items-center rounded-full',
        isUser ? 'bg-accent text-on-accent' : 'bg-surface-subtle text-ink-muted',
      )}>
        {isUser
          ? <User aria-hidden="true" className="size-4" />
          : <Bot aria-hidden="true" className="size-4" />}
      </span>
      <div className={cn(
        'max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed',
        isUser
          ? 'rounded-tr-none bg-accent text-on-accent'
          : 'rounded-tl-none bg-surface-subtle text-ink',
      )}>
        <p>{message.body}</p>
      </div>
    </div>
  )
}

/* ── Quick Reply Chips ───────────────────────────────────────────────────── */

function QuickReplyChips({
  replies,
  onSelect,
}: {
  readonly replies: readonly QuickReply[]
  readonly onSelect: (reply: QuickReply) => void
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 pb-2 pt-1" role="group" aria-label="Quick replies">
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          onClick={() => onSelect(reply)}
          className="shrink-0 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          {reply.label}
        </button>
      ))}
    </div>
  )
}

/* ── Chat Panel ──────────────────────────────────────────────────────────── */

function ChatPanel({
  messages,
  quickReplies,
  chatState,
  onSend,
  onQuickReply,
  onMinimize,
  onClose,
  consentText,
  onConsentDismiss,
}: {
  readonly messages: readonly SupportChatMessage[]
  readonly quickReplies: readonly QuickReply[]
  readonly chatState: ChatState
  readonly onSend: (text: string) => void
  readonly onQuickReply: (reply: QuickReply) => void
  readonly onMinimize: () => void
  readonly onClose: () => void
  readonly consentText: string
  readonly onConsentDismiss?: () => void
}) {
  const [consentVisible, setConsentVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, chatState])

  const handleSend = useCallback(() => {
    const trimmed = inputText.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInputText('')
    inputRef.current?.focus()
  }, [inputText, onSend])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleConsentDismiss = useCallback(() => {
    setConsentVisible(false)
    onConsentDismiss?.()
  }, [onConsentDismiss])

  const isWaiting = chatState === 'waiting-for-human'
  const isHuman = chatState === 'human'
  const showQuickReplies = !isWaiting && !isHuman && chatState !== 'typing' && quickReplies.length > 0

  return (
    <>
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-accent/10">
            <Headphones aria-hidden="true" className="size-4 text-accent" />
          </span>
          <div>
            <h2 className="font-gowun text-sm font-semibold leading-tight text-ink">Jobwhisper</h2>
            <p className="text-[11px] text-ink-muted">
              {isWaiting && 'Connecting you to a team member...'}
              {isHuman && (
                <span className="flex items-center gap-1">
                  <span className="inline-block size-1.5 rounded-full bg-positive" />
                  Daniel Okoye is here
                </span>
              )}
              {!isWaiting && !isHuman && 'Customer Support'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="grid size-8 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Minus aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="grid size-8 place-items-center rounded-soft text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {chatState === 'typing' && <TypingIndicator />}
      </div>

      {showQuickReplies && (
        <QuickReplyChips replies={quickReplies} onSelect={onQuickReply} />
      )}

      {consentVisible && messages.length <= 1 && (
        <div className="flex items-center gap-2 border-t border-border bg-surface-subtle/50 px-3 py-2 text-[11px] text-ink-muted">
          <span className="min-w-0 flex-1">{consentText}</span>
          <button
            type="button"
            onClick={handleConsentDismiss}
            aria-label="Dismiss consent notice"
            className="shrink-0 text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isWaiting ? 'Waiting for a team member...' : 'Type a message...'}
          disabled={isWaiting}
          aria-label="Type a message"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim() || isWaiting}
          aria-label="Send message"
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40 disabled:hover:bg-accent"
        >
          <Send aria-hidden="true" className="size-4" />
        </button>
      </div>
    </>
  )
}

/* ── Main Widget ─────────────────────────────────────────────────────────── */

export function SupportChatWidget({
  messages,
  quickReplies,
  chatState,
  onSend,
  onQuickReply,
  onClose,
  onOpenMenu,
  onMinimize,
  onFindAnswers,
  onContactUs,
  onSuggestImprovement,
  onStartEmail,
  onStartLiveChat,
  onGoBack,
  kbArticles = [],
  onKbArticleClick,
  consentText = 'By continuing this chat, you agree to our Terms of Service and Privacy Policy.',
  onConsentDismiss,
}: SupportChatWidgetProps) {
  if (chatState === 'idle') {
    return <SupportFab onClick={onOpenMenu} />
  }

  return (
    <aside
      role="dialog"
      aria-label="Support chat"
      className="fixed bottom-4 end-4 z-sticky flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-panel border border-border bg-canvas shadow-xl animate-ease-in-bottom motion-reduce:animate-none sm:w-[22rem]"
      style={{ height: 'min(36rem, calc(100vh - 2rem))' }}
    >
      {chatState === 'menu' && (
        <MenuPanel
          onFindAnswers={onFindAnswers}
          onContactUs={onContactUs}
          onSuggestImprovement={onSuggestImprovement}
          onClose={onClose}
        />
      )}

      {chatState === 'contact-us' && (
        <ContactPanel
          onStartEmail={onStartEmail}
          onStartLiveChat={onStartLiveChat}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}

      {chatState === 'find-answers' && (
        <FindAnswersPanel
          articles={kbArticles}
          onArticleClick={(a) => onKbArticleClick?.(a)}
          onGoBack={onGoBack}
          onClose={onClose}
        />
      )}

      {chatState === 'suggest' && (
        <SuggestPanel onGoBack={onGoBack} onClose={onClose} />
      )}

      {chatState === 'email' && (
        <EmailPanel onGoBack={onGoBack} onClose={onClose} />
      )}

      {(chatState === 'chat' || chatState === 'typing' || chatState === 'waiting-for-human' || chatState === 'human') && (
        <ChatPanel
          messages={messages}
          quickReplies={quickReplies}
          chatState={chatState}
          onSend={onSend}
          onQuickReply={onQuickReply}
          onMinimize={onMinimize}
          onClose={onClose}
          consentText={consentText}
          onConsentDismiss={onConsentDismiss}
        />
      )}
    </aside>
  )
}

export type { SupportChatMessage, QuickReply, ChatState, KBArticle }
