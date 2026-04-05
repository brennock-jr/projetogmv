import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { getServerUser } from '@/lib/auth'
import { getEventos, criarEvento, deletarEvento } from '@/server/eventos.functions'
import { getUsuarios } from '@/server/usuarios.functions'
import { useServerFn } from '@tanstack/react-start'
import {
  CalendarDays,
  MapPin,
  Users,
  Tent,
  Mountain,
  ArrowDownToLine,
  Target,
  Plus,
  Trash2,
  X,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { Evento, CategoriaAtividade } from '@/server/eventos.functions'
import { getInscricoesEvento , type Inscricao} from '@/server/inscricoes.functions'

export const Route = createFileRoute('/chefia')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    if (!user.roles?.includes('chefia')) throw redirect({ to: '/dashboard' })
    return { user }
  },
  loader: async () => {
    const [eventos, usuarios] = await Promise.all([getEventos(), getUsuarios()])
    return { eventos, usuarios }
  },
  component: ChefiaPage,
})

const categoriaConfig: Record<string, { icon: ReactNode; cor: string }> = {
  Acampamento: { icon: <Tent className="w-4 h-4" />, cor: 'bg-green-700' },
  Trilha: { icon: <Mountain className="w-4 h-4" />, cor: 'bg-amber-700' },
  Rapel: { icon: <ArrowDownToLine className="w-4 h-4" />, cor: 'bg-blue-700' },
  Airsoft: { icon: <Target className="w-4 h-4" />, cor: 'bg-gray-700' },
}

const CATEGORIAS: CategoriaAtividade[] = ['Acampamento', 'Trilha', 'Rapel', 'Airsoft']

function formatarData(dataStr: string) {
  return new Date(dataStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function ChefiaPage() {
  const { eventos: eventosIniciais, usuarios } = Route.useLoaderData()
  const [tab, setTab] = useState<'eventos' | 'usuarios'>('eventos')
  const [eventos, setEventos] = useState(eventosIniciais)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  
  // Estados para controle da visualização de inscritos
  const verInscritosFn = useServerFn(getInscricoesEvento)
  const [eventoExpandido, setEventoExpandido] = useState<string | null>(null)
  const [listaInscritos, setListaInscritos] = useState<Inscricao[]>([])
  const [carregandoLista, setCarregandoLista] = useState(false)

  const criarFn = useServerFn(criarEvento)
  const deletarFn = useServerFn(deletarEvento)

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Acampamento' as CategoriaAtividade,
    data: '',
    horario: '',
    local: '',
    vagas: 20,
  })

  const agora = new Date()
  const proximosEventos = eventos.filter((e) => new Date(e.data) >= agora)
  const eventosPassados = eventos.filter((e) => new Date(e.data) < agora)

  const handleCriarEvento = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    setMensagem('')
    try {
      const novo = await criarFn({ data: { ...form, vagas: Number(form.vagas) } })
      setEventos((prev) =>
        [...prev, novo].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      )
      setMostrarFormulario(false)
      setForm({ titulo: '', descricao: '', categoria: 'Acampamento', data: '', horario: '', local: '', vagas: 20 })
      setMensagem('Atividade criada com sucesso!')
    } catch (err) {
      setErro((err as Error).message || 'Erro ao criar atividade.')
    } finally {
      setCarregando(false)
    }
  }

  const handleDeletar = async (id: string) => {
    setCarregando(true)
    setErro('')
    try {
      await deletarFn({ data: { id } })
      setEventos((prev) => prev.filter((e) => e.id !== id))
      setConfirmDelete(null)
      setMensagem('Atividade removida.')
    } catch (err) {
      setErro((err as Error).message || 'Erro ao remover atividade.')
    } finally {
      setCarregando(false)
    }
  }

  const handleVerInscritos = async (eventoId: string)=>{
    if(eventoExpandido === eventoId){
      setEventoExpandido(null); //Recolhe a lista caso esteja aberta
      return;
    }
    setEventoExpandido(eventoId);
    setCarregandoLista(true);
    try{
      const inscritos = await verInscritosFn({data:{eventoId}})
      setListaInscritos(inscritos);
    }catch(err){
      setErro('Erro ao carregar lista de inscritos')
    }finally{
      setCarregando(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-military-gold p-2 rounded">
          <Shield className="w-6 h-6 text-military-green" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-military-green uppercase tracking-wider">
            Painel da Chefia
          </h1>
          <p className="text-gray-500 text-sm">Gestão de atividades e participantes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total de Atividades', value: eventos.length, icon: <CalendarDays className="w-5 h-5" /> },
          { label: 'Atividades Futuras', value: proximosEventos.length, icon: <CalendarDays className="w-5 h-5" /> },
          { label: 'Usuários Cadastrados', value: usuarios.length, icon: <Users className="w-5 h-5" /> },
          { label: 'Realizadas', value: eventosPassados.length, icon: <Target className="w-5 h-5" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-tight">
                {stat.label}
              </p>
              <span className="text-military-olive">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-military-green">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('eventos')}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            tab === 'eventos'
              ? 'border-military-olive text-military-olive'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Atividades
        </button>
        <button
          onClick={() => setTab('usuarios')}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
            tab === 'usuarios'
              ? 'border-military-olive text-military-olive'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Usuários
        </button>
      </div>

      {/* Messages */}
      {mensagem && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center justify-between">
          <span>{mensagem}</span>
          <button onClick={() => setMensagem('')}><X className="w-4 h-4" /></button>
        </div>
      )}
      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center justify-between">
          <span>{erro}</span>
          <button onClick={() => setErro('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Eventos Tab */}
      {tab === 'eventos' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-military-green uppercase tracking-wider text-base">
              Atividades ({eventos.length})
            </h2>
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="flex items-center gap-2 bg-military-olive hover:bg-military-green text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              {mostrarFormulario ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {mostrarFormulario ? 'Cancelar' : 'Nova Atividade'}
            </button>
          </div>

          {/* Create Form */}
          {mostrarFormulario && (
            <div className="bg-parchment border-2 border-military-olive rounded-lg p-6 mb-6">
              <h3 className="font-bold text-military-green uppercase tracking-wider mb-4 text-sm">
                Criar Nova Atividade
              </h3>
              <form onSubmit={handleCriarEvento} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                    placeholder="Ex: Acampamento Serra da Canastra"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    required
                    rows={3}
                    placeholder="Descreva a atividade, equipamentos necessários, nível de dificuldade..."
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Categoria *
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaAtividade })}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  />
                  <input 
                    type="time"
                    value={form.horario}
                    onChange={(e) => setForm({ ...form, horario: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Local *
                  </label>
                  <input
                    type="text"
                    value={form.local}
                    onChange={(e) => setForm({ ...form, local: e.target.value })}
                    required
                    placeholder="Ex: Parque Nacional da Serra do Cipó, MG"
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Vagas *
                  </label>
                  <input
                    type="number"
                    value={form.vagas}
                    onChange={(e) => setForm({ ...form, vagas: Number(e.target.value) })}
                    required
                    min={1}
                    max={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-military-olive"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={carregando}
                    className="px-6 py-2.5 bg-military-olive hover:bg-military-green text-white rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60"
                  >
                    {carregando ? 'Salvando...' : 'Criar Atividade'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMostrarFormulario(false)}
                    className="px-6 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          {eventos.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma atividade cadastrada.</p>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="text-military-olive hover:underline text-sm mt-2"
              >
                Criar a primeira atividade
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {eventos.map((evento) => {
                const passado = new Date(evento.data) < agora
                const cat = categoriaConfig[evento.categoria]
                return (
                  <div
                    key={evento.id}
                    className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
                      confirmDelete === evento.id ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-stretch">
                      <div className={`${passado ? 'bg-gray-500' : (cat?.cor || 'bg-gray-700')} w-1.5 flex-shrink-0`} />
                      <div className="flex-1 px-4 py-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`${passado ? 'text-gray-400' : 'text-military-olive'}`}>
                            {cat?.icon}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {evento.categoria}
                          </span>
                          {passado && (
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Encerrado
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 flex-1 min-w-0">{evento.titulo}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 flex-shrink-0">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatarData(evento.data)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {evento.local}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {evento.vagas} vagas
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleVerInscritos(evento.id)}
                            className="px-3 py-1.5 text-xs font-semibold border border-military-gold text-military-gold hover:bg-military-gold hover:text-white rounded transition-colors uppercase tracking-wider"
                          >
                            {eventoExpandido === evento.id ? 'Ocultar' : 'Inscritos'}
                         </button>
                          <Link
                            to="/atividades/$id"
                            params={{ id: evento.id }}
                            className="px-3 py-1.5 text-xs border border-military-olive text-military-olive hover:bg-military-olive hover:text-white rounded transition-colors"
                          >
                            Ver
                          </Link>
                          {confirmDelete === evento.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-600 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Confirmar?
                              </span>
                              <button
                                onClick={() => handleDeletar(evento.id)}
                                disabled={carregando}
                                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                              >
                                Sim, remover
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(evento.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                              title="Remover atividade"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* NOVO BLOCO: Lista Expansível de Inscritos */}
    {eventoExpandido === evento.id && (
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-military-olive" />
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Dossiê de Inscritos ({listaInscritos.length})
          </h4>
        </div>
        
        {carregandoLista ? (
          <p className="text-sm text-gray-500 animate-pulse">Consultando registros...</p>
        ) : listaInscritos.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Nenhum agente escalado para esta missão ainda.</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {listaInscritos.map((inscrito, idx) => (
              <li key={inscrito.userId} className="text-sm bg-white border border-gray-200 p-2 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 shadow-sm">
                <div>
                  <span className="font-bold text-gray-900 block sm:inline">{idx + 1}. {inscrito.userName}</span>
                  <span className="text-gray-500 text-xs sm:ml-2 block sm:inline">{inscrito.userEmail}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Inscrito em: {new Date(inscrito.inscritoEm).toLocaleDateString('pt-BR')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Usuarios Tab */}
      {tab === 'usuarios' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-military-green uppercase tracking-wider text-base">
              Usuários Cadastrados ({usuarios.length})
            </h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800 flex gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Para alterar o papel de um usuário (promover para Chefia), acesse o{' '}
              <strong>Painel do Netlify → Identity → Usuários</strong> e edite o campo{' '}
              <code className="bg-amber-100 px-1 rounded">app_metadata.roles</code>.
            </p>
          </div>

          {usuarios.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum usuário cadastrado ainda.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="col-span-1">#</span>
                <span className="col-span-4">Nome</span>
                <span className="col-span-4">Email</span>
                <span className="col-span-2">Papel</span>
                <span className="col-span-1">Desde</span>
              </div>
              <div className="divide-y divide-gray-100">
                {usuarios.map((usuario, idx) => (
                  <div key={usuario.id} className="px-4 py-3 grid grid-cols-12 text-sm items-center">
                    <span className="col-span-1 text-gray-400">{idx + 1}</span>
                    <span className="col-span-4 font-medium text-gray-900 truncate">{usuario.nome}</span>
                    <span className="col-span-4 text-gray-600 truncate">{usuario.email}</span>
                    <span className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        usuario.papel === 'chefia'
                          ? 'bg-military-gold/20 text-military-green'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {usuario.papel === 'chefia' ? <Shield className="w-3 h-3" /> : null}
                        {usuario.papel}
                      </span>
                    </span>
                    <span className="col-span-1 text-gray-400 text-xs">
                      {new Date(usuario.criadoEm).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
