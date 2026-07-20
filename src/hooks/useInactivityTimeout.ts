import { useEffect, useRef } from 'react'

const TEMPO_INATIVIDADE_MS = 15 * 60 * 1000

export function useInactivityTimeout(onTimeout: () => void, ativo: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!ativo) return

    const resetarTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(onTimeout, TEMPO_INATIVIDADE_MS)
    }

    const eventos = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

    eventos.forEach(evento => window.addEventListener(evento, resetarTimer))
    resetarTimer()

    return () => {
      eventos.forEach(evento => window.removeEventListener(evento, resetarTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onTimeout, ativo])
}