import { createFileRoute, redirect, Link, useRouter } from '@tanstack/react-router'
import { getServerUser } from '@/lib/auth'
import { getEventos } from '@/server/eventos.functions'
import { getMinhasInscricoes } from '@/server/inscricoes.functions'
import { useIdentity } from '@/lib/identity-context'
import { updateUser } from '@netlify/identity'
import { AvisoInstalacaoIos } from '@/components/AvisoInstalacaoIOS' //Sabendo se o ricão tá com IOS
import {
  CalendarDays,
  MapPin,
  Users,
  Tent,
  Mountain,
  User as UserIcon, //Foto do indivíduo
  ArrowDownToLine,
  Target,
  CheckCircle,
  KeyRound,
} from 'lucide-react'
import React, { useState, useEffect, type ReactNode } from 'react'
import type { Evento } from '@/server/eventos.functions'
import { inscreverUsuario } from '@/server/inscricoes.functions'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  loader: async () => {
    const [eventos, minhasInscricoes] = await Promise.all([
      getEventos(),
      getMinhasInscricoes(),
    ])
    return { eventos, minhasInscricoes }
  },
  component: DashboardPage,
})

const categoriaConfig: Record<string, { icon: ReactNode; cor: string; label: string }> = {
  Acampamento: { icon: <Tent className="w-4 h-4" />, cor: 'bg-green-700', label: 'Acampamento' },
  Trilha: { icon: <Mountain className="w-4 h-4" />, cor: 'bg-amber-700', label: 'Trilha' },
  Rapel: { icon: <ArrowDownToLine className="w-4 h-4" />, cor: 'bg-blue-700', label: 'Rapel' },
  Airsoft: { icon: <Target className="w-4 h-4" />, cor: 'bg-gray-700', label: 'Airsoft' },
}

function formatarData(dataStr: string) {
  return new Date(dataStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function DashboardPage() {
  const { user } = useIdentity()
  const { eventos, minhasInscricoes } = Route.useLoaderData()
  const { user: serverUser } = Route.useRouteContext()
  const isChefia = serverUser?.roles?.includes('chefia')

  const router = useRouter();
  const handleInscricaoSucesso = ()=>{
    router.invalidate()
  }

  const agora = new Date()
  const proximosEventos = eventos.filter((e) => new Date(e.data) >= agora)
  const eventosPassados = eventos.filter((e) => new Date(e.data) < agora)
  const eventosInscritos = minhasInscricoes.map((i) => i.eventoId)

  // Recovery mode
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [recoveryErro, setRecoveryErro] = useState('')
  const [recoverySucesso, setRecoverySucesso] = useState('')
  const [recoveryCarregando, setRecoveryCarregando] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('gmv_recovery_mode') === 'true') {
      setRecoveryMode(true)
      sessionStorage.removeItem('gmv_recovery_mode')
    }
  }, [])

  const handleAtualizarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (novaSenha !== confirmarSenha) {
      setRecoveryErro('As senhas não coincidem.')
      return
    }
    if (novaSenha.length < 6) {
      setRecoveryErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    setRecoveryCarregando(true)
    setRecoveryErro('')
    try {
      await updateUser({ password: novaSenha })
      setRecoverySucesso('Senha atualizada com sucesso!')
      setRecoveryMode(false)
    } catch {
      setRecoveryErro('Erro ao atualizar a senha. Tente novamente.')
    } finally {
      setRecoveryCarregando(false)
    }
  }

  const nomeUsuario = user?.name || serverUser?.name || serverUser?.email || 'Agente'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Recovery Mode Banner */}
      {recoveryMode && (
        <div className="mb-6 bg-amber-50 border border-amber-300 rounded-lg p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-1">Redefinir Senha</h3>
              <p className="text-sm text-amber-700 mb-3">
                Você acessou via link de recuperação. Defina uma nova senha para continuar.
              </p>
              <AvisoInstalacaoIos></AvisoInstalacaoIos>
              <form onSubmit={handleAtualizarSenha} className="flex flex-wrap gap-3">
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha"
                  required
                  className="px-3 py-2 border border-amber-300 rounded bg-white text-sm focus:outline-none focus:border-amber-500"
                />
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirmar nova senha"
                  required
                  className="px-3 py-2 border border-amber-300 rounded bg-white text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={recoveryCarregando}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium disabled:opacity-60"
                >
                  {recoveryCarregando ? 'Salvando...' : 'Salvar Senha'}
                </button>
              </form>
              {recoveryErro && <p className="text-red-600 text-sm mt-2">{recoveryErro}</p>}
              {recoverySucesso && <p className="text-green-600 text-sm mt-2">{recoverySucesso}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-military-green uppercase tracking-wider">
          Bem-vindo, {nomeUsuario}
        </h1>
        <p className="text-gray-500 mt-1">
          {isChefia ? 'Painel da Administração · GMV' : 'Painel do Veterano · GMV'}
        </p>
      </div>

      <Link
    to="/perfil"
    className="flex items-center gap-2 px-5 py-2.5 bg-military-olive hover:bg-military-green text-white rounded font-semibold uppercase tracking-wider text-sm transition-colors w-full sm:w-auto justify-center"
  >
    <UserIcon className="w-4 h-4" />
    Meu Perfil
  </Link>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Próximas Atividades
              </p>
              <p className="text-3xl font-bold text-military-green mt-1">{proximosEventos.length}</p>
            </div>
            <div className="bg-military-olive/10 p-3 rounded-lg">
              <CalendarDays className="w-6 h-6 text-military-olive" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Minhas Inscrições
              </p>
              <p className="text-3xl font-bold text-military-green mt-1">{minhasInscricoes.length}</p>
            </div>
            <div className="bg-military-olive/10 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-military-olive" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total de Atividades
              </p>
              <p className="text-3xl font-bold text-military-green mt-1">{eventos.length}</p>
            </div>
            <div className="bg-military-olive/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-military-olive" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1">
            Próximas Atividades
          </h2>
          <Link
            to="/atividades"
            className="text-sm text-military-olive hover:underline font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {proximosEventos.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma atividade programada.</p>
            {isChefia && (
              <Link to="/chefia" className="text-military-olive hover:underline text-sm mt-2 inline-block">
                Criar nova atividade
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proximosEventos.slice(0, 6).map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                inscrito={eventosInscritos.includes(evento.id)}
                onInscricaoSucesso={handleInscricaoSucesso}
              />
            ))}
          </div>
        )}
      </div>

      {/* My Registrations */}
      {minhasInscricoes.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1 mb-4">
            Minhas Inscrições
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {minhasInscricoes.map((inscricao, idx) => {
              const evento = eventos.find((e) => e.id === inscricao.eventoId)
              if (!evento) return null
              const cat = categoriaConfig[evento.categoria]
              return (
                <div
                  key={inscricao.eventoId}
                  className={`flex items-center gap-4 p-4 ${idx < minhasInscricoes.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className={`${cat?.cor || 'bg-gray-600'} text-white p-2 rounded`}>
                    {cat?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{evento.titulo}</p>
                    <p className="text-sm text-gray-500">{formatarData(evento.data)} · {evento.local}</p>
                  </div>
                  <Link
                    to="/atividades/$id"
                    params={{ id: evento.id }}
                    className="text-sm text-military-olive hover:underline flex-shrink-0"
                  >
                    Detalhes
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function EventoCard({ evento, inscrito, onInscricaoSucesso }: { evento: Evento; inscrito: boolean; onInscricaoSucesso?: () => void }) {
  const cat = categoriaConfig[evento.categoria]
  const passado = new Date(evento.data) < new Date()

  const inscreverFN = useServerFn(inscreverUsuario)
  const [carregando,setCarregando] = useState(false)

  const handleParticipar = async (e: React.MouseEvent)=>{
    e.preventDefault();
    setCarregando(true);
    try{
      await inscreverFN({data:{eventoId: evento.id}})
      if (onInscricaoSucesso) onInscricaoSucesso()
      alert('Inscrição realizada com sucesso!')
    }catch(error){
      alert('Erro ao inscrever-se no evento. Tente novamente mais tarde');
    }finally{
      setCarregando(false);
    }
  }

  return (
    <Link
      to="/atividades/$id"
      params={{ id: evento.id }}
      className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:border-military-olive hover:shadow-md transition-all overflow-hidden"
    >
      <div className={`${cat?.cor || 'bg-gray-700'} px-4 py-3 flex items-center gap-2`}>
        <span className="text-white">{cat?.icon}</span>
        <span className="text-white text-xs font-bold uppercase tracking-wider">{cat?.label}</span>
        
        {/* Renderização condicional do botão ou status */}
        <div className="ml-auto">
          {inscrito ? (
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Inscrito
            </span>
          ) : passado ? (
            <span className="bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Encerrado
            </span>
          ) : (
            <button 
              onClick={handleParticipar}
              disabled={carregando}
              className="bg-white text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-70"
            >
              {carregando ? 'Aguarde...' : 'Participar'}
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{evento.titulo}</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-3.5 h-3.5 text-military-olive flex-shrink-0" />
            <span>{formatarData(evento.data)} {evento.horario ? `- ${evento.horario}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-military-olive flex-shrink-0" />
            <span className="truncate">{evento.local}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-3.5 h-3.5 text-military-olive flex-shrink-0" />
            <span>{evento.vagas} vagas</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
