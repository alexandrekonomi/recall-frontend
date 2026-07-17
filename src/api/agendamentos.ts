import api from './client'

export interface AgendamentoItem {
  id: number
  pacienteId: number
  pacienteNome: string
  pacienteTelefone: string
  procedimentoId?: number
  procedimentoNome?: string
  dataAgendada?: string
  status: 'AGUARDANDO_DADOS' | 'AGUARDANDO_REALIZACAO' | 'REALIZADO' | 'CANCELADO'
  criadoEm: string
}

export const listarAguardandoDados = async (): Promise<AgendamentoItem[]> => {
  const { data } = await api.get('/agendamentos/aguardando-dados')
  return data
}

export const completarAgendamento = async (id: number, payload: {
  procedimentoId: number
  dataAgendada: string
}): Promise<AgendamentoItem> => {
  const { data } = await api.patch(`/agendamentos/${id}/completar`, payload)
  return data
}

export const listarAguardandoRealizacao = async (): Promise<AgendamentoItem[]> => {
  const { data } = await api.get('/agendamentos/aguardando-realizacao')
  return data
}

export const confirmarRealizacao = async (id: number, payload: {
  procedimentoId?: number
  dataRealizacao?: string
}): Promise<AgendamentoItem> => {
  const { data } = await api.patch(`/agendamentos/${id}/confirmar-realizacao`, payload)
  return data
}