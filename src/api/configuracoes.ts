import api from './client'

export interface ConfiguracaoClinica {
  id: number
  nomeClinica: string
  telefoneContato?: string
  diasRecontatoSemResposta: number
}

export const buscarConfiguracao = async (): Promise<ConfiguracaoClinica> => {
  const { data } = await api.get('/configuracoes')
  return data
}

export const atualizarConfiguracao = async (payload: {
  nomeClinica: string
  telefoneContato?: string
  diasRecontatoSemResposta: number
}): Promise<ConfiguracaoClinica> => {
  const { data } = await api.put('/configuracoes', payload)
  return data
}