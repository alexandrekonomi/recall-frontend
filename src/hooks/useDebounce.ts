import { useState, useEffect } from 'react'

export function useDebounce<T>(valor: T, delayMs: number = 300): T {
  const [valorComDelay, setValorComDelay] = useState(valor)

  useEffect(() => {
    const timer = setTimeout(() => {
      setValorComDelay(valor)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [valor, delayMs])

  return valorComDelay
}