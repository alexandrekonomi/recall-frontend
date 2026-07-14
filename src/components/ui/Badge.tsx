import type { ResultadoContato, TagPaciente } from '../../types'

interface BadgeStatusProps {
  status: ResultadoContato
}

interface BadgeTagProps {
  tag: TagPaciente
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  const config = {
    AGENDOU: { label: 'Agendou', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    RECUSOU: { label: 'Recusou', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
    SEM_RESPOSTA: { label: 'Sem resposta', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    PENDENTE: { label: 'Pendente', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
    ENVIADO: { label: 'Enviado', color: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' },
  }

  const { label, color, dot } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

export function BadgeTag({ tag }: BadgeTagProps) {
  const config = {
    VIP: 'bg-yellow-100 text-yellow-700',
    CONVENIO: 'bg-blue-100 text-blue-700',
    PLANO: 'bg-purple-100 text-purple-700',
    FREQUENTE: 'bg-green-100 text-green-700',
  }

  const labels = {
    VIP: 'VIP',
    CONVENIO: 'Convênio',
    PLANO: 'Plano',
    FREQUENTE: 'Frequente',
  }

  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${config[tag]}`}>
      {labels[tag]}
    </span>
  )
}