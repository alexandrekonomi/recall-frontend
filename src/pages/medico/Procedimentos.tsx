import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { listarProcedimentos, toggleStatusProcedimento } from '../../api/procedimentos'
import { DrawerProcedimento } from '../../components/ui/DrawerProcedimento'
import type { Procedimento } from '../../types'

export function Procedimentos() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState<Procedimento | null>(null)

  useEffect(() => {
    carregarProcedimentos()
  }, [])

  const carregarProcedimentos = async () => {
    try {
      const data = await listarProcedimentos()
      setProcedimentos(data)
    } catch (err) {
      console.error('Erro ao carregar procedimentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const abrirNovo = () => {
    setProcedimentoSelecionado(null)
    setDrawerAberto(true)
  }

  const abrirEdicao = (p: Procedimento) => {
    setProcedimentoSelecionado(p)
    setDrawerAberto(true)
  }

  const onSalvo = () => {
    setDrawerAberto(false)
    setProcedimentoSelecionado(null)
    carregarProcedimentos()
  }

  const toggleAtivo = async (p: Procedimento, e: React.MouseEvent) => {
    e.stopPropagation()

    // Atualização otimista: muda o estado local imediatamente
    setProcedimentos(prev =>
      prev.map(proc =>
        proc.id === p.id ? { ...proc, ativo: !proc.ativo } : proc
      )
    )

    try {
      // Chama o endpoint específico para alternar o status
      await toggleStatusProcedimento(p.id)
      // Se quiser garantir o estado exato vindo do servidor, recarregue a lista:
      // carregarProcedimentos()
    } catch (err) {
      // Reverte a alteração otimista em caso de erro
      setProcedimentos(prev =>
        prev.map(proc =>
          proc.id === p.id ? { ...proc, ativo: p.ativo } : proc
        )
      )
      console.error('Erro ao alternar status:', err)
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold" style={{ color: '#4F525A' }}>
          Procedimentos
        </h1>
        <Button onClick={abrirNovo}>
          <Plus size={16} />
          Adicionar procedimento
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
        </div>
      )}

      {/* Grid de procedimentos */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {procedimentos.map(p => (
            <div
              key={p.id}
              onClick={() => abrirEdicao(p)}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E3E6EA',
                opacity: p.ativo ? 1 : 0.6,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
                  {p.nome}
                </h3>
                {/* Toggle (visível para todos; permissão validada no backend) */}
                <button
                  onClick={(e) => toggleAtivo(p, e)}
                  className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                  style={{ backgroundColor: p.ativo ? '#14B7C1' : '#E3E6EA' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: p.ativo ? '18px' : '2px' }}
                  />
                </button>
              </div>

              <p className="text-[12px] mb-3" style={{ color: '#9CA3AF' }}>
                Retorno a cada <strong style={{ color: '#4F525A' }}>{p.intervaloRetornoDias} dias</strong>
                {!p.ativo && ' · inativo'}
              </p>

              <div
                className="rounded-lg p-3 text-[12px] leading-relaxed"
                style={{ backgroundColor: '#F5F7F9', color: '#6B7280' }}
              >
                {p.templateMensagem
                  ? `"${p.templateMensagem.slice(0, 80)}${p.templateMensagem.length > 80 ? '...' : ''}"`
                  : 'Sem template de mensagem configurado'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vazio */}
      {!loading && procedimentos.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[15px] font-semibold mb-1" style={{ color: '#4F525A' }}>
            Nenhum procedimento cadastrado ainda
          </p>
          <p className="text-[13px] mb-4" style={{ color: '#9CA3AF' }}>
            Cadastre os procedimentos realizados na clínica para começar.
          </p>
          <Button onClick={abrirNovo}>
            <Plus size={16} />
            Cadastrar primeiro procedimento
          </Button>
        </div>
      )}

      {/* Drawer */}
      {drawerAberto && (
        <DrawerProcedimento
          procedimento={procedimentoSelecionado}
          onClose={() => { setDrawerAberto(false); setProcedimentoSelecionado(null) }}
          onSucesso={onSalvo}
        />
      )}
    </div>
  )
}