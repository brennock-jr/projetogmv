import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import { requireRoleMiddleware } from '@/middleware/identity'

export interface Usuario {
  id: string
  email: string
  nome: string
  papel: string
  criadoEm: string
}

export const getUsuarios = createServerFn({ method: 'GET' })
  .middleware([requireRoleMiddleware('chefia')])
  .handler(async () => {
    const store = getStore({ name: 'gmv-usuarios', consistency: 'strong' })
    const { blobs } = await store.list()
    if (!blobs.length) return []
    const results = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' })))
    return (results.filter(Boolean) as Usuario[]).sort(
      (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    )
  })
