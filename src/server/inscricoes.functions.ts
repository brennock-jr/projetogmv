import { createServerFn } from '@tanstack/react-start'
import { getGenericStore } from '@/lib/storage'
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
    const store = getGenericStore('gmv-inscricoes')
    const blobs = await store.list({ prefix: `${data.eventoId}/` })
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key)))
    return results.filter(Boolean) as Inscricao[]
  })

export const getMinhasInscricoes = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    const store = getGenericStore('gmv-inscricoes')
    const blobs = await store.list()
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key)))
    return (results.filter(Boolean) as Inscricao[]).filter(
      (i) => i.userId === context.user.id
    )
  })

export const inscreverUsuario = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const user = context.user
    const meta = user.user_metadata || {}

    // Validação rigorosa de perfil
    const camposObrigatorios = ['idade', 'altura', 'peso', 'termoAceite']
    const pendentes = camposObrigatorios.filter(campo => !meta[campo])

    if (pendentes.length > 0) {
      if (pendentes.includes('termoAceite')) {
        throw new Error('Você precisa aceitar o termo de consentimento no seu perfil antes de se inscrever.')
      }
      throw new Error('Perfil incompleto. Preencha sua idade, altura e peso no menu Perfil.')
    }

    const store = getGenericStore('gmv-inscricoes')
    const key = `${data.eventoId}/${user.id}`
    const existente = await store.get(key)
    if (existente !== null) throw new Error('Você já está inscrito nesta atividade')
    const inscricao: Inscricao = {
      eventoId: data.eventoId,
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || user.email || 'Agente GMV',
      inscritoEm: new Date().toISOString(),
    }
    await store.set(key, inscricao)
    return inscricao
  })

export const cancelarInscricao = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const store = getGenericStore('gmv-inscricoes')
    const key = `${data.eventoId}/${context.user.id}`
    await store.delete(key)
    return { sucesso: true }
  })

export const verificarInscricao = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .inputValidator((data: { eventoId: string }) => data)
  .handler(async ({ data, context }) => {
    const store = getGenericStore('gmv-inscricoes')
    const key = `${data.eventoId}/${context.user.id}`
    const inscricao = await store.get(key)
    return { inscrito: inscricao !== null }
  })

