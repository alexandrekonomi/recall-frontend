import { useEffect } from 'react'
import { Button } from './Button'

interface Props {
  titulo: string
  descricao: string
  labelConfirmar: string
  perigo?: boolean
  loading?: boolean
  onConfirmar: () => void
  onClose: () => void
}

export function ModalConfirmarAcao({
  titulo, descricao, labelConfirmar, perigo = false, loading = false, onConfirmar, onClose,
}: Props) {
  useEffect(() => {
    const aoPressionar = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    document.addEventListener('keydown', aoPressionar)
    return () => document.removeEventListener('keydown', aoPressionar)
  }, [onClose, loading])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={() => !loading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="rounded-2xl p-6 w-full max-w-[400px]"
        style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-bold mb-2" style={{ color: '#4F525A' }}>
          {titulo}
        </h3>
        <p className="text-[14px] mb-6" style={{ color: '#6B7280' }}>
          {descricao}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          {perigo ? (
            <button
              onClick={onConfirmar}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-[14px] font-semibold"
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Aguarde...' : labelConfirmar}
            </button>
          ) : (
            <Button onClick={onConfirmar} loading={loading}>
              {labelConfirmar}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}