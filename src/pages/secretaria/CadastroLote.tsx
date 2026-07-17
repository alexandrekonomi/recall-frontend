import { useState, useRef } from 'react'
import { useEffect } from 'react'
import { UserPlus, Check } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { criarPaciente } from '../../api/pacientes'
import { criarVinculoProcedimento } from '../../api/procedimentos-paciente'
import { listarProcedimentos } from '../../api/procedimentos'
import type { Procedimento, TagPaciente } from '../../types'

export function CadastroLote() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [procedimentoId, setProcedimentoId] = useState('')
  const [dataRealizacao, setDataRealizacao] = useState('')
  const [tags, setTags] = useState<TagPaciente[]>([])
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [contador, setContador] = useState(0)
  const [ultimoNome, setUltimoNome] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listarProcedimentos().then(setProcedimentos).catch(console.error)
  }, [])

  const tagsDisponiveis: { valor: TagPaciente; label: string }[] = [
    { valor: 'VIP', label: 'VIP' },
    { valor: 'CONVENIO', label: 'Convênio' },
    { valor: 'PLANO', label: 'Plano' },
    { valor: 'FREQUENTE', label: 'Frequente' },
  ]

  const toggleTag = (tag: TagPaciente) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const limparFormulario = () => {
    setNome('')
    setTelefone('')
    setDataNascimento('')
    setProcedimentoId('')
    setDataRealizacao('')
    setTags([])
  }

  const handleSalvar = async () => {
    if (!nome.trim() || !telefone.trim()) {
      setErro('Nome e telefone são obrigatórios')
      return
    }
    setErro('')
    setSalvando(true)
    try {
      const paciente = await criarPaciente({
        nome,
        telefone,
        dataNascimento: dataNascimento || undefined,
        tags,
      })

      if (procedimentoId && dataRealizacao) {
        await criarVinculoProcedimento({
          pacienteId: paciente.id,
          procedimentoId: Number(procedimentoId),
          dataRealizacao,
        })
      }

      setUltimoNome(nome)
      setContador(prev => prev + 1)
      limparFormulario()
      nomeRef.current?.focus()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar paciente')
    } finally {
      setSalvando(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSalvar()
    }
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} onKeyDown={handleKeyDown}>
      <PageHeader
        icon={<UserPlus size={20} />}
        title="Cadastro rápido"
        subtitle="Popule a base com o histórico do caderno, um paciente por vez"
      />

      {contador > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3 mb-5"
          style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
        >
          <Check size={16} />
          <span className="text-[13px]">
            {ultimoNome} cadastrado. <strong>{contador}</strong> {contador === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'} nesta sessão.
          </span>
        </div>
      )}

      {erro && (
        <div
          className="rounded-lg px-4 py-3 mb-4 text-[13px]"
          style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
        >
          {erro}
        </div>
      )}

      <div
        className="rounded-xl p-6 max-w-[560px]"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
      >
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
          Dados do paciente
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Nome completo
            </label>
            <input
              ref={nomeRef}
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Nome do paciente"
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                Telefone
              </label>
              <input
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(11) 90000-0000"
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                Data de nascimento
              </label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
              Tags
            </label>
            <div className="flex gap-2 flex-wrap">
              {tagsDisponiveis.map(tag => {
                const selecionada = tags.includes(tag.valor)
                return (
                  <button
                    key={tag.valor}
                    type="button"
                    onClick={() => toggleTag(tag.valor)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                    style={{
                      backgroundColor: selecionada ? '#14B7C1' : '#F5F7F9',
                      color: selecionada ? '#FFFFFF' : '#4F525A',
                      border: selecionada ? '1px solid #14B7C1' : '1px solid #E3E6EA',
                    }}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-px my-1" style={{ backgroundColor: '#F5F7F9' }} />

          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: '#4F525A' }}>
              Último procedimento realizado <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span>
            </p>
            <p className="text-[12px] mb-3" style={{ color: '#9CA3AF' }}>
              Se souber, preencha para o sistema já calcular quando contactar esse paciente
            </p>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={procedimentoId}
                onChange={e => setProcedimentoId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              >
                <option value="">Selecione o procedimento</option>
                {procedimentos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              <input
                type="date"
                value={dataRealizacao}
                onChange={e => setDataRealizacao(e.target.value)}
                disabled={!procedimentoId}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none disabled:opacity-50"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button onClick={handleSalvar} loading={salvando} className="flex-1">
            <UserPlus size={16} />
            Cadastrar e continuar
          </Button>
        </div>
        <p className="text-[11px] mt-2 text-center" style={{ color: '#9CA3AF' }}>
          Dica: Ctrl + Enter para cadastrar rápido sem tirar a mão do teclado
        </p>
      </div>
    </div>
  )
}