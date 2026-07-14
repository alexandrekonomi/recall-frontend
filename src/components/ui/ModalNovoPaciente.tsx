import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { criarPaciente } from '../../api/pacientes'
import type { TagPaciente } from '../../types'

interface Props {
  onClose: () => void
  onSucesso: () => void
}

export function ModalNovoPaciente({ onClose, onSucesso }: Props) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [tagsSelecionadas, setTagsSelecionadas] = useState<TagPaciente[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const tags: { valor: TagPaciente; label: string }[] = [
    { valor: 'VIP', label: 'VIP' },
    { valor: 'CONVENIO', label: 'Convênio' },
    { valor: 'PLANO', label: 'Plano' },
    { valor: 'FREQUENTE', label: 'Frequente' },
  ]

  const toggleTag = (tag: TagPaciente) => {
    setTagsSelecionadas(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // Máscara e filtro para telefone
  const aplicarMascaraTelefone = (valor: string): string => {
    // Remove tudo que não for dígito
    const apenasNumeros = valor.replace(/\D/g, '')
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const numerosLimitados = apenasNumeros.slice(0, 11)
    
    // Aplica a máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX se tiver apenas 10 dígitos
    if (numerosLimitados.length <= 2) {
      return numerosLimitados.length > 0 ? `(${numerosLimitados}` : ''
    }
    if (numerosLimitados.length <= 6) {
      return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2)}`
    }
    if (numerosLimitados.length <= 10) {
      return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 6)}-${numerosLimitados.slice(6)}`
    }
    // 11 dígitos
    return `(${numerosLimitados.slice(0, 2)}) ${numerosLimitados.slice(2, 7)}-${numerosLimitados.slice(7, 11)}`
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorBruto = e.target.value
    const mascarado = aplicarMascaraTelefone(valorBruto)
    setTelefone(mascarado)
  }

  const handleSalvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      setErro('Nome e telefone são obrigatórios')
      return
    }

    // Extrai apenas números para validação
    const apenasNumeros = telefone.replace(/\D/g, '')
    if (apenasNumeros.length < 10) {
      setErro('Telefone deve ter pelo menos 10 dígitos (com DDD)')
      return
    }

    setErro('')
    setLoading(true)
    try {
      await criarPaciente({
        nome,
        telefone: apenasNumeros, // envia apenas números
        dataNascimento: dataNascimento || undefined,
        tags: tagsSelecionadas,
      })
      onSucesso()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar paciente')
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
        className="rounded-2xl p-6 w-full max-w-[440px] relative"
        style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          style={{ color: '#9CA3AF' }}
        >
          <X size={20} />
        </button>

        <h3 className="text-[18px] font-bold mb-5" style={{ color: '#4F525A' }}>
          Novo paciente
        </h3>

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
            <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>
              Nome completo
            </label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Nome do paciente"
              className="w-full px-4 py-3 rounded-lg text-[14px] outline-none transition-all"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          {/* Telefone e Nascimento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>
                Telefone
              </label>
              <input
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(11) 90000-0000"
                maxLength={15} // (11) 99999-9999 = 15 caracteres
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-lg text-[14px] outline-none transition-all"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>
                Data de nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-[14px] outline-none transition-all"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium" style={{ color: '#4F525A' }}>
              Tags
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tags.map(tag => {
                const selecionada = tagsSelecionadas.includes(tag.valor)
                return (
                  <button
                    key={tag.valor}
                    type="button"
                    onClick={() => toggleTag(tag.valor)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      backgroundColor: selecionada ? '#E8F8F9' : '#FFFFFF',
                      border: selecionada ? '2px solid #14B7C1' : '1px solid #E3E6EA',
                      color: selecionada ? '#14B7C1' : '#4F525A',
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                      style={{
                        backgroundColor: selecionada ? '#14B7C1' : '#FFFFFF',
                        border: selecionada ? 'none' : '1.5px solid #E3E6EA',
                        color: '#FFFFFF',
                      }}
                    >
                      {selecionada && '✓'}
                    </span>
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} loading={loading}>
            Salvar paciente
          </Button>
        </div>
      </div>
    </div>
  )
}