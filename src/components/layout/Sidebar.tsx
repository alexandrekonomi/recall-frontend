import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, Settings, ChevronLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo-side.svg';
import { UserPlus } from 'lucide-react'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isMedico = usuario?.perfil === 'MEDICO'

  const menuSecretaria = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Pacientes', icon: Users, path: '/pacientes' },
    { label: 'Cadastro rápido', icon: UserPlus, path: '/cadastro-lote' },
  ]

  const menuMedico = [
    { label: 'Painel de gestão', icon: LayoutDashboard, path: '/painel' },
    { label: 'Pacientes', icon: Users, path: '/pacientes' },
    { label: 'Procedimentos', icon: ClipboardList, path: '/procedimentos' },
    { label: 'Configurações', icon: Settings, path: '/configuracoes' },
  ]

  const menu = isMedico ? menuMedico : menuSecretaria
  const iniciais = usuario?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') || 'U'
  const cargo = isMedico ? 'Médica' : 'Secretária'

  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0 transition-all duration-200"
      style={{
        width: collapsed ? 64 : 176,
        backgroundColor: '#2D3748',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Logo – apenas imagem, sem texto "Recall" */}
      <div className="flex items-center gap-3 px-4 py-5">
        <img
          src={logo}
          alt="Logo da clínica"
          className="flex-shrink-0"
          style={{ height: 100, width: 'auto' }}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 flex flex-col gap-0.5">
        {menu.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all duration-150"
              style={{
                backgroundColor: active ? '#14B7C1' : 'transparent',
                color: active ? '#FFFFFF' : '#9CA3AF',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = '#FFFFFF'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Recolher */}
      <div className="px-2 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg transition-all"
          style={{ color: '#6B7280' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
        >
          <ChevronLeft
            size={16}
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
          {!collapsed && (
            <span className="text-[12px]">Recolher menu</span>
          )}
        </button>
      </div>

      {/* Usuário */}
      <div
        className="px-3 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <button
          onClick={sair}
          className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#14B7C1' }}
          >
            <span className="text-white text-xs font-semibold">{iniciais}</span>
          </div>
          {!collapsed && (
            <div className="text-left">
              <p
                className="text-[12px] font-medium truncate max-w-[100px]"
                style={{ color: '#FFFFFF' }}
              >
                {usuario?.nome}
              </p>
              <p className="text-[11px]" style={{ color: '#6B7280' }}>{cargo}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}