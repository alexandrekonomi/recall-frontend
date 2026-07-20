import { useState, useEffect } from 'react'
import { Calendar, XCircle, Clock, X } from 'lucide-react'
import { Button } from './Button'
import { registrarContato } from '../../api/contatos'
import { listarProcedimentos } from '../../api/procedimentos'
import type { ListaDiariaItem, ResultadoContato, Procedimento } from '../../types'

interface Props {
  item: ListaDiariaItem
  onClose: () => void
  onSucesso: (procedimentoPacienteId: number) => void
}

export function ModalRegistrarResultado({ item, onClose, onSucesso }: Props) {
  const [status, setStatus] = useState<ResultadoContato | null>(null)
  const [observacao, setObservacao] = useState('')
  const [loading, setLoading] = useState(false)
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [procedimentoAgendadoId, setProcedimentoAgendadoId] = useState('')
  const [dataAgendada, setDataAgendada] = useState('')

  useEffect(() => {
    listarProcedimentos().then(setProcedimentos).catch(console.error)
  }, [])

  const diasAtraso = Math.floor(
    (new Date().getTime() - new Date(item.dataProximoContato + 'T00:00:00').getTime()) /
    (1000 * 60 * 60 * 24)
  )

  const opcoes: { valor: ResultadoContato; label: string; icon: typeof Calendar; cor: string; bgAtivo: string; borderAtivo: string }[] = [
    {
      valor: 'AGENDOU',
      label: 'Agendou',
      icon: Calendar,
      cor: '#22C55E',
      bgAtivo: '#F0FDF4',
      borderAtivo: '#22C55E',
    },
    {
      valor: 'RECUSOU',
      label: 'Recusou',
      icon: XCircle,
      cor: '#EF4444',
      bgAtivo: '#FEF2F2',
      borderAtivo: '#EF4444',
    },
    {
      valor: 'SEM_RESPOSTA',
      label: 'Sem resposta',
      icon: Clock,
      cor: '#F59E0B',
      bgAtivo: '#FFFBEB',
      borderAtivo: '#F59E0B',
    },
  ]

  const handleConfirmar = async () => {
    if (!status) return
    setLoading(true)
    try {
      await registrarContato({
        procedimentoPacienteId: item.procedimentoPacienteId,
        status,
        observacao: observacao || undefined,
        procedimentoAgendadoId: status === 'AGENDOU' && procedimentoAgendadoId
          ? Number(procedimentoAgendadoId)
          : undefined,
        dataAgendada: status === 'AGENDOU' && dataAgendada ? dataAgendada : undefined,
      })
      onSucesso(item.procedimentoPacienteId)
    } catch (err) {
      console.error('Erro ao registrar:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-w-[420px] relative"
        style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: '#9CA3AF' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h3 className="text-[18px] font-bold" style={{ color: '#4F525A' }}>
          {item.pacienteNome}
        </h3>
        <p className="text-[13px] mt-0.5" style={{ color: '#14B7C1' }}>
          {item.procedimentoNome} · {diasAtraso > 0 ? `${diasAtraso} dias em atraso` : 'hoje'}
        </p>

        {/* Opções */}
        <p className="text-[14px] font-medium mt-5 mb-3" style={{ color: '#4F525A' }}>
          Qual foi o resultado do contato?
        </p>
        <div className="grid grid-cols-3 gap-3">
          {opcoes.map(op => {
            const selecionado = status === op.valor
            return (
              <button
                key={op.valor}
                onClick={() => setStatus(op.valor)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer"
                style={{
                  border: selecionado ? `2px solid ${op.borderAtivo}` : '1px solid #E3E6EA',
                  backgroundColor: selecionado ? op.bgAtivo : '#FFFFFF',
                }}
              >
                <op.icon size={22} style={{ color: op.cor }} />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: selecionado ? op.cor : '#4F525A' }}
                >
                  {op.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Detalhes do agendamento (só aparece se marcou Agendou) */}
        {status === 'AGENDOU' && (
          <div className="mt-5 pt-5" style={{ borderTop: '1px solid #F5F7F9' }}>
            <p className="text-[13px] font-medium mb-1" style={{ color: '#4F525A' }}>
              Detalhes do agendamento <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span>
            </p>
            <p className="text-[11px] mb-3" style={{ color: '#9CA3AF' }}>
              Se já souber o procedimento e a data, preencha agora e economize um passo depois
            </p>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={procedimentoAgendadoId}
                onChange={e => setProcedimentoAgendadoId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              >
                <option value="">Procedimento</option>
                {procedimentos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              <input
                type="date"
                value={dataAgendada}
                onChange={e => setDataAgendada(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              />
            </div>
          </div>
        )}

        {/* Observação */}
        <div className="mt-5">
          <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
            Observação <span style={{ color: '#9CA3AF' }}>(opcional)</span>
          </label>
          <textarea
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
            placeholder="Ex: vai retornar após as férias em agosto"
            rows={3}
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none transition-all"
            style={{
              border: '1px solid #E3E6EA',
              color: '#4F525A',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#14B7C1'
              e.target.style.boxShadow = '0 0 0 3px rgba(20,183,193,0.15)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E3E6EA'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            loading={loading}
            disabled={!status}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}