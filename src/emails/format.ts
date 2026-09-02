export const COMMON_TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Africa/Lagos', label: 'Lagos' },
  { value: 'Africa/Nairobi', label: 'Nairobi' },
  { value: 'Asia/Kolkata', label: 'Mumbai / Bengaluru' },
  { value: 'Asia/Dubai', label: 'Dubai' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Australia/Sydney', label: 'Sydney' },
] as const

export type TimeZoneValue = (typeof COMMON_TIMEZONES)[number]['value']

export function formatDateTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

export function formatDateInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}
