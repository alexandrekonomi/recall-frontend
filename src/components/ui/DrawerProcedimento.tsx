import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { criarProcedimento, atualizarProcedimento } from '../../api/procedimentos'
import type { Procedimento } from '../../types'

interface Props {
  procedimento: Procedimento | null
  onClose: () => void
  onSucesso: () => void
}

export function DrawerProcedimento({ procedimento, onClose, onSucesso }: Props) {
  const [nome, setNome] = useState(procedimento?.nome || '')
  const [descricao, setDescricao] = useState(procedimento?.descricao || '')
  const [intervalo, setIntervalo] = useState(procedimento?.intervaloRetornoDias?.toString() || '')
  const [template, setTemplate] = useState(procedimento?.templateMensagem || '')
  const [ativo, setAtivo] = useState(procedimento?.ativo ?? true)
  const [valor, setValor] = useState(procedimento?.valor?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const variaveis = [
    { chave: '{nome}', label: '{nome}' },
    { chave: '{procedimento}', label: '{procedimento}' },
    { chave: '{data}', label: '{data}' },
  ]

  const inserirVariavel = (chave: string) => {
    setTemplate(prev => prev + chave)
  }

  const gerarPreview = () => {
    if (!template) return ''
    const hoje = new Date().toLocaleDateString('pt-BR')
    return template
      .replace(/{nome}/g, 'Marina')
      .replace(/{procedimento}/g, nome || 'Procedimento')
      .replace(/{data}/g, hoje)
  }

  const handleSalvar = async () => {
    if (!nome.trim() || !descricao.trim() || !intervalo) {
      setErro('Preencha nome, descrição e intervalo de retorno')
      return
    }
    setErro('')
    setLoading(true)
    try {
      const payload = {
        nome,
        descricao,
        intervaloRetornoDias: Number(intervalo),
        templateMensagem: template || undefined,
        valor: valor ? Number(valor) : undefined,
      }

      if (procedimento) {
        await atualizarProcedimento(procedimento.id, payload)
      } else {
        await criarProcedimento(payload)
      }

      onSucesso()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao salvar procedimento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex justify-end z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] h-full overflow-y-auto p-6"
        style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold" style={{ color: '#4F525A' }}>
            {procedimento ? 'Editar procedimento' : 'Novo procedimento'}
          </h3>
          <button onClick={onClose} style={{ color: '#9CA3AF' }}>
            <X size={20} />
          </button>
        </div>

        {erro && (
          <div
            className="rounded-lg px-4 py-3 mb-4 text-[13px]"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            {erro}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Nome do procedimento
            </label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Botox"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Descrição
            </label>
            <input
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Ex: Toxina botulínica para linhas de expressão"
              className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          {/* Intervalo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Intervalo de retorno
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={intervalo}
                onChange={e => setIntervalo(e.target.value)}
                className="w-24 px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
              <span className="text-[13px]" style={{ color: '#9CA3AF' }}>dias</span>
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Valor do procedimento
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]"
                style={{ color: '#9CA3AF' }}
              >
                R$
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={e => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
            <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
              Usado para calcular a receita potencial no painel de gestão
            </span>
          </div>

          {/* Template */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Template de mensagem
            </label>
            <div className="flex gap-1.5 mb-1">
              {variaveis.map(v => (
                <button
                  key={v.chave}
                  type="button"
                  onClick={() => inserirVariavel(v.chave)}
                  className="px-2.5 py-1 rounded-full text-[12px] font-medium"
                  style={{ backgroundColor: '#E8F8F9', color: '#14B7C1' }}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <textarea
              value={template}
              onChange={e => setTemplate(e.target.value)}
              placeholder="Oi {nome}! Já faz um tempinho desde seu {procedimento}..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none resize-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          {/* Preview */}
          {template && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
                Pré-visualização
              </label>
              <div
                className="rounded-lg p-3 text-[13px] leading-relaxed"
                style={{ backgroundColor: '#F5F7F9', color: '#4F525A' }}
              >
                {gerarPreview()}
              </div>
            </div>
          )}

          {/* Ativo */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F5F7F9' }}>
            <span className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Procedimento ativo
            </span>
            <button
              onClick={() => setAtivo(!ativo)}
              className="relative w-10 h-5.5 rounded-full transition-colors"
              style={{ backgroundColor: ativo ? '#14B7C1' : '#E3E6EA' }}
            >
              <span
                className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all"
                style={{ left: ativo ? '20px' : '2px' }}
              />
            </button>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} loading={loading}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}