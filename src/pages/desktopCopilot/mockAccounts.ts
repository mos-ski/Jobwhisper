// src/pages/desktopCopilot/mockAccounts.ts
// Mock, localStorage-backed account registry so the desktop Copilot prototype
// can demo "returning user" login routing without a real backend.

export type AccountType = 'regular'

export interface MockAccountRecord {
  accountType: AccountType
  planId?: 'starter' | 'pro' | 'premium'
}

const STORAGE_KEY = 'lightforth-desktop-mock-accounts'

function readStore(): Record<string, MockAccountRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, MockAccountRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore — mock persistence only, fine to no-op if storage is unavailable
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getAccount(email: string): MockAccountRecord | null {
  const store = readStore()
  return store[normalizeEmail(email)] ?? null
}

export function setAccount(email: string, record: MockAccountRecord): void {
  const store = readStore()
  store[normalizeEmail(email)] = record
  writeStore(store)
}
