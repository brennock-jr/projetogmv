import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { getServerUser } from '@/lib/auth'
import { getEvento } from '@/server/eventos.functions'
import { getInscricoesEvento, inscreverUsuario, cancelarInscricao, verificarInscricao } from '@/server/inscricoes.functions'
import { useServerFn } from '@tanstack/react-start'
import {
  CalendarDays,
  MapPin,
  Users,
  Tent,
  Mountain,
  ArrowDownToLine,
  Target,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'

export const Route = createFileRoute('/atividades/$id')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  loader: async ({ params }) => {
    const [evento, inscricoes, verificacao] = await Promise.all([
      getEvento({ data: { id: params.id } }),
      getInscricoesEvento({ data: { eventoId: params.id } }),
      verificarInscricao({ data: { eventoId: params.id } }),
    ])
    return { evento, inscricoes, inscrito: verificacao.inscrito }
  },
  component: AtividadeDetalhePage,
})

const categoriaConfig: Record<string, { icon: ReactNode; cor: string; label: string }> = {
  Acampamento: { icon: <Tent className="w-5 h-5" />, cor: 'bg-green-700', label: 'Acampamento' },
  Trilha: { icon: <Mountain className="w-5 h-5" />, cor: 'bg-amber-700', label: 'Trilha' },
  Rapel: { icon: <ArrowDownToLine className="w-5 h-5" />, cor: 'bg-blue-700', label: 'Rapel' },
  Airsoft: { icon: <Target className="w-5 h-5" />, cor: 'bg-gray-700', label: 'Airsoft' },
}

function formatarData(dataStr: string) {
  return new Date(dataStr).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function AtividadeDetalhePage() {
  const { evento, inscricoes: inscricoesIniciais, inscrito: inscritoInicial } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const isChefia = user?.roles?.includes('chefia')

  const [inscrito, setInscrito] = useState(inscritoInicial)
  const [inscricoes, setInscricoes] = useState(inscricoesIniciais)
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const inscreverFn = useServerFn(inscreverUsuario)
  const cancelarFn = useServerFn(cancelarInscricao)

  if (!evento) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Atividade não encontrada.</p>
        <Link to="/atividades" className="text-military-olive hover:underline mt-4 inline-block">
          ← Voltar às atividades
        </Link>
      </div>
    )
  }

  const passado = new Date(evento.data) < new Date()
  const cat = categoriaConfig[evento.categoria]
  const vagasOcupadas = inscricoes.length
  const vagasRestantes = evento.vagas - vagasOcupadas

  const handleInscrever = async () => {
    setCarregando(true)
    setErro('')
    setMensagem('')
    try {
      const nova = await inscreverFn({ data: { eventoId: evento.id } })
      setInscricoes((prev) => [...prev, nova])
      setInscrito(true)
      setMensagem('Inscrição realizada com sucesso!')
    } catch (e) {
      setErro((e as Error).message || 'Erro ao realizar inscrição.')
    } finally {
      setCarregando(false)
    }
  }

  const handleCancelar = async () => {
    setCarregando(true)
    setErro('')
    setMensagem('')
    try {
      await cancelarFn({ data: { eventoId: evento.id } })
      setInscricoes((prev) => prev.filter((i) => i.userId !== user?.id))
      setInscrito(false)
      setMensagem('Inscrição cancelada.')
    } catch (e) {
      setErro((e as Error).message || 'Erro ao cancelar inscrição.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        to="/atividades"
        className="inline-flex items-center gap-1.5 text-sm text-military-olive hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar às atividades
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className={`${passado ? 'bg-gray-600' : (cat?.cor || 'bg-gray-700')} px-6 py-5`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white">{cat?.icon}</span>
            <span className="text-white text-sm font-bold uppercase tracking-widest opacity-90">
              {cat?.label}
            </span>
            {passado && (
              <span className="ml-auto bg-black/20 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Encerrado
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">{evento.titulo}</h1>
        </div>

        <div className="p-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-parchment rounded-lg">
              <CalendarDays className="w-5 h-5 text-military-olive mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</p>
                <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">
                  {formatarData(evento.data)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-parchment rounded-lg">
              <MapPin className="w-5 h-5 text-military-olive mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Local</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{evento.local}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-parchment rounded-lg">
              <Users className="w-5 h-5 text-military-olive mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vagas</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">
                  {vagasRestantes > 0
                    ? `${vagasRestantes} de ${evento.vagas} disponíveis`
                    : `Lotado (${evento.vagas} vagas)`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-military-green uppercase tracking-wider mb-2">
              Descrição
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{evento.descricao}</p>
          </div>

          {/* Vagas indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{vagasOcupadas} inscrito{vagasOcupadas !== 1 ? 's' : ''}</span>
              <span>{evento.vagas} vagas totais</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  vagasRestantes === 0 ? 'bg-red-500' : vagasRestantes <= 3 ? 'bg-amber-500' : 'bg-military-olive'
                }`}
                style={{ width: `${Math.min(100, (vagasOcupadas / evento.vagas) * 100)}%` }}
              />
            </div>
          </div>

          {/* Messages */}
          {mensagem && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              {mensagem}
            </div>
          )}
          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700 text-sm">
              <XCircle className="w-4 h-4" />
              {erro}
            </div>
          )}

          {/* Action Buttons */}
          {!passado && (
            <div className="flex flex-wrap gap-3">
              {inscrito ? (
                <div className="flex flex-wrap gap-3 items-center w-full">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle className="w-5 h-5" />
                    <span>Você está inscrito nesta atividade</span>
                  </div>
                  <button
                    onClick={handleCancelar}
                    disabled={carregando}
                    className="ml-auto px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors disabled:opacity-60"
                  >
                    {carregando ? 'Aguarde...' : 'Cancelar Inscrição'}
                  </button>
                </div>
              ) : vagasRestantes === 0 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>Atividade lotada — sem vagas disponíveis</span>
                </div>
              ) : (
                <button
                  onClick={handleInscrever}
                  disabled={carregando}
                  className="px-6 py-2.5 bg-military-olive hover:bg-military-green text-white rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60"
                >
                  {carregando ? 'Aguarde...' : 'Inscrever-se'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Participants (chefia only) */}
      {isChefia && (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-military-green/5">
            <h2 className="font-bold text-military-green uppercase tracking-wider text-sm">
              Lista de Inscritos ({inscricoes.length})
            </h2>
          </div>
          {inscricoes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Nenhum participante inscrito ainda.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inscricoes.map((inscricao, idx) => (
                <div key={inscricao.userId} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-8 bg-military-olive rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{inscricao.userName}</p>
                    <p className="text-sm text-gray-500">{inscricao.userEmail}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(inscricao.inscritoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
