import { useCallback, useEffect, useState } from 'react'

export type CameraStreamStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unsupported'

export function useCameraStream() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStreamStatus>('idle')

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const request = useCallback(async (constraints: MediaStreamConstraints) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return null
    }
    setStatus('pending')
    try {
      const next = await navigator.mediaDevices.getUserMedia(constraints)
      setStream((prev) => {
        prev?.getTracks().forEach((track) => track.stop())
        return next
      })
      setStatus('granted')
      return next
    } catch {
      setStatus('denied')
      return null
    }
  }, [])

  const stop = useCallback(() => {
    setStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop())
      return null
    })
    setStatus('idle')
  }, [])

  return { stream, status, request, stop }
}
