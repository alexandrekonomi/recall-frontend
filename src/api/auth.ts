import api from './client'
import type { LoginResponse } from '../types'

export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/login', { email, senha })
  return data
}

export const buscarConvite = async (token: string): Promise<{
  nome: string
  email: string
  perfil: string
  nomeClinica: string
  valido: boolean
}> => {
  const { data } = await api.get(`/auth/convite/${token}`)
  return data
}

export const ativarConta = async (token: string, senha: string): Promise<void> => {
  await api.post('/auth/ativar-conta', { token, senha })
}