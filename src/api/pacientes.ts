import api from './client'
import type { Paciente, TagPaciente, PerfilPaciente } from '../types'

export const listarPacientes = async (): Promise<Paciente[]> => {
  const { data } = await api.get('/pacientes')
  return data
}

export const buscarPaciente = async (id: number): Promise<Paciente> => {
  const { data } = await api.get(`/pacientes/${id}`)
  return data
}

export const buscarPerfilPaciente = async (id: number): Promise<PerfilPaciente> => {
  const { data } = await api.get(`/pacientes/${id}/perfil`)
  return data
}

export const criarPaciente = async (paciente: {
  nome: string
  telefone: string
  dataNascimento?: string
  tags: TagPaciente[]
}): Promise<Paciente> => {
  const { data } = await api.post('/pacientes', paciente)
  return data
}

export const buscarPacientes = async (termo: string): Promise<Paciente[]> => {
  if (!termo.trim()) return []
  const { data } = await api.get('/pacientes/buscar', { params: { termo } })
  return data
}

