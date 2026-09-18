/**
 * Draft contract for the live support chat widget — bot-first, human escalation.
 * No real backend; all types exist so views and mocks stay typed.
 */

export type SupportChatSender = 'user' | 'bot' | 'system' | 'human'

export type SupportChatMessage = {
  readonly id: string
  readonly sender: SupportChatSender
  readonly authorName: string
  readonly body: string
  readonly timestampLabel: string
}

export type QuickReply = {
  readonly id: string
  readonly label: string
  readonly payload: string
}

export type ChatState =
  | 'idle'
  | 'menu'
  | 'find-answers'
  | 'contact-us'
  | 'suggest'
  | 'email'
  | 'chat'
  | 'typing'
  | 'waiting-for-human'
  | 'human'

export type SupportChatSession = {
  readonly id: string
  readonly state: ChatState
  readonly messages: readonly SupportChatMessage[]
  readonly quickReplies: readonly QuickReply[]
}

export type KBArticle = {
  readonly id: string
  readonly category: string
  readonly question: string
  readonly answer: string
  readonly updatedAtLabel: string
  readonly isPublished: boolean
}

export type KBCategory = {
  readonly id: string
  readonly label: string
  readonly count: number
}
