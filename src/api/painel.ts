import api from './client'

export interface ContatosPorSemana {
  semana: string
  total: number
}

export interface DistribuicaoResultado {
  status: string
  total: number
}

export interface ProcedimentoAbandono {
  procedimentoNome: string
  totalRecusou: number
  totalContatos: number
  taxaAbandono: number
}

export interface PainelGestao {
  pacientesAtivos: number
  pacientesInativos: number
  taxaRetornoMes: number
  totalContatosMes: number
  receitaPotencial: number
  agendamentosPendentes: number
  taxaComparecimentoMes: number
  contatosPorSemana: ContatosPorSemana[]
  distribuicaoResultados: DistribuicaoResultado[]
  procedimentosComMaiorAbandono: ProcedimentoAbandono[]
}

export const buscarPainelGestao = async (): Promise<PainelGestao> => {
  const { data } = await api.get('/painel-gestao')
  return data
}