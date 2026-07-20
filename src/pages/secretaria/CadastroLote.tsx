import { useState, useRef, useEffect } from 'react'
import { UserPlus, Check } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Button } from '../../components/ui/Button'
import { criarPaciente, buscarPacientes } from '../../api/pacientes'
import { criarVinculoProcedimento } from '../../api/procedimentos-paciente'
import { listarProcedimentos } from '../../api/procedimentos'
import { useDebounce } from '../../hooks/useDebounce'
import type { Procedimento, TagPaciente, Paciente } from '../../types'

export function CadastroLote() {
  const [modo, setModo] = useState<'novo' | 'existente'>('novo')

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [tags, setTags] = useState<TagPaciente[]>([])

  const [buscaPaciente, setBuscaPaciente] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null)
  const [dropdownAberto, setDropdownAberto] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [resultadosBusca, setResultadosBusca] = useState<Paciente[]>([])
  const buscaComDelay = useDebounce(buscaPaciente, 300)

  const [procedimentoId, setProcedimentoId] = useState('')
  const [dataRealizacao, setDataRealizacao] = useState('')
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([])

  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [contador, setContador] = useState(0)
  const [ultimoNome, setUltimoNome] = useState('')
  const nomeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listarProcedimentos().then(setProcedimentos).catch(console.error)
  }, [])

  useEffect(() => {
    if (!buscaComDelay.trim() || pacienteSelecionado) {
      setResultadosBusca([])
      return
    }

    setBuscando(true)
    buscarPacientes(buscaComDelay)
      .then(setResultadosBusca)
      .catch(console.error)
      .finally(() => setBuscando(false))
  }, [buscaComDelay, pacienteSelecionado])

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
    setPacienteSelecionado(null)
    setBuscaPaciente('')
  }

  const handleSalvar = async () => {
    if (modo === 'novo' && (!nome.trim() || !telefone.trim())) {
      setErro('Nome e telefone são obrigatórios')
      return
    }
    if (modo === 'existente' && !pacienteSelecionado) {
      setErro('Selecione um paciente existente')
      return
    }
    if (!procedimentoId || !dataRealizacao) {
      setErro('Selecione o procedimento e a data')
      return
    }

    setErro('')
    setSalvando(true)
    try {
      let pacienteId: number
      let nomeParaFeedback: string

      if (modo === 'novo') {
        const paciente = await criarPaciente({
          nome,
          telefone,
          dataNascimento: dataNascimento || undefined,
          tags,
        })
        pacienteId = paciente.id
        nomeParaFeedback = paciente.nome
      } else {
        pacienteId = pacienteSelecionado!.id
        nomeParaFeedback = pacienteSelecionado!.nome
      }

      await criarVinculoProcedimento({
        pacienteId,
        procedimentoId: Number(procedimentoId),
        dataRealizacao,
      })

      setUltimoNome(nomeParaFeedback)
      setContador(prev => prev + 1)
      limparFormulario()
      nomeRef.current?.focus()
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar')
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

      <div className="flex flex-col items-center">
        {contador > 0 && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 mb-5 w-full max-w-[560px]"
            style={{ backgroundColor: '#F0FDF4', color: '#166534' }}
          >
            <Check size={16} />
            <span className="text-[13px]">
              {ultimoNome} atualizado. <strong>{contador}</strong> {contador === 1 ? 'registro cadastrado' : 'registros cadastrados'} nesta sessão.
            </span>
          </div>
        )}

        {erro && (
          <div
            className="rounded-lg px-4 py-3 mb-4 w-full max-w-[560px] text-[13px]"
            style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
          >
            {erro}
          </div>
        )}

        <div
          className="rounded-xl p-6 w-full max-w-[560px]"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setModo('novo'); setPacienteSelecionado(null); setBuscaPaciente('') }}
              className="flex-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
              style={{
                backgroundColor: modo === 'novo' ? '#E8F8F9' : '#F5F7F9',
                border: modo === 'novo' ? '2px solid #14B7C1' : '1px solid #E3E6EA',
                color: modo === 'novo' ? '#14B7C1' : '#4F525A',
              }}
            >
              Novo paciente
            </button>
            <button
              onClick={() => setModo('existente')}
              className="flex-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
              style={{
                backgroundColor: modo === 'existente' ? '#E8F8F9' : '#F5F7F9',
                border: modo === 'existente' ? '2px solid #14B7C1' : '1px solid #E3E6EA',
                color: modo === 'existente' ? '#14B7C1' : '#4F525A',
              }}
            >
              Paciente já cadastrado
            </button>
          </div>

          {modo === 'novo' ? (
            <>
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
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
                Buscar paciente
              </h3>
              <div className="relative">
                <input
                  value={pacienteSelecionado ? pacienteSelecionado.nome : buscaPaciente}
                  onChange={e => {
                    setBuscaPaciente(e.target.value)
                    setPacienteSelecionado(null)
                    setDropdownAberto(true)
                  }}
                  onFocus={() => setDropdownAberto(true)}
                  placeholder="Buscar por nome ou telefone"
                  className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                  style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                />
                {dropdownAberto && buscaPaciente && !pacienteSelecionado && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-10"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  >
                    {buscando && (
                      <div className="px-3 py-2.5 text-[13px]" style={{ color: '#9CA3AF' }}>
                        Buscando...
                      </div>
                    )}
                    {!buscando && resultadosBusca.length === 0 && (
                      <div className="px-3 py-2.5 text-[13px]" style={{ color: '#9CA3AF' }}>
                        Nenhum paciente encontrado
                      </div>
                    )}
                    {!buscando && resultadosBusca.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPacienteSelecionado(p)
                          setDropdownAberto(false)
                        }}
                        className="w-full text-left px-3 py-2.5 text-[13px] transition-colors"
                        style={{ color: '#4F525A' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F7F9'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span className="font-medium">{p.nome}</span>
                        <span style={{ color: '#9CA3AF' }}> · {p.telefone}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="h-px my-5" style={{ backgroundColor: '#F5F7F9' }} />

          <div>
            <p className="text-[13px] font-medium mb-1" style={{ color: '#4F525A' }}>
              Procedimento realizado
            </p>
            <p className="text-[12px] mb-3" style={{ color: '#9CA3AF' }}>
              O sistema calcula automaticamente quando contactar esse paciente de novo
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
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Button onClick={handleSalvar} loading={salvando} className="flex-1">
              <UserPlus size={16} />
              {modo === 'novo' ? 'Cadastrar e continuar' : 'Adicionar procedimento e continuar'}
            </Button>
          </div>
          <p className="text-[11px] mt-2 text-center" style={{ color: '#9CA3AF' }}>
            Dica: Ctrl + Enter para cadastrar rápido sem tirar a mão do teclado
          </p>
        </div>
      </div>
    </div>
  )
}