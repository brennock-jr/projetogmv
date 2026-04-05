import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import { requireAuthMiddleware } from '@/middleware/identity'

export interface Inscricao {
  eventoId: string
  userId: string
  userEmail: string
  userName: string
  inscritoEm: string
}

export const getInscricoesEvento = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data }) => {
    const store = getStore({ name: 'gmv-inscricoes', consistency: 'strong' })
    const { blobs } = await store.list({ prefix: `${data.eventoId}/` })
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
    return results.filter(Boolean) as Inscricao[]
  })

export const getMinhasInscricoes = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    const store = getStore({ name: 'gmv-inscricoes', consistency: 'strong' })
    const { blobs } = await store.list()
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
    return (results.filter(Boolean) as Inscricao[]).filter(
      (i) => i.userId === context.user.id
    )
  })

export const inscreverUsuario = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const store = getStore({ name: 'gmv-inscricoes', consistency: 'strong' })
    const key = `${data.eventoId}/${context.user.id}`
    const existente = await store.get(key)
    if (existente !== null) throw new Error('Você já está inscrito nesta atividade')
    const inscricao: Inscricao = {
      eventoId: data.eventoId,
      userId: context.user.id,
      userEmail: context.user.email || '',
      userName: context.user.name || context.user.email || 'Agente GMV',
      inscritoEm: new Date().toISOString(),
    }
    await store.setJSON(key, inscricao)
    return inscricao
  })

export const cancelarInscricao = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const store = getStore({ name: 'gmv-inscricoes', consistency: 'strong' })
    const key = `${data.eventoId}/${context.user.id}`
    await store.delete(key)
    return { sucesso: true }
  })

export const verificarInscricao = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const store = getStore({ name: 'gmv-inscricoes', consistency: 'strong' })
    const key = `${data.eventoId}/${context.user.id}`
    const inscricao = await store.get(key)
    return { inscrito: inscricao !== null }
  })
