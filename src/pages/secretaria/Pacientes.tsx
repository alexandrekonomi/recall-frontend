import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { BadgeTag } from '../../components/ui/Badge'
import { listarPacientes } from '../../api/pacientes'
import { ModalNovoPaciente } from '../../components/ui/ModalNovoPaciente'
import type { Paciente, TagPaciente } from '../../types'

import { PageHeader } from '../../components/ui/PageHeader'


const formatarTelefone = (numero: string): string => {
  const apenasNumeros = numero.replace(/\D/g, '')

  if (apenasNumeros.length === 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`
  }
  if (apenasNumeros.length === 11) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`
  }
  return apenasNumeros || numero
}

const normalizarBusca = (termo: string): string => termo.replace(/\D/g, '')

export function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [tagFiltro, setTagFiltro] = useState<TagPaciente | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<'ativos' | 'inativos'>('ativos')
  const [modalAberto, setModalAberto] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const porPagina = 9
  const navigate = useNavigate()

  useEffect(() => {
    carregarPacientes()
  }, [])

  const carregarPacientes = async () => {
    try {
      const data = await listarPacientes()
      setPacientes(data)
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err)
    } finally {
      setLoading(false)
    }
  }

  const buscaNormalizada = normalizarBusca(busca)

  const pacientesFiltrados = pacientes.filter(p => {
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.telefone.includes(buscaNormalizada)
    const matchTag = tagFiltro ? p.tags.includes(tagFiltro) : true
    const matchStatus = statusFiltro === 'ativos' ? p.ativo : !p.ativo
    return matchBusca && matchTag && matchStatus
  })

  const totalPaginas = Math.ceil(pacientesFiltrados.length / porPagina)
  const pacientesPaginados = pacientesFiltrados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  )

  const tags: TagPaciente[] = ['VIP', 'CONVENIO', 'PLANO', 'FREQUENTE']

  const onPacienteCriado = () => {
    setModalAberto(false)
    carregarPacientes()
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHeader
        icon={<Users size={20} />}
        title="Pacientes"
        subtitle={`${pacientes.length} pacientes cadastrados`}
        actions={
          <Button onClick={() => setModalAberto(true)}>
            <Plus size={16} />
            Adicionar paciente
          </Button>
        }
      />

      {/* Filtros */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
      >
        <div className="relative flex-1 max-w-[280px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#9CA3AF' }}
          />
          <input
            type="text"
            value={busca}
            onChange={e => { setBusca(e.target.value); setPaginaAtual(1) }}
            placeholder="Buscar por nome ou telefone"
            className="w-full pl-9 pr-3 py-2 rounded-lg text-[13px] outline-none"
            style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
            onFocus={e => e.target.style.borderColor = '#14B7C1'}
            onBlur={e => e.target.style.borderColor = '#E3E6EA'}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>Tags:</span>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => { setTagFiltro(tagFiltro === tag ? null : tag); setPaginaAtual(1) }}
              className="px-2.5 py-1 rounded-full text-[12px] font-medium transition-all"
              style={{
                backgroundColor: tagFiltro === tag ? '#14B7C1' : '#F5F7F9',
                color: tagFiltro === tag ? '#FFFFFF' : '#4F525A',
                border: tagFiltro === tag ? '1px solid #14B7C1' : '1px solid #E3E6EA',
              }}
            >
              {tag === 'CONVENIO' ? 'Convênio' : tag === 'FREQUENTE' ? 'Frequente' : tag}
            </button>
          ))}
        </div>

        <div className="w-px h-6" style={{ backgroundColor: '#E3E6EA' }} />

        {(['ativos', 'inativos'] as const).map(s => (
          <button
            key={s}
            onClick={() => { setStatusFiltro(s); setPaginaAtual(1) }}
            className="px-3 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all"
            style={{
              backgroundColor: statusFiltro === s ? '#FFFFFF' : 'transparent',
              color: statusFiltro === s ? '#4F525A' : '#9CA3AF',
              border: statusFiltro === s ? '1px solid #E3E6EA' : '1px solid transparent',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16">
          <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
        </div>
      )}

      {!loading && pacientes.length === 0 && (
        <div className="text-center py-20">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#F5F7F9' }}
          >
            <Users size={28} style={{ color: '#9CA3AF' }} />
          </div>
          <h3 className="text-[15px] font-semibold mb-1" style={{ color: '#4F525A' }}>
            Nenhum paciente cadastrado ainda
          </h3>
          <p className="text-[13px] mb-4" style={{ color: '#9CA3AF' }}>
            Cadastre o primeiro paciente para começar a acompanhar retornos.
          </p>
          <Button onClick={() => setModalAberto(true)}>
            <Plus size={16} />
            Cadastrar primeiro paciente
          </Button>
        </div>
      )}

      {!loading && pacientesPaginados.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #E3E6EA' }}>
                {['NOME', 'TELEFONE', 'ÚLTIMO PROCEDIMENTO', 'ÚLTIMO CONTATO', 'PRÓXIMO CONTATO', 'TAGS', 'STATUS'].map(h => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-semibold tracking-wider"
                    style={{ color: '#9CA3AF' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pacientesPaginados.map(p => (
                <tr
                  key={p.id}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid #F5F7F9' }}
                  onClick={() => navigate(`/pacientes/${p.id}`)}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFBFC'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[14px] font-medium" style={{ color: '#14B7C1' }}>
                      {p.nome}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px]" style={{ color: '#4F525A' }}>
                      {formatarTelefone(p.telefone)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px]" style={{ color: '#4F525A' }}>—</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px]" style={{ color: '#4F525A' }}>
                      {p.criadoEm ? new Date(p.criadoEm).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px]" style={{ color: '#4F525A' }}>—</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map(tag => (
                        <BadgeTag key={tag} tag={tag} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-[12px] font-medium"
                      style={{ color: p.ativo ? '#22C55E' : '#9CA3AF' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: p.ativo ? '#22C55E' : '#9CA3AF' }}
                      />
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid #E3E6EA' }}
          >
            <span className="text-[12px]" style={{ color: '#9CA3AF' }}>
              Mostrando {pacientesPaginados.length} de {pacientesFiltrados.length} pacientes
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="px-2.5 py-1 rounded text-[12px] font-medium disabled:opacity-30"
                style={{ color: '#4F525A', border: '1px solid #E3E6EA' }}
              >
                ‹
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPaginaAtual(p)}
                  className="w-7 h-7 rounded text-[12px] font-medium"
                  style={{
                    backgroundColor: paginaAtual === p ? '#14B7C1' : 'transparent',
                    color: paginaAtual === p ? '#FFFFFF' : '#4F525A',
                    border: paginaAtual === p ? 'none' : '1px solid #E3E6EA',
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="px-2.5 py-1 rounded text-[12px] font-medium disabled:opacity-30"
                style={{ color: '#4F525A', border: '1px solid #E3E6EA' }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAberto && (
        <ModalNovoPaciente
          onClose={() => setModalAberto(false)}
          onSucesso={onPacienteCriado}
        />
      )}
    </div>
  )
}