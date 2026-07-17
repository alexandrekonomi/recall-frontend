import api from './client'

export interface ProcedimentoPacienteResponse {
  id: number
  pacienteId: number
  pacienteNome: string
  procedimentoId: number
  procedimentoNome: string
  dataRealizacao: string
  dataProximoContato: string
  criadoEm: string
}

export const criarVinculoProcedimento = async (payload: {
  pacienteId: number
  procedimentoId: number
  dataRealizacao: string
}): Promise<ProcedimentoPacienteResponse> => {
  const { data } = await api.post('/procedimentos-paciente', payload)
  return data
}