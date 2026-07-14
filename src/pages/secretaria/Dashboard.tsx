import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { listarDiaria, buscarMetricasHoje } from '../../api/contatos'
import { Button } from '../../components/ui/Button'
import { Bell, Copy, Calendar } from 'lucide-react'
import { ModalRegistrarResultado } from '../../components/ui/ModalRegistrarResultado'
import type { ListaDiariaItem } from '../../types'

export function Dashboard() {
  const { usuario } = useAuth()
  const [lista, setLista] = useState<ListaDiariaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<ListaDiariaItem | null>(null)

  const [metricas, setMetricas] = useState({
    pacientesAContactarHoje: 0,
    contactadosHoje: 0,
    agendamentosHoje: 0,
  })

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário'

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    carregarLista()
    carregarMetricas()
  }, [])

  const carregarLista = async () => {
    try {
      const data = await listarDiaria()
      setLista(data)
    } catch (err) {
      console.error('Erro ao carregar lista:', err)
    } finally {
      setLoading(false)
    }
  }

  const carregarMetricas = async () => {
    try {
      const data = await buscarMetricasHoje()
      setMetricas(data)
    } catch (err) {
      console.error('Erro ao carregar métricas:', err)
    }
  }

  const copiarMensagem = (mensagem: string) => {
    navigator.clipboard.writeText(mensagem)
  }

  const abrirModal = (item: ListaDiariaItem) => {
    setItemSelecionado(item)
    setModalAberto(true)
  }

  const onResultadoRegistrado = () => {
    setModalAberto(false)
    setItemSelecionado(null)
    carregarLista()
    carregarMetricas()
  }

  const calcularDiasAtraso = (dataProximoContato: string) => {
    const hoje = new Date()
    const data = new Date(dataProximoContato + 'T00:00:00')
    const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24))
    return diff
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
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: '#4F525A' }}>
            Olá, {primeiroNome}
          </h1>
          <p className="text-[14px] mt-0.5 capitalize" style={{ color: '#9CA3AF' }}>
            {hoje}
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-white transition-colors">
          <Bell size={20} style={{ color: '#9CA3AF' }} />
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[13px] font-medium" style={{ color: '#9CA3AF' }}>
            Pacientes a contactar hoje
          </p>
          <p className="text-[34px] font-bold mt-1" style={{ color: '#4F525A' }}>
            {metricas.pacientesAContactarHoje}
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[13px] font-medium" style={{ color: '#9CA3AF' }}>
            Contactados hoje
          </p>
          <p className="text-[34px] font-bold mt-1" style={{ color: '#4F525A' }}>
            {metricas.contactadosHoje}
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#E8F8F9', border: '1px solid #B2E8EB' }}
        >
          <p className="text-[13px] font-medium" style={{ color: '#14B7C1' }}>
            Agendamentos hoje
          </p>
          <p className="text-[34px] font-bold mt-1" style={{ color: '#14B7C1' }}>
            {metricas.agendamentosHoje}
          </p>
        </div>
      </div>

      {/* Lista diária */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-semibold" style={{ color: '#4F525A' }}>
          Lista diária · ordenada por urgência
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <span className="text-[14px]" style={{ color: '#9CA3AF' }}>
            Carregando...
          </span>
        </div>
      )}

      {/* Estado vazio */}
      {!loading && lista.length === 0 && (
        <div className="text-center py-16">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F0FDFA' }}
          >
            <Calendar size={28} style={{ color: '#14B7C1' }} />
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#4F525A' }}>
            Nenhum paciente para contactar hoje
          </h3>
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Você já revisou toda a fila de reativação de hoje. 🎉
          </p>
        </div>
      )}

      {/* Lista de pacientes */}
      {!loading && lista.length > 0 && (
        <div className="flex flex-col gap-3">
          {lista.map(item => {
            const diasAtraso = calcularDiasAtraso(item.dataProximoContato)

            return (
              <div
                key={item.procedimentoPacienteId}
                className="rounded-xl p-5"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: '#F5F7F9', border: '1px solid #E3E6EA' }}
                    >
                      <span className="text-[12px] font-semibold" style={{ color: '#4F525A' }}>
                        {getIniciais(item.pacienteNome)}
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
                          {item.pacienteNome}
                        </span>
                        {diasAtraso > 0 && (
                          <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
                          >
                            {diasAtraso} dias em atraso
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <a
                          href={`tel:${item.pacienteTelefone}`}
                          className="text-[13px] font-medium flex items-center gap-1"
                          style={{ color: '#14B7C1' }}
                        >
                          📞 {item.pacienteTelefone}
                        </a>
                        <span className="text-[13px]" style={{ color: '#9CA3AF' }}>
                          {item.procedimentoNome}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="flex-shrink-0">
                    <Button size="sm" onClick={() => abrirModal(item)}>
                      Registrar resultado
                    </Button>
                  </div>
                </div>

                {/* Mensagem sugerida */}
                {item.mensagemSugerida && (
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <p
                      className="text-[13px] leading-relaxed flex-1 pl-12"
                      style={{ color: '#6B7280' }}
                    >
                      {item.mensagemSugerida}
                    </p>
                    <button
                      onClick={() => copiarMensagem(item.mensagemSugerida)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium flex-shrink-0 transition-all"
                      style={{
                        border: '1px solid #E3E6EA',
                        color: '#4F525A',
                        backgroundColor: '#FFFFFF',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F7F9')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <Copy size={14} />
                      Copiar mensagem
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalAberto && itemSelecionado && (
        <ModalRegistrarResultado
          item={itemSelecionado}
          onClose={() => {
            setModalAberto(false)
            setItemSelecionado(null)
          }}
          onSucesso={onResultadoRegistrado}
        />
      )}
    </div>
  )
}