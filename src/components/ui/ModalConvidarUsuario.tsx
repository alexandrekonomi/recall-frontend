import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { Button } from './Button'
import { convidarUsuario } from '../../api/usuarios'

interface Props {
  onClose: () => void
  onSucesso: () => void
}

export function ModalConvidarUsuario({ onClose, onSucesso }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [perfil, setPerfil] = useState<'SECRETARIA' | 'MEDICO'>('SECRETARIA')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleEnviar = async () => {
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e e-mail')
      return
    }
    setErro('')
    setLoading(true)
    try {
      await convidarUsuario({ nome, email, perfil })
      setEnviado(true)
      onSucesso()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao enviar convite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-[420px] relative"
        style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: '#9CA3AF' }}>
          <X size={20} />
        </button>

        <h3 className="text-[18px] font-bold mb-5" style={{ color: '#4F525A' }}>
          Convidar usuário
        </h3>

        {erro && (
          <div
            className="rounded-lg px-4 py-3 mb-4 text-[13px]"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            {erro}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>Nome</label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Nome completo"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nome@clinica.com"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>Perfil</label>
            <div className="grid grid-cols-2 gap-2">
              {(['SECRETARIA', 'MEDICO'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPerfil(p)}
                  className="px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all"
                  style={{
                    backgroundColor: perfil === p ? '#E8F8F9' : '#FFFFFF',
                    border: perfil === p ? '2px solid #14B7C1' : '1px solid #E3E6EA',
                    color: perfil === p ? '#14B7C1' : '#4F525A',
                  }}
                >
                  {p === 'SECRETARIA' ? 'Secretária' : 'Médico'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {enviado ? (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 mt-5"
            style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
          >
            <CheckCircle size={16} />
            <span className="text-[13px]">
              Convite enviado! {nome.split(' ')[0]} vai receber um e-mail com o link de ativação.
            </span>
          </div>
        ) : (
          <Button onClick={handleEnviar} loading={loading} className="w-full mt-5">
            Enviar convite
          </Button>
        )}
      </div>
    </div>
  )
}