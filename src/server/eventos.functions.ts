import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import { requireAuthMiddleware, requireRoleMiddleware } from '@/middleware/identity'

export type CategoriaAtividade = 'Acampamento' | 'Trilha' | 'Rapel' | 'Airsoft'

export interface Evento {
  id: string
  titulo: string
  descricao: string
  categoria: CategoriaAtividade
  data: string
  horario: string
  local: string
  vagas: number
  criadorId: string
  criadoEm: string
}

export const getEventos = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async () => {
    const store = getStore({ name: 'gmv-eventos', consistency: 'strong' })
    const { blobs } = await store.list()
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
    return (results.filter(Boolean) as Evento[]).sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
    )
  })

export const getEvento = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const store = getStore({ name: 'gmv-eventos', consistency: 'strong' })
    return store.get(data.id, { type: 'json' }) as Promise<Evento | null>
  })

export const criarEvento = createServerFn({ method: 'POST' })
  .middleware([requireRoleMiddleware('chefia')])
  .inputValidator(
    (data: {
      titulo: string
      descricao: string
      categoria: string
      data: string
      horario: string
      local: string
      vagas: number
    }) => data
  )
  .handler(async ({ data, context }) => {
    const store = getStore({ name: 'gmv-eventos', consistency: 'strong' })
    const id = crypto.randomUUID()
    const evento: Evento = {
      id,
      titulo: data.titulo,
      descricao: data.descricao,
      categoria: data.categoria as CategoriaAtividade,
      data: data.data,
      horario: data.horario,
      local: data.local,
      vagas: data.vagas,
      criadorId: context.user.id,
      criadoEm: new Date().toISOString(),
    }
    await store.setJSON(id, evento)
    return evento
  })

export const deletarEvento = createServerFn({ method: 'POST' })
  .middleware([requireRoleMiddleware('chefia')])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const store = getStore({ name: 'gmv-eventos', consistency: 'strong' })
    await store.delete(data.id)
    return { sucesso: true }
  })
