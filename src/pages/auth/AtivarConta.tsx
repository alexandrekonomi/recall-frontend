import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { buscarConvite, ativarConta } from '../../api/auth'

export function AtivarConta() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [carregando, setCarregando] = useState(true)
  const [convite, setConvite] = useState<{ nome: string; perfil: string; nomeClinica: string; valido: boolean } | null>(null)
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (!token) {
      setCarregando(false)
      return
    }
    carregarConvite()
  }, [token])

  const carregarConvite = async () => {
    try {
      const data = await buscarConvite(token)
      setConvite(data)
    } catch {
      setConvite({ nome: '', perfil: '', nomeClinica: '', valido: false })
    } finally {
      setCarregando(false)
    }
  }

  const forcaSenha = (s: string) => {
    let forca = 0
    if (s.length >= 8) forca++
    if (/[A-Z]/.test(s)) forca++
    if (/[0-9]/.test(s)) forca++
    if (/[^A-Za-z0-9]/.test(s)) forca++
    return forca
  }

  const forca = forcaSenha(senha)
  const labelForca = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Senha forte'][forca]
  const corForca = ['#EF4444', '#F59E0B', '#F59E0B', '#22C55E', '#22C55E'][forca]

  const handleAtivar = async () => {
    setErro('')
    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }
    setLoading(true)
    try {
      await ativarConta(token, senha)
      setSucesso(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao ativar conta. O link pode ter expirado.')
    } finally {
      setLoading(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7F9' }}>
        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
      </div>
    )
  }

  if (!convite?.valido) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7F9' }}>
        <div
          className="w-full max-w-[400px] rounded-2xl p-10 text-center"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h1 className="text-[18px] font-bold mb-2" style={{ color: '#4F525A' }}>
            Convite inválido ou expirado
          </h1>
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Peça um novo convite ao administrador da clínica.
          </p>
        </div>
      </div>
    )
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F7F9' }}>
        <div
          className="w-full max-w-[400px] rounded-2xl p-10 text-center"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <CheckCircle size={40} style={{ color: '#22C55E' }} className="mx-auto mb-3" />
          <h1 className="text-[18px] font-bold mb-2" style={{ color: '#4F525A' }}>
            Conta ativada!
          </h1>
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Redirecionando para o login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F5F7F9', fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl p-10"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
      >
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#14B7C1' }}
          >
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-[22px] font-bold text-center" style={{ color: '#4F525A' }}>
            Bem-vindo(a) ao Recall
          </h1>
          <p className="text-[13px] mt-2 text-center leading-relaxed" style={{ color: '#9CA3AF' }}>
            Você foi convidado(a) por <strong style={{ color: '#4F525A' }}>{convite.nomeClinica}</strong> para acessar o sistema como <strong style={{ color: '#4F525A' }}>{convite.perfil === 'MEDICO' ? 'Médico' : 'Secretária'}</strong>. Crie sua senha para ativar a conta.
          </p>
        </div>

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
            <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>Criar senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-[14px] outline-none pr-11"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#9CA3AF' }}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {senha && (
              <>
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{ backgroundColor: i < forca ? corForca : '#E3E6EA' }}
                    />
                  ))}
                </div>
                <span className="text-[12px] font-medium" style={{ color: corForca }}>
                  {labelForca}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>Confirmar senha</label>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={confirmarSenha}
              onChange={e => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          <Button onClick={handleAtivar} loading={loading} size="lg" className="w-full mt-1">
            Ativar conta
          </Button>
        </div>
      </div>
    </div>
  )
}