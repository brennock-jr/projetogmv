import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { getServerUser } from '@/lib/auth'
import { getEventos } from '@/server/eventos.functions'
import { CalendarDays, MapPin, Users, Tent, Mountain, ArrowDownToLine, Target, Search } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { Evento, CategoriaAtividade } from '@/server/eventos.functions'

export const Route = createFileRoute('/atividades')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  loader: async () => {
    const eventos = await getEventos()
    return { eventos }
  },
  component: AtividadesPage,
})

const categorias: { value: CategoriaAtividade | 'Todas'; label: string; icon?: ReactNode }[] = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Acampamento', label: 'Acampamento', icon: <Tent className="w-4 h-4" /> },
  { value: 'Trilha', label: 'Trilha', icon: <Mountain className="w-4 h-4" /> },
  { value: 'Rapel', label: 'Rapel', icon: <ArrowDownToLine className="w-4 h-4" /> },
  { value: 'Airsoft', label: 'Airsoft', icon: <Target className="w-4 h-4" /> },
]

const categoriaConfig: Record<string, { icon: ReactNode; cor: string }> = {
  Acampamento: { icon: <Tent className="w-4 h-4" />, cor: 'bg-green-700' },
  Trilha: { icon: <Mountain className="w-4 h-4" />, cor: 'bg-amber-700' },
  Rapel: { icon: <ArrowDownToLine className="w-4 h-4" />, cor: 'bg-blue-700' },
  Airsoft: { icon: <Target className="w-4 h-4" />, cor: 'bg-gray-700' },
}

function formatarData(dataStr: string) {
  return new Date(dataStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function AtividadesPage() {
  const { eventos } = Route.useLoaderData()
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaAtividade | 'Todas'>('Todas')
  const [busca, setBusca] = useState('')
  const [mostrarPassadas, setMostrarPassadas] = useState(false)

  const agora = new Date()

  const eventosFiltrados = eventos.filter((e) => {
    const passado = new Date(e.data) < agora
    if (!mostrarPassadas && passado) return false
    if (categoriaFiltro !== 'Todas' && e.categoria !== categoriaFiltro) return false
    if (busca && !e.titulo.toLowerCase().includes(busca.toLowerCase()) && !e.local.toLowerCase().includes(busca.toLowerCase())) return false
    return true
  })

  const proximos = eventosFiltrados.filter((e) => new Date(e.data) >= agora)
  const passados = eventosFiltrados.filter((e) => new Date(e.data) < agora)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-military-green uppercase tracking-wider">
          Atividades
        </h1>
        <p className="text-gray-500 mt-1">Explore e inscreva-se nas atividades do GMV</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou local..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-military-olive"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoriaFiltro(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  categoriaFiltro === cat.value
                    ? 'bg-military-olive text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Past events toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={mostrarPassadas}
              onChange={(e) => setMostrarPassadas(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mostrar passadas
          </label>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Nenhuma atividade encontrada.</p>
          <p className="text-sm mt-1">Tente ajustar os filtros de busca.</p>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {proximos.length > 0 && (
            <section className="mb-8">
              <h2 className="text-base font-bold text-military-green uppercase tracking-wider border-b-2 border-military-gold pb-1 mb-4">
                Próximas — {proximos.length} {proximos.length === 1 ? 'atividade' : 'atividades'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proximos.map((evento) => (
                  <AtividadeCard key={evento.id} evento={evento} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {mostrarPassadas && passados.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-500 uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-4">
                Realizadas — {passados.length} {passados.length === 1 ? 'atividade' : 'atividades'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {passados.map((evento) => (
                  <AtividadeCard key={evento.id} evento={evento} passado />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function AtividadeCard({ evento, passado }: { evento: Evento; passado?: boolean }) {
  const cat = categoriaConfig[evento.categoria]

  return (
    <Link
      to="/atividades/$id"
      params={{ id: evento.id }}
      className={`block bg-white rounded-lg border shadow-sm hover:shadow-md transition-all overflow-hidden ${
        passado ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:border-military-olive'
      }`}
    >
      <div className={`${passado ? 'bg-gray-500' : (cat?.cor || 'bg-gray-700')} px-4 py-3 flex items-center gap-2`}>
        <span className="text-white">{cat?.icon}</span>
        <span className="text-white text-xs font-bold uppercase tracking-wider">
          {evento.categoria}
        </span>
        {passado && (
          <span className="ml-auto bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
            Encerrado
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">{evento.titulo}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-3.5 h-3.5 text-military-olive flex-shrink-0" />
            <span>{formatarData(evento.data)}</span>
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
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2">{evento.descricao}</p>
        </div>
      </div>
    </Link>
  )
}
