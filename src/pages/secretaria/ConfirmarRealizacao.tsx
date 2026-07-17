import { useState, useEffect } from 'react'
import { CheckCircle2, Phone, Calendar } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { listarAguardandoRealizacao, confirmarRealizacao } from '../../api/agendamentos'
import { listarProcedimentos } from '../../api/procedimentos'
import { useToast } from '../../context/ToastContext'
import type { AgendamentoItem } from '../../api/agendamentos'
import type { Procedimento } from '../../types'

export function ConfirmarRealizacao() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([])
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [loading, setLoading] = useState(true)
  const [salvandoId, setSalvandoId] = useState<number | null>(null)
  const [selecoes, setSelecoes] = useState<Record<number, { procedimentoId: string; data: string }>>({})
  const { mostrarToast } = useToast()

  useEffect(() => {
    carregar()
    listarProcedimentos().then(setProcedimentos).catch(console.error)
  }, [])

  const carregar = async () => {
    try {
      const data = await listarAguardandoRealizacao()
      setAgendamentos(data)
    } catch (err) {
      console.error('Erro ao carregar:', err)
    } finally {
      setLoading(false)
    }
  }

  const atualizarSelecao = (id: number, campo: 'procedimentoId' | 'data', valor: string) => {
    setSelecoes(prev => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }))
  }

  const confirmar = async (item: AgendamentoItem) => {
    const selecao = selecoes[item.id] || { procedimentoId: '', data: '' }
    const precisaEscolherProcedimento = !item.procedimentoId

    if (precisaEscolherProcedimento && !selecao.procedimentoId) {
      mostrarToast('error', 'Falta o procedimento', 'Selecione qual procedimento foi realizado')
      return
    }

    setSalvandoId(item.id)
    try {
      await confirmarRealizacao(item.id, {
        procedimentoId: selecao.procedimentoId ? Number(selecao.procedimentoId) : undefined,
        dataRealizacao: selecao.data || undefined,
      })
      setAgendamentos(prev => prev.filter(a => a.id !== item.id))
      mostrarToast('success', 'Realização confirmada', `${item.pacienteNome} volta para o radar no próximo ciclo`)
    } catch (err) {
      console.error('Erro ao confirmar:', err)
      mostrarToast('error', 'Não foi possível confirmar', 'Tente novamente em instantes')
    } finally {
      setSalvandoId(null)
    }
  }

  const getIniciais = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const formatarData = (data?: string) => {
    if (!data) return null
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHeader
        icon={<CheckCircle2 size={20} />}
        title="Confirmar realização"
        subtitle="Marque quem realmente compareceu para manter as métricas corretas"
      />

      {loading && (
        <div className="text-center py-16">
          <span className="text-[14px]" style={{ color: '#9CA3AF' }}>
            Carregando...
          </span>
        </div>
      )}

      {!loading && agendamentos.length === 0 && (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F0FDFA' }}
          >
            <CheckCircle2 size={28} style={{ color: '#14B7C1' }} />
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#4F525A' }}>
            Nenhuma realização pendente
          </h3>
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Todos os agendamentos confirmados já foram registrados como realizados.
          </p>
        </div>
      )}

      {!loading && agendamentos.length > 0 && (
        <div className="flex flex-col gap-3">
          {agendamentos.map(item => {
            const precisaEscolherProcedimento = !item.procedimentoId
            const selecao = selecoes[item.id] || { procedimentoId: '', data: '' }

            return (
              <div
                key={item.id}
                className="rounded-xl p-5"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#F5F7F9', border: '1px solid #E3E6EA' }}
                    >
                      <span className="text-[12px] font-semibold" style={{ color: '#4F525A' }}>
                        {getIniciais(item.pacienteNome)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
                        {item.pacienteNome}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <a
                          href={`tel:${item.pacienteTelefone}`}
                          className="text-[13px] font-medium flex items-center gap-1"
                          style={{ color: '#14B7C1' }}
                        >
                          <Phone size={12} />
                          {item.pacienteTelefone}
                        </a>
                        {item.procedimentoNome && (
                          <span className="text-[13px]" style={{ color: '#9CA3AF' }}>
                            {item.procedimentoNome}
                          </span>
                        )}
                        {item.dataAgendada && (
                          <span className="text-[13px] flex items-center gap-1" style={{ color: '#9CA3AF' }}>
                            <Calendar size={12} />
                            {formatarData(item.dataAgendada)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {precisaEscolherProcedimento && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid #F5F7F9' }}>
                    <p className="text-[12px] font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                      Qual procedimento foi realizado?
                    </p>
                    <select
                      value={selecao.procedimentoId}
                      onChange={e => atualizarSelecao(item.id, 'procedimentoId', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                    >
                      <option value="">Selecione</option>
                      {procedimentos.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-end gap-3 mt-3">
                  <div className="flex-1">
                    <label className="text-[12px] font-medium block mb-1" style={{ color: '#9CA3AF' }}>
                      Data em que compareceu <span style={{ fontWeight: 400 }}>(opcional, padrão hoje)</span>
                    </label>
                    <input
                      type="date"
                      value={selecao.data}
                      onChange={e => atualizarSelecao(item.id, 'data', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                    />
                  </div>
                  <Button
                    size="sm"
                    loading={salvandoId === item.id}
                    onClick={() => confirmar(item)}
                  >
                    Marcar como realizado
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}