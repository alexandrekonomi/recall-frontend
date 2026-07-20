import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { AppLayout } from './components/layout/AppLayout'
import { Login } from './pages/auth/Login'
import { AtivarConta } from './pages/auth/AtivarConta'
import { Dashboard } from './pages/secretaria/Dashboard'
import { Pacientes } from './pages/secretaria/Pacientes'
import { PerfilPaciente } from './pages/secretaria/PerfilPaciente'
import { CadastroLote } from './pages/secretaria/CadastroLote'
import { AgendamentosConfirmar } from './pages/secretaria/AgendamentosConfirmar'
import { ConfirmarRealizacao } from './pages/secretaria/ConfirmarRealizacao'
import { PainelGestaoPage } from './pages/medico/PainelGestao'
import { Procedimentos } from './pages/medico/Procedimentos'
import { Configuracoes } from './pages/medico/Configuracoes'
import { useInactivityTimeout } from './hooks/useInactivityTimeout'

function RotasProtegidas() {
  const { isAutenticado, sair } = useAuth()

 useInactivityTimeout(() => {
  sair()
  window.location.href = '/login?motivo=inatividade'
}, isAutenticado)

  if (!isAutenticado) return <Navigate to="/login" replace />
  return <AppLayout />

}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/ativar-conta" element={<AtivarConta />} />
      <Route path="/" element={<RotasProtegidas />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pacientes" element={<Pacientes />} />
        <Route path="pacientes/:id" element={<PerfilPaciente />} />
        <Route path="cadastro-lote" element={<CadastroLote />} />
        <Route path="agendamentos-confirmar" element={<AgendamentosConfirmar />} />
        <Route path="confirmar-realizacao" element={<ConfirmarRealizacao />} />
        <Route path="painel" element={<PainelGestaoPage />} />
        <Route path="procedimentos" element={<Procedimentos />} />
        <Route path="configuracoes" element={<Configuracoes />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App