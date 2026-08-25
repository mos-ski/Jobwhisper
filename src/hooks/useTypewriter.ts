import { useEffect, useRef, useState } from 'react'

export type TypewriterOptions = {
  readonly durationMs?: number
  readonly onDone?: () => void
}

export function useTypewriter() {
  const [isTyping, setIsTyping] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    },
    [],
  )

  function type(text: string, onUpdate: (partial: string) => void, options?: TypewriterOptions) {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current)

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || text.length === 0) {
      onUpdate(text)
      setIsTyping(false)
      options?.onDone?.()
      return
    }

    const durationMs = options?.durationMs ?? 900
    const speed = Math.max(12, Math.min(30, durationMs / text.length))
    setIsTyping(true)
    let index = 0
    intervalRef.current = window.setInterval(() => {
      index++
      onUpdate(text.slice(0, index))
      if (index >= text.length) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
        setIsTyping(false)
        options?.onDone?.()
      }
    }, speed)
  }

  return { type, isTyping }
}
