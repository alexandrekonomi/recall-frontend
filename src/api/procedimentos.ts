import api from './client'
import type { Procedimento } from '../types'

export const listarProcedimentos = async (): Promise<Procedimento[]> => {
  const { data } = await api.get('/procedimentos')
  return data
}

export const criarProcedimento = async (p: {
  nome: string
  descricao: string
  intervaloRetornoDias: number
  templateMensagem?: string
  valor?: number
}): Promise<Procedimento> => {
  const { data } = await api.post('/procedimentos', p)
  return data
}

export const atualizarProcedimento = async (id: number, p: {
  nome: string
  descricao: string
  intervaloRetornoDias: number
  templateMensagem?: string
  valor?: number
}): Promise<Procedimento> => {
  const { data } = await api.put(`/procedimentos/${id}`, p)
  return data
}

export const desativarProcedimento = async (id: number): Promise<void> => {
  await api.delete(`/procedimentos/${id}`)
}

export interface ProcedimentoPacienteItem {
  id: number
  pacienteId: number
  pacienteNome: string
  procedimentoId: number
  procedimentoNome: string
  dataRealizacao: string
  dataProximoContato: string
  criadoEm: string
}

export const listarProcedimentosPorPaciente = async (pacienteId: number): Promise<ProcedimentoPacienteItem[]> => {
  const { data } = await api.get(`/procedimentos-paciente/paciente/${pacienteId}`)
  return data
}

export const toggleStatusProcedimento = async (id: number): Promise<Procedimento> => {
  const { data } = await api.put(`/procedimentos/desativar/${id}`)
  return data
}