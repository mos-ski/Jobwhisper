import { createContext, useContext, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { GripHorizontal } from 'lucide-react'

import { cn } from '@/ui'

const DesktopFrameContext = createContext<HTMLDivElement | null>(null)

export function useDesktopFrameElement(): HTMLDivElement | null {
  return useContext(DesktopFrameContext)
}

const MIN_WIDTH = 720
const MIN_HEIGHT = 480
const DEFAULT_WIDTH = 1040
const DEFAULT_HEIGHT = 680
const VIEWPORT_MARGIN = 24

type WindowFrame = {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

function clampFrame(frame: WindowFrame): WindowFrame {
  const maxWidth = Math.max(MIN_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2)
  const maxHeight = Math.max(MIN_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2)
  const width = Math.min(Math.max(frame.width, MIN_WIDTH), maxWidth)
  const height = Math.min(Math.max(frame.height, MIN_HEIGHT), maxHeight)
  const x = Math.min(Math.max(frame.x, VIEWPORT_MARGIN), Math.max(window.innerWidth - width - VIEWPORT_MARGIN, VIEWPORT_MARGIN))
  const y = Math.min(Math.max(frame.y, VIEWPORT_MARGIN), Math.max(window.innerHeight - height - VIEWPORT_MARGIN, VIEWPORT_MARGIN))
  return { x, y, width, height }
}

function initialFrame(): WindowFrame {
  const width = Math.min(DEFAULT_WIDTH, window.innerWidth - VIEWPORT_MARGIN * 2)
  const height = Math.min(DEFAULT_HEIGHT, window.innerHeight - VIEWPORT_MARGIN * 2)
  return { x: (window.innerWidth - width) / 2, y: (window.innerHeight - height) / 2, width, height }
}

export type DesktopShellProps = {
  readonly children: ReactNode
}

export function DesktopShell({ children }: DesktopShellProps) {
  const [frame, setFrame] = useState<WindowFrame>(initialFrame)
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null)
  const dragState = useRef<{ readonly startX: number; readonly startY: number; readonly originX: number; readonly originY: number } | null>(null)
  const resizeState = useRef<{ readonly startX: number; readonly startY: number; readonly originWidth: number; readonly originHeight: number } | null>(null)

  useEffect(() => {
    function handleViewportResize() {
      setFrame((prev) => clampFrame(prev))
    }
    window.addEventListener('resize', handleViewportResize)
    return () => window.removeEventListener('resize', handleViewportResize)
  }, [])

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (dragState.current) {
        const { startX, startY, originX, originY } = dragState.current
        setFrame((prev) => clampFrame({ ...prev, x: originX + (event.clientX - startX), y: originY + (event.clientY - startY) }))
      } else if (resizeState.current) {
        const { startX, startY, originWidth, originHeight } = resizeState.current
        setFrame((prev) => clampFrame({ ...prev, width: originWidth + (event.clientX - startX), height: originHeight + (event.clientY - startY) }))
      }
    }
    function handleUp() {
      dragState.current = null
      resizeState.current = null
    }
    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [])

  function handleTitleBarPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragState.current = { startX: event.clientX, startY: event.clientY, originX: frame.x, originY: frame.y }
  }

  function handleResizePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.stopPropagation()
    resizeState.current = { startX: event.clientX, startY: event.clientY, originWidth: frame.width, originHeight: frame.height }
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-canvas">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 size-[560px] rounded-full bg-accent-subtle blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 size-[620px] rounded-full bg-accent-muted blur-3xl" />
      <div
        ref={setFrameEl}
        className="absolute flex flex-col overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5"
        style={{ left: frame.x, top: frame.y, width: frame.width, height: frame.height }}
      >
        <div
          onPointerDown={handleTitleBarPointerDown}
          className="flex h-[68px] shrink-0 cursor-grab items-center bg-[#141d2e] px-[27px] select-none active:cursor-grabbing"
        >
          <div className="flex items-center gap-[7px]">
            <span className="size-3.5 rounded-full bg-[#ff5f57]" />
            <span className="size-3.5 rounded-full bg-[#febc2e]" />
            <span className="size-3.5 rounded-full bg-[#28c840]" />
          </div>
        </div>
        <DesktopFrameContext.Provider value={frameEl}>
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        </DesktopFrameContext.Provider>
        <div
          onPointerDown={handleResizePointerDown}
          role="presentation"
          aria-hidden="true"
          className={cn('absolute bottom-0 right-0 z-10 grid size-5 cursor-nwse-resize place-items-center text-white/40')}
        >
          <GripHorizontal aria-hidden="true" className="size-3.5 rotate-45" />
        </div>
      </div>
    </div>
  )
}
