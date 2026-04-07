import { createServerFn } from '@tanstack/react-start'
import { getGenericStore } from '@/lib/storage'
import { requireRoleMiddleware } from '@/middleware/identity'

export interface Usuario {
  id: string
  email: string
  nome: string
  papel: string
  criadoEm: string
  metadata?: {
    idade?: string
    altura?: string
    peso?: string
    tipoSanguineo?: string
    localServico?: string
    anoServico?: string
    foto?: string
  }
}

export const getUsuarios = createServerFn({ method: 'GET' })
  .middleware([requireRoleMiddleware('chefia')])
  .handler(async () => {
    const store = getGenericStore('gmv-usuarios')
    const blobs = await store.list()
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key)))
    return (results.filter(Boolean) as Usuario[]).sort(
      (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    )
  })

export const editarUsuario = createServerFn({ method: 'POST' })
  .middleware([requireRoleMiddleware('chefia')])
  .inputValidator(
    (data: {
      id: string
      nome: string
      email: string
      papel: string
      metadata?: any
    }) => data
  )
  .handler(async ({ data }) => {
    const store = getGenericStore('gmv-usuarios')
    const existente = await store.get(data.id) as Usuario | null
    
    const atualizado: Usuario = {
      id: data.id,
      email: data.email,
      nome: data.nome,
      papel: data.papel,
      criadoEm: existente?.criadoEm || new Date().toISOString(),
      metadata: data.metadata,
    }
    
    await store.set(data.id, atualizado)
    return atualizado
  })

export const criarUsuario = createServerFn({ method: 'POST' })
  .middleware([requireRoleMiddleware('chefia')])
  .inputValidator(
    (data: {
      nome: string
      email: string
      papel: string
    }) => data
  )
  .handler(async ({ data }) => {
    const store = getGenericStore('gmv-usuarios')
    const id = crypto.randomUUID()
    const novo: Usuario = {
      id,
      email: data.email,
      nome: data.nome,
      papel: data.papel,
      criadoEm: new Date().toISOString(),
    }
    await store.set(id, novo)
    return novo
  })
