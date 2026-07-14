import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Phone, Calendar } from 'lucide-react'
import { BadgeTag, BadgeStatus } from '../../components/ui/Badge'
import { buscarPerfilPaciente } from '../../api/pacientes'
import type { PerfilPaciente } from '../../types'

// Função para formatar telefone (mantida)
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

export function PerfilPaciente() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) carregarPerfil(Number(id))
  }, [id])

  const carregarPerfil = async (pacienteId: number) => {
    try {
      const data = await buscarPerfilPaciente(pacienteId)
      setPerfil(data)
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
    } finally {
      setLoading(false)
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

  const calcularIdade = (dataNascimento?: string) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nasc = new Date(dataNascimento + 'T00:00:00')
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const m = hoje.getMonth() - nasc.getMonth()
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--
    return idade
  }

  const formatarData = (data: string) => {
    return new Date(data.includes('T') ? data : data + 'T00:00:00')
      .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="text-center py-16">
        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Paciente não encontrado</span>
      </div>
    )
  }

  const { paciente, contatos, procedimentos } = perfil
  const idade = calcularIdade(paciente.dataNascimento)

  // Ordenações (agora no próprio estado, caso o backend não ordene)
  const contatosOrdenados = [...contatos].sort((a, b) =>
    new Date(b.realizadoEm).getTime() - new Date(a.realizadoEm).getTime()
  )
  const procedimentosOrdenados = [...procedimentos].sort((a, b) =>
    new Date(b.dataRealizacao).getTime() - new Date(a.dataRealizacao).getTime()
  )

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-5">
        <button
          onClick={() => navigate('/pacientes')}
          className="flex items-center gap-1 text-[13px] font-medium"
          style={{ color: '#9CA3AF' }}
        >
          <ChevronLeft size={14} />
          Pacientes
        </button>
        <span className="text-[13px]" style={{ color: '#9CA3AF' }}>/</span>
        <span className="text-[13px] font-medium" style={{ color: '#14B7C1' }}>
          {paciente.nome}
        </span>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-5 items-start">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-4">
          {/* Card dados do paciente */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#14B7C1' }}
              >
                <span className="text-white text-[14px] font-semibold">
                  {getIniciais(paciente.nome)}
                </span>
              </div>
              <div>
                <p className="text-[16px] font-bold" style={{ color: '#4F525A' }}>
                  {paciente.nome}
                </p>
                {idade !== null && (
                  <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
                    {idade} anos
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid #F5F7F9' }}>
              <a
                href={`tel:${paciente.telefone}`}
                className="flex items-center gap-2 text-[13px] font-medium"
                style={{ color: '#14B7C1' }}
              >
                <Phone size={14} />
                {formatarTelefone(paciente.telefone)}
              </a>
              {paciente.dataNascimento && (
                <div className="flex items-center gap-2 text-[13px]" style={{ color: '#4F525A' }}>
                  <Calendar size={14} style={{ color: '#9CA3AF' }} />
                  {formatarData(paciente.dataNascimento)}
                </div>
              )}
            </div>

            {paciente.tags.length > 0 && (
              <div
                className="flex gap-1.5 flex-wrap mt-3 pt-3"
                style={{ borderTop: '1px solid #F5F7F9' }}
              >
                {paciente.tags.map(tag => (
                  <BadgeTag key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Procedimentos realizados */}
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
          >
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#4F525A' }}>
              Procedimentos realizados
            </h3>

            {procedimentosOrdenados.length === 0 && (
              <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
                Nenhum procedimento registrado ainda.
              </p>
            )}

            <div className="flex flex-col">
              {procedimentosOrdenados.map((proc, index) => (
                <div key={proc.id} className="flex gap-3 relative">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: index === 0 ? '#14B7C1' : '#E3E6EA' }}
                    />
                    {index < procedimentosOrdenados.length - 1 && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{ backgroundColor: '#E3E6EA' }}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-[13px] font-semibold" style={{ color: '#4F525A' }}>
                      {proc.procedimentoNome}
                    </p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
                      {formatarData(proc.dataRealizacao)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — histórico de contatos */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: '#4F525A' }}>
            Histórico de contatos
          </h3>

          {contatosOrdenados.length === 0 && (
            <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
              Nenhum contato registrado ainda.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {contatosOrdenados.map(contato => (
              <div
                key={contato.id}
                className="flex items-start justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#F5F7F9' }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold" style={{ color: '#4F525A' }}>
                      {formatarData(contato.realizadoEm)}
                    </span>
                    <span className="text-[13px]" style={{ color: '#14B7C1' }}>
                      {contato.procedimentoNome}
                    </span>
                  </div>
                  <p className="text-[12px] mt-1" style={{ color: '#9CA3AF' }}>
                    Contactado por {/* nome vem do backend futuramente */}
                    {contato.observacao && ` · "${contato.observacao}"`}
                  </p>
                </div>
                <BadgeStatus status={contato.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}