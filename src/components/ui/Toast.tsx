import { useEffect } from 'react'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion } from 'motion/react'

interface ToastProps {
  type: 'success' | 'error'
  title: string
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ type, title, message, onClose, duration = 4000 }: ToastProps) {
  const isSuccess = type === 'success'
  const cor = isSuccess ? '#14B7C1' : '#EF4444'
  const corFundo = isSuccess ? '#E8F8F9' : '#FEF2F2'

  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <motion.div
      initial={{ y: 40, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 40, opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      className="pointer-events-auto"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          width: 360,
          maxWidth: 'calc(100vw - 48px)',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E3E6EA',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: cor }} />

        <button
          onClick={onClose}
          className="absolute right-2 top-3 p-1 rounded-md transition-colors"
          style={{ color: '#9CA3AF' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F7F9'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={16} />
        </button>

        <div className="relative p-4 flex gap-3 items-start">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ backgroundColor: corFundo, color: cor }}
          >
            {isSuccess ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <AlertCircle size={20} strokeWidth={2.5} />}
          </div>

          <div className="flex-1 pt-0.5 pr-4">
            <p className="text-[14px] font-semibold" style={{ color: '#4F525A' }}>
              {title}
            </p>
            <p className="text-[13px] mt-0.5" style={{ color: '#9CA3AF' }}>
              {message}
            </p>
          </div>
        </div>

        <motion.div
          className="h-1"
          style={{ backgroundColor: cor, opacity: 0.25, transformOrigin: 'left' }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
    </motion.div>
  )
}