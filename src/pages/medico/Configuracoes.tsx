import { useState, useEffect } from 'react'
import { Plus, MoreVertical } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { buscarConfiguracao, atualizarConfiguracao } from '../../api/configuracoes'
import { listarUsuarios, desativarUsuario, reativarUsuario } from '../../api/usuarios'
import { ModalConvidarUsuario } from '../../components/ui/ModalConvidarUsuario'
import type { Usuario } from '../../api/usuarios'
import { Settings } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'


export function Configuracoes() {
  const [nomeClinica, setNomeClinica] = useState('')
  const [telefoneContato, setTelefoneContato] = useState('')
  const [diasRecontato, setDiasRecontato] = useState('3')
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [modalConviteAberto, setModalConviteAberto] = useState(false)

  useEffect(() => {
    carregar()
  }, [])

  const carregar = async () => {
    try {
      const data = await buscarConfiguracao()
      setNomeClinica(data.nomeClinica)
      setTelefoneContato(data.telefoneContato || '')
      setDiasRecontato(data.diasRecontatoSemResposta.toString())
      await carregarUsuarios()
    } catch (err) {
      console.error('Erro ao carregar configurações:', err)
    } finally {
      setLoading(false)
    }
  }

  const carregarUsuarios = async () => {
    const data = await listarUsuarios()
    setUsuarios(data)
  }

  const toggleStatusUsuario = async (usuario: Usuario) => {
    if (usuario.ativo) {
      await desativarUsuario(usuario.id)
    } else {
      await reativarUsuario(usuario.id)
    }
    carregarUsuarios()
  }

  const handleSalvar = async () => {
    setSalvando(true)
    setSucesso(false)
    try {
      await atualizarConfiguracao({
        nomeClinica,
        telefoneContato: telefoneContato || undefined,
        diasRecontatoSemResposta: Number(diasRecontato),
      })
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar:', err)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>Carregando...</span>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <PageHeader
        icon={<Settings size={20} />}
        title="Configurações"
        subtitle="Dados da clínica, reativação e usuários"
      />

      <div className="flex flex-col gap-4">
        {/* Dados da clínica */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: '#4F525A' }}>
            Dados da clínica
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                Nome da clínica
              </label>
              <input
                value={nomeClinica}
                onChange={e => setNomeClinica(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                Telefone de contato <span style={{ color: '#9CA3AF' }}>(aparece nas mensagens)</span>
              </label>
              <input
                value={telefoneContato}
                onChange={e => setTelefoneContato(e.target.value)}
                placeholder="(11) 4522-8890"
                className="w-full px-3 py-2.5 rounded-lg text-[14px] outline-none"
                style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
                onFocus={e => e.target.style.borderColor = '#14B7C1'}
                onBlur={e => e.target.style.borderColor = '#E3E6EA'}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleSalvar} loading={salvando}>
              Salvar
            </Button>
            {sucesso && (
              <span className="text-[13px] font-medium" style={{ color: '#22C55E' }}>
                Configurações salvas
              </span>
            )}
          </div>
        </div>

        {/* Configurações de reativação */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: '#4F525A' }}>
            Configurações de reativação
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: '#4F525A' }}>
              Recontatar automaticamente após
            </span>
            <input
              type="number"
              min="1"
              value={diasRecontato}
              onChange={e => setDiasRecontato(e.target.value)}
              className="w-16 px-2 py-1.5 rounded-lg text-[13px] text-center outline-none"
              style={{ border: '1px solid #E3E6EA', color: '#4F525A' }}
              onFocus={e => e.target.style.borderColor = '#14B7C1'}
              onBlur={e => e.target.style.borderColor = '#E3E6EA'}
            />
            <span className="text-[13px]" style={{ color: '#4F525A' }}>dias sem resposta</span>
            <span className="text-[12px]" style={{ color: '#9CA3AF' }}>(padrão: 3 dias)</span>
          </div>
        </div>

        {/* Usuários */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
              Usuários
            </h3>
            <Button size="sm" onClick={() => setModalConviteAberto(true)}>
              <Plus size={14} />
              Convidar secretária
            </Button>
          </div>

          <div className="flex flex-col gap-1">
            {usuarios.map((u, i) => (
              <div
                key={u.id}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < usuarios.length - 1 ? '1px solid #F5F7F9' : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#F5F7F9', border: '1px solid #E3E6EA' }}
                  >
                    <span className="text-[11px] font-semibold" style={{ color: '#4F525A' }}>
                      {u.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: '#4F525A' }}>
                      {u.nome}
                    </p>
                    <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
                      {u.email} {!u.contaAtivada && '· convite pendente'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: u.ativo ? '#22C55E' : '#9CA3AF' }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: u.ativo ? '#22C55E' : '#9CA3AF' }}
                    />
                    {u.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <button
                    onClick={() => toggleStatusUsuario(u)}
                    style={{ color: '#9CA3AF' }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {modalConviteAberto && (
          <ModalConvidarUsuario
            onClose={() => setModalConviteAberto(false)}
            onSucesso={carregarUsuarios}
          />
        )}

        {/* Disparo automático */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EA' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold" style={{ color: '#4F525A' }}>
                  Disparo automático
                </h3>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}
                >
                  Em breve
                </span>
              </div>
              <p className="text-[13px] mt-1" style={{ color: '#9CA3AF' }}>
                Envia as mensagens automaticamente via WhatsApp, sem intervenção manual da secretária.
              </p>
            </div>
            <button
              disabled
              className="relative w-10 h-5.5 rounded-full opacity-50 cursor-not-allowed"
              style={{ backgroundColor: '#E3E6EA' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}