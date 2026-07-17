import { useState, useEffect } from 'react'
import { CalendarClock, Phone } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { listarAguardandoDados, completarAgendamento } from '../../api/agendamentos'
import { listarProcedimentos } from '../../api/procedimentos'
import type { AgendamentoItem } from '../../api/agendamentos'
import type { Procedimento } from '../../types'
import { useToast } from '../../context/ToastContext'

export function AgendamentosConfirmar() {
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([])
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [loading, setLoading] = useState(true)
  const [edicoes, setEdicoes] = useState<Record<number, { procedimentoId: string; data: string }>>({})
  const [salvandoId, setSalvandoId] = useState<number | null>(null)
  const { mostrarToast } = useToast()

  useEffect(() => {
    carregar()
    listarProcedimentos().then(setProcedimentos).catch(console.error)
  }, [])

  const carregar = async () => {
    try {
      const data = await listarAguardandoDados()
      setAgendamentos(data)
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const atualizarCampo = (id: number, campo: 'procedimentoId' | 'data', valor: string) => {
    setEdicoes(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
        [campo === 'procedimentoId' ? 'data' : 'procedimentoId']:
          prev[id]?.[campo === 'procedimentoId' ? 'data' : 'procedimentoId'] || ''
      }
    }))
  }

  const confirmarAgendamento = async (id: number) => {
  const edicao = edicoes[id]
  if (!edicao?.procedimentoId || !edicao?.data) return

  setSalvandoId(id)
  try {
    await completarAgendamento(id, {
      procedimentoId: Number(edicao.procedimentoId),
      dataAgendada: edicao.data,
    })
    setAgendamentos(prev => prev.filter(a => a.id !== id))
    mostrarToast('success', 'Agendamento confirmado', 'Os dados foram salvos com sucesso')
  } catch (err) {
    console.error('Erro ao completar agendamento:', err)
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

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHeader
        icon={<CalendarClock size={20} />}
        title="Agendamentos a confirmar"
        subtitle="Pacientes que confirmaram interesse mas ainda faltam detalhes"
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
            <CalendarClock size={28} style={{ color: '#14B7C1' }} />
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#4F525A' }}>
            Nenhum agendamento pendente
          </h3>
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Todos os pacientes que confirmaram interesse já têm procedimento e data definidos.
          </p>
        </div>
      )}

      {!loading && agendamentos.length > 0 && (
        <div className="flex flex-col gap-3">
          {agendamentos.map(a => {
            const edicao = edicoes[a.id] || { procedimentoId: '', data: '' }
            const podeConfirmar = edicao.procedimentoId && edicao.data

            return (
              <div
                key={a.id}
                className="rounded-xl p-5"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F5F7F9', border: '1px solid #E3E6EA' }}
                  >
                    <span className="text-[12px] font-semibold" style={{ color: '#4F525A' }}>
                      {getIniciais(a.pacienteNome)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
                      {a.pacienteNome}
                    </p>
                    <a
                      href={`tel:${a.pacienteTelefone}`}
                      className="text-[13px] font-medium flex items-center gap-1"
                      style={{ color: '#14B7C1' }}
                    >
                      <Phone size={12} />
                      {a.pacienteTelefone}
                    </a>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label
                      className="text-[12px] font-medium block mb-1"
                      style={{ color: '#9CA3AF' }}
                    >
                      Procedimento
                    </label>
                    <select
                      value={edicao.procedimentoId}
                      onChange={e => atualizarCampo(a.id, 'procedimentoId', e.target.value)}
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
                  <div className="flex-1">
                    <label
                      className="text-[12px] font-medium block mb-1"
                      style={{ color: '#9CA3AF' }}
                    >
                      Data agendada
                    </label>
                    <input
                      type="date"
                      value={edicao.data}
                      onChange={e => atualizarCampo(a.id, 'data', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={!podeConfirmar}
                    loading={salvandoId === a.id}
                    onClick={() => confirmarAgendamento(a.id)}
                  >
                    Confirmar
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