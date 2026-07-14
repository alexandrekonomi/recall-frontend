import api from './client'

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: 'MEDICO' | 'SECRETARIA'
  ativo: boolean
  contaAtivada: boolean
}

export const listarUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await api.get('/usuarios')
  return data
}

export const convidarUsuario = async (payload: {
  nome: string
  email: string
  perfil: 'MEDICO' | 'SECRETARIA'
}): Promise<Usuario> => {
  const { data } = await api.post('/usuarios/convidar', payload)
  return data
}

export const desativarUsuario = async (id: number): Promise<void> => {
  await api.patch(`/usuarios/${id}/desativar`)
}

export const reativarUsuario = async (id: number): Promise<void> => {
  await api.patch(`/usuarios/${id}/reativar`)
}