export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: 'MEDICO' | 'SECRETARIA'
}

export interface LoginResponse {
  token: string
  perfil: 'MEDICO' | 'SECRETARIA'
  nome: string
}

export interface Paciente {
  id: number
  nome: string
  telefone: string
  dataNascimento?: string
  tags: TagPaciente[]
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export type TagPaciente = 'VIP' | 'CONVENIO' | 'PLANO' | 'FREQUENTE'

export interface Procedimento {
  id: number
  nome: string
  descricao: string
  intervaloRetornoDias: number
  templateMensagem?: string
  valor?: number
  ativo: boolean
}

export interface ListaDiariaItem {
  procedimentoPacienteId: number
  pacienteId: number
  pacienteNome: string
  pacienteTelefone: string
  procedimentoNome: string
  dataProximoContato: string
  mensagemSugerida: string
}

export interface Contato {
  id: number
  pacienteId: number
  pacienteNome: string
  pacienteTelefone: string
  procedimentoPacienteId: number
  procedimentoNome: string
  mensagemSugerida: string
  status: ResultadoContato
  observacao?: string
  realizadoEm: string
  proximoContatoEm?: string
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

export interface PerfilPaciente {
  paciente: Paciente;
  contatos: Contato[];
  procedimentos: ProcedimentoPacienteItem[];
}

export type ResultadoContato = 'PENDENTE' | 'ENVIADO' | 'AGENDOU' | 'RECUSOU' | 'SEM_RESPOSTA'