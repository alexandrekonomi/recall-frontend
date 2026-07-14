import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { LoginResponse } from '../types'

interface AuthContextType {
  usuario: LoginResponse | null
  token: string | null
  entrar: (data: LoginResponse) => void
  sair: () => void
  isAutenticado: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<LoginResponse | null>(() => { 
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  const entrar = (data: LoginResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data))
    setToken(data.token)
    setUsuario(data)
  }

  const sair = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      entrar,
      sair,
      isAutenticado: !!token
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)