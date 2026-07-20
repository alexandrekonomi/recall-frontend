import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Toast } from '../components/ui/Toast'

type ToastType = 'success' | 'error'

interface ToastData {
  id: number
  type: ToastType
  title: string
  message: string
}

interface ToastContextType {
  mostrarToast: (type: ToastType, title: string, message: string) => void
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const mostrarToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, title, message }])
  }, [])

  const removerToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => removerToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)