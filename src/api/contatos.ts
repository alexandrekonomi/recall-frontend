import api from './client'
import type { ListaDiariaItem, Contato, ResultadoContato } from '../types'

export const listarDiaria = async (): Promise<ListaDiariaItem[]> => {
  const { data } = await api.get('/contatos/lista-diaria')
  return data
}

export const registrarContato = async (payload: {
  procedimentoPacienteId: number
  status: ResultadoContato
  observacao?: string
}): Promise<Contato> => {
  const { data } = await api.post('/contatos/registrar', payload)
  return data
}

export const listarContatosPorPaciente = async (pacienteId: number): Promise<Contato[]> => {
  const { data } = await api.get(`/contatos/paciente/${pacienteId}`)
  return data
}


export const buscarMetricasHoje = async (): Promise<{
  pacientesAContactarHoje: number
  contactadosHoje: number
  agendamentosHoje: number
}> => {
  const { data } = await api.get('/contatos/metricas-hoje')
  return data
}