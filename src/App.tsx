import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { Login } from './pages/auth/Login'
import { Dashboard } from './pages/secretaria/Dashboard'
import { Pacientes } from './pages/secretaria/Pacientes'
import { PerfilPaciente } from './pages/secretaria/PerfilPaciente'
import { Procedimentos } from './pages/medico/Procedimentos'
import { PainelGestaoPage } from './pages/medico/PainelGestao'
import { Configuracoes } from './pages/medico/Configuracoes'
import { AtivarConta } from './pages/auth/AtivarConta'
import { CadastroLote } from './pages/secretaria/CadastroLote'


function RotasProtegidas() {
  const { isAutenticado } = useAuth()
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
        <Route path="painel" element={<PainelGestaoPage />} />
        <Route path="painel" element={<div className="text-xl font-bold text-[#4F525A]">Painel Médico — em construção</div>} />
        <Route path="procedimentos" element={<Procedimentos />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="cadastro-lote" element={<CadastroLote />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App