import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../api/auth'
import logo from '../../assets/logo.svg';

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { entrar } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const data = await login(email, senha)
      entrar(data)
      navigate(data.perfil === 'MEDICO' ? '/painel' : '/dashboard')
    } catch {
      setErro('E-mail ou senha incorretos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F5F7F9', fontFamily: 'Inter, sans-serif' }}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl p-10"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E3E6EA',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo – apenas a imagem, sem texto "Recall" */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Logo da clínica"
            style={{ height: 200 }}  /* 48px + 30% = 62px */
          />
          <p
            className="text-[14px] mt-4"
            style={{ color: '#9CA3AF' }}
          >
            Entre com sua conta da clínica
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 mb-6"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
            }}
          >
            <AlertCircle size={16} color="#EF4444" className="flex-shrink-0" />
            <span className="text-[13px]" style={{ color: '#DC2626' }}>{erro}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[14px] font-medium"
              style={{ color: '#4F525A' }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-lg text-[14px] outline-none transition-all"
              style={{
                border: '1px solid #E3E6EA',
                color: '#4F525A',
                backgroundColor: '#FFFFFF',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#14B7C1'
                e.target.style.boxShadow = '0 0 0 3px rgba(20,183,193,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E3E6EA'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[14px] font-medium"
              style={{ color: '#4F525A' }}
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg text-[14px] outline-none transition-all pr-11"
                style={{
                  border: '1px solid #E3E6EA',
                  color: '#4F525A',
                  backgroundColor: '#FFFFFF',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#14B7C1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(20,183,193,0.15)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E3E6EA'
                  e.target.style.boxShadow = 'none'
                }}
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
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full mt-1"
          >
            Entrar
          </Button>
        </form>

        <p
          className="text-center text-[12px] mt-6 leading-relaxed"
          style={{ color: '#9CA3AF' }}
        >
          Acesso apenas por convite. Fale com o administrador da clínica caso precise de acesso.
        </p>
      </div>
    </div>
  )
}