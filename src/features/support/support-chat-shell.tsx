import { useCallback, useState } from 'react'

import type {
  ChatState,
  KBArticle,
  QuickReply,
  SupportChatMessage,
} from '@/contracts/support-chat'
import {
  supportBotGreeting,
  supportBotResponses,
  supportChatQuickReplies,
  supportHandoffMessage,
  supportHumanMessage,
  supportUserMessage1,
  supportBotMessage1,
} from '@/mocks/support-chat'
import { SupportChatWidget } from './support-chat-widget'

export type SupportChatShellProps = {
  readonly kbArticles?: readonly KBArticle[]
}

let messageCounter = 0
function nextId() {
  messageCounter += 1
  return `msg_${messageCounter}`
}

function matchBotResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [keyword, response] of Object.entries(supportBotResponses)) {
    if (lower.includes(keyword)) return response
  }
  return "Thanks for your message! I'm not sure I can help with that directly. Let me connect you with a team member who can."
}

export function SupportChatShell({ kbArticles = [] }: SupportChatShellProps) {
  const [chatState, setChatState] = useState<ChatState>('idle')
  const [messages, setMessages] = useState<readonly SupportChatMessage[]>([])
  const [quickReplies, setQuickReplies] = useState<readonly QuickReply[]>(supportChatQuickReplies)

  const handleOpenMenu = useCallback(() => {
    setChatState('menu')
  }, [])

  const handleMinimize = useCallback(() => {
    setChatState('idle')
  }, [])

  const handleClose = useCallback(() => {
    setChatState('idle')
    setMessages([])
    setQuickReplies(supportChatQuickReplies)
  }, [])

  const handleFindAnswers = useCallback(() => {
    setChatState('find-answers')
  }, [])

  const handleContactUs = useCallback(() => {
    setChatState('contact-us')
  }, [])

  const handleSuggestImprovement = useCallback(() => {
    setChatState('suggest')
  }, [])

  const handleStartEmail = useCallback(() => {
    setChatState('email')
  }, [])

  const handleStartLiveChat = useCallback(() => {
    setChatState('chat')
    setMessages([supportBotGreeting])
  }, [])

  const handleGoBack = useCallback(() => {
    setChatState('menu')
  }, [])

  const handleSend = useCallback((text: string) => {
    const userMsg: SupportChatMessage = {
      id: nextId(),
      sender: 'user',
      authorName: 'You',
      body: text,
      timestampLabel: 'Just now',
    }
    setMessages((prev) => [...prev, userMsg])

    if (text.toLowerCase().includes('human') || text.toLowerCase().includes('team member')) {
      setChatState('typing')
      setQuickReplies([])
      setTimeout(() => {
        setMessages((prev) => [...prev, supportHandoffMessage])
        setChatState('waiting-for-human')
        setTimeout(() => {
          setMessages((prev) => [...prev, supportHumanMessage])
          setChatState('human')
        }, 2000)
      }, 1500)
      return
    }

    setChatState('typing')
    setQuickReplies([])

    setTimeout(() => {
      const botResponse = matchBotResponse(text)
      const botMsg: SupportChatMessage = {
        id: nextId(),
        sender: 'bot',
        authorName: 'Jobwhisper Bot',
        body: botResponse,
        timestampLabel: 'Just now',
      }
      setMessages((prev) => [...prev, botMsg])
      setChatState('chat')
      setQuickReplies(supportChatQuickReplies.filter((r) => r.id !== 'qr_human'))
    }, 1500)
  }, [])

  const handleQuickReply = useCallback((reply: QuickReply) => {
    handleSend(reply.payload)
  }, [handleSend])

  return (
    <SupportChatWidget
      messages={messages}
      quickReplies={quickReplies}
      chatState={chatState}
      onSend={handleSend}
      onQuickReply={handleQuickReply}
      onClose={handleClose}
      onOpenMenu={handleOpenMenu}
      onMinimize={handleMinimize}
      onFindAnswers={handleFindAnswers}
      onContactUs={handleContactUs}
      onSuggestImprovement={handleSuggestImprovement}
      onStartEmail={handleStartEmail}
      onStartLiveChat={handleStartLiveChat}
      onGoBack={handleGoBack}
      kbArticles={kbArticles}
    />
  )
}
