import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { buscarPainelGestao } from '../../api/painel'
import type { PainelGestao } from '../../api/painel'
import { PageHeader } from '../../components/ui/PageHeader'
import { BarChart3 } from 'lucide-react'

const CORES_STATUS: Record<string, string> = {
  AGENDOU: '#22C55E',
  RECUSOU: '#EF4444',
  SEM_RESPOSTA: '#F59E0B',
  PENDENTE: '#9CA3AF',
  ENVIADO: '#3B82F6',
}

const LABELS_STATUS: Record<string, string> = {
  AGENDOU: 'Agendou',
  RECUSOU: 'Recusou',
  SEM_RESPOSTA: 'Sem resposta',
  PENDENTE: 'Pendente',
  ENVIADO: 'Enviado',
}

export function PainelGestaoPage() {
  const [painel, setPainel] = useState<PainelGestao | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarPainel()
  }, [])

  const carregarPainel = async () => {
    try {
      const data = await buscarPainelGestao()
      setPainel(data)
    } catch (err) {
      console.error('Erro ao carregar painel:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
      </div>
    )
  }

  if (!painel) return null

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHeader
        icon={<BarChart3 size={20} />}
        title="Painel de gestão"
        subtitle="Métricas e desempenho da clínica"
      />

      {/* Métricas principais */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            Pacientes ativos
          </p>
          <p className="text-[28px] font-bold mt-1" style={{ color: '#4F525A' }}>
            {painel.pacientesAtivos}
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            Inativos há 3+ meses
          </p>
          <p className="text-[28px] font-bold mt-1" style={{ color: '#DC2626' }}>
            {painel.pacientesInativos}
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            Taxa de retorno do mês
          </p>
          <p className="text-[28px] font-bold mt-1" style={{ color: '#22C55E' }}>
            {painel.taxaRetornoMes}%
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <p className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
            Contatos no mês
          </p>
          <p className="text-[28px] font-bold mt-1" style={{ color: '#4F525A' }}>
            {painel.totalContatosMes}
          </p>
        </div>
      </div>

      {/* Receita potencial em destaque */}
      <div
        className="rounded-xl p-6 mb-6 flex items-center justify-between"
        style={{ backgroundColor: '#E8F8F9', border: '1px solid #B2E8EB' }}
      >
        <div>
          <p className="text-[13px] font-medium" style={{ color: '#14B7C1' }}>
            Receita potencial dormindo na base
          </p>
          <p className="text-[13px] mt-0.5" style={{ color: '#0F98A1' }}>
            Valor estimado se todos os pacientes inativos retornarem
          </p>
        </div>
        <p className="text-[34px] font-bold" style={{ color: '#14B7C1' }}>
          {formatarMoeda(painel.receitaPotencial)}
        </p>
      </div>

      {/* Agendamentos e comparecimento */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <div>
            <p className="text-[13px] font-medium" style={{ color: '#9CA3AF' }}>
              Agendamentos pendentes de confirmação
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>
              Aguardando dados ou aguardando realização
            </p>
          </div>
          <p className="text-[28px] font-bold" style={{ color: painel.agendamentosPendentes > 0 ? '#F59E0B' : '#4F525A' }}>
            {painel.agendamentosPendentes}
          </p>
        </div>

        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <div>
            <p className="text-[13px] font-medium" style={{ color: '#9CA3AF' }}>
              Taxa de comparecimento do mês
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>
              Agendados que realmente compareceram
            </p>
          </div>
          <p className="text-[28px] font-bold" style={{ color: '#22C55E' }}>
            {painel.taxaComparecimentoMes}%
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Contatos por semana */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
            Contatos por semana
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={painel.contatosPorSemana}>
              <XAxis dataKey="semana" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#14B7C1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição de resultados */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
            Distribuição de resultados
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={painel.distribuicaoResultados}
                  dataKey="total"
                  nameKey="status"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {painel.distribuicaoResultados.map((entry) => (
                    <Cell key={entry.status} fill={CORES_STATUS[entry.status] || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {painel.distribuicaoResultados.map(item => (
                <div key={item.status} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CORES_STATUS[item.status] || '#9CA3AF' }}
                  />
                  <span className="text-[12px]" style={{ color: '#4F525A' }}>
                    {LABELS_STATUS[item.status] || item.status} ({item.total})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Procedimentos com maior abandono */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
      >
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
          Procedimentos com maior taxa de abandono
        </h3>

        {painel.procedimentosComMaiorAbandono.length === 0 && (
          <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
            Nenhum dado disponível ainda.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {painel.procedimentosComMaiorAbandono.map(p => (
            <div key={p.procedimentoNome} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                  {p.procedimentoNome}
                </p>
                <div
                  className="w-full h-1.5 rounded-full mt-1.5"
                  style={{ backgroundColor: '#F5F7F9' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.taxaAbandono}%`,
                      backgroundColor: p.taxaAbandono > 30 ? '#EF4444' : '#F59E0B',
                    }}
                  />
                </div>
              </div>
              <span className="text-[13px] font-semibold ml-4" style={{ color: '#4F525A' }}>
                {p.taxaAbandono}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}