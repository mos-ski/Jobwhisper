import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const BG       = '#0c1d48'
export const CARD     = 'rgba(255,255,255,0.07)'
export const BORDER   = 'rgba(255,255,255,0.12)'
export const INPUT_BG = 'rgba(255,255,255,0.08)'
export const INPUT_BD = 'rgba(255,255,255,0.15)'
export const BLUE     = '#1a7aff'

export function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
}

export function LightningLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M19 3L7 18H16L13 29L25 14H16L19 3Z" fill="#60a5fa" />
      <path d="M19 3L16 14H25L19 3Z" fill="#1a7aff" />
    </svg>
  )
}

interface WindowFrame {
  width: number
  height: number
  x: number
  y: number
}

type ResizeEdge = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface WindowInteraction {
  type: 'drag' | 'resize'
  edge?: ResizeEdge
  startX: number
  startY: number
  startFrame: WindowFrame
}

const MIN_WINDOW_WIDTH = 520
const MIN_WINDOW_HEIGHT = 440
const DESKTOP_PADDING = 24

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function viewportSize() {
  if (typeof window === 'undefined') return { width: 1200, height: 820 }
  return { width: window.innerWidth, height: window.innerHeight }
}

function clampFrame(frame: WindowFrame): WindowFrame {
  const viewport = viewportSize()
  const maxWidth = Math.max(MIN_WINDOW_WIDTH, viewport.width - DESKTOP_PADDING * 2)
  const maxHeight = Math.max(MIN_WINDOW_HEIGHT, viewport.height - DESKTOP_PADDING * 2)
  const width = clamp(frame.width, MIN_WINDOW_WIDTH, maxWidth)
  const height = clamp(frame.height, MIN_WINDOW_HEIGHT, maxHeight)
  const maxX = Math.max(0, (viewport.width - width) / 2 - DESKTOP_PADDING)
  const maxY = Math.max(0, (viewport.height - height) / 2 - DESKTOP_PADDING)

  return {
    width,
    height,
    x: clamp(frame.x, -maxX, maxX),
    y: clamp(frame.y, -maxY, maxY),
  }
}

function frameToBounds(frame: WindowFrame) {
  const viewport = viewportSize()
  return {
    left: viewport.width / 2 + frame.x - frame.width / 2,
    top: viewport.height / 2 + frame.y - frame.height / 2,
    right: viewport.width / 2 + frame.x + frame.width / 2,
    bottom: viewport.height / 2 + frame.y + frame.height / 2,
  }
}

function boundsToFrame(bounds: { left: number; top: number; right: number; bottom: number }): WindowFrame {
  const viewport = viewportSize()
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top

  return clampFrame({
    width,
    height,
    x: bounds.left + width / 2 - viewport.width / 2,
    y: bounds.top + height / 2 - viewport.height / 2,
  })
}

export function MacWindow({ children, blendBar, transparency = 0 }: { children: ReactNode; blendBar?: boolean; transparency?: number }) {
  const bgAlpha = (100 - transparency) / 100
  const windowBg = `rgba(12, 29, 72, ${bgAlpha})`
  const [frame, setFrame] = useState<WindowFrame>({ width: 960, height: 700, x: 0, y: 0 })
  const interactionRef = useRef<WindowInteraction | null>(null)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const interaction = interactionRef.current
      if (!interaction) return

      const dx = event.clientX - interaction.startX
      const dy = event.clientY - interaction.startY

      if (interaction.type === 'drag') {
        setFrame(clampFrame({
          ...interaction.startFrame,
          x: interaction.startFrame.x + dx,
          y: interaction.startFrame.y + dy,
        }))
        return
      }

      const edge = interaction.edge
      if (!edge) return

      const bounds = frameToBounds(interaction.startFrame)
      const nextBounds = {
        left: edge.includes('w') ? bounds.left + dx : bounds.left,
        right: edge.includes('e') ? bounds.right + dx : bounds.right,
        top: edge.includes('n') ? bounds.top + dy : bounds.top,
        bottom: edge.includes('s') ? bounds.bottom + dy : bounds.bottom,
      }

      setFrame(boundsToFrame(nextBounds))
    }

    const handlePointerUp = () => {
      interactionRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    const handleResize = () => setFrame((current) => clampFrame(current))

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    interactionRef.current = {
      type: 'drag',
      startX: event.clientX,
      startY: event.clientY,
      startFrame: frame,
    }
    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  const startResize = (edge: ResizeEdge, cursor: string) => (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    interactionRef.current = {
      type: 'resize',
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startFrame: frame,
    }
    document.body.style.cursor = cursor
    document.body.style.userSelect = 'none'
  }

  const resizeHandles: { edge: ResizeEdge; className: string; cursor: string }[] = [
    { edge: 'n', cursor: 'ns-resize', className: 'left-3 right-3 top-0 h-2 cursor-ns-resize' },
    { edge: 's', cursor: 'ns-resize', className: 'bottom-0 left-3 right-3 h-2 cursor-ns-resize' },
    { edge: 'e', cursor: 'ew-resize', className: 'bottom-3 right-0 top-3 w-2 cursor-ew-resize' },
    { edge: 'w', cursor: 'ew-resize', className: 'bottom-3 left-0 top-3 w-2 cursor-ew-resize' },
    { edge: 'ne', cursor: 'nesw-resize', className: 'right-0 top-0 h-4 w-4 cursor-nesw-resize' },
    { edge: 'nw', cursor: 'nwse-resize', className: 'left-0 top-0 h-4 w-4 cursor-nwse-resize' },
    { edge: 'se', cursor: 'nwse-resize', className: 'bottom-0 right-0 h-4 w-4 cursor-nwse-resize' },
    { edge: 'sw', cursor: 'nesw-resize', className: 'bottom-0 left-0 h-4 w-4 cursor-nesw-resize' },
  ]

  return (
    <div
      className="relative min-h-screen overflow-hidden p-6"
      style={{
        backgroundImage: 'linear-gradient(145deg, rgba(3,10,28,0.5), rgba(7,18,40,0.26)), url("/photo-1508739773434-c26b3d09e071.avif")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 flex flex-col overflow-hidden rounded-none shadow-2xl transition-[background,backdrop-filter] duration-150"
        style={{
          width: frame.width,
          height: frame.height,
          transform: `translate(calc(-50% + ${frame.x}px), calc(-50% + ${frame.y}px))`,
          background: windowBg,
          backdropFilter: `blur(${Math.round(transparency / 10)}px)`,
        }}
      >
        <div
          className="flex h-10 flex-shrink-0 cursor-grab items-center px-4 active:cursor-grabbing"
          style={{ background: blendBar ? windowBg : `rgba(0,0,0,${0.15 * bgAlpha + 0.05})` }}
          onPointerDown={startDrag}
        >
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          </div>
        </div>
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {children}
        </div>
        {resizeHandles.map((handle) => (
          <div
            key={handle.edge}
            aria-hidden="true"
            className={cn('absolute z-20', handle.className)}
            onPointerDown={startResize(handle.edge, handle.cursor)}
          />
        ))}
      </div>
    </div>
  )
}

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cn('relative flex h-6 w-10 flex-shrink-0 items-center rounded-full px-0.5 transition-colors duration-200', on ? 'bg-green-500' : 'bg-white/20')}>
      <div className={cn('h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  )
}
