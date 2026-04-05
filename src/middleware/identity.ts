import { createMiddleware } from '@tanstack/react-start'
import { getUser, type User } from '@netlify/identity'

export const identityMiddleware = createMiddleware().server(async ({ next }) => {
  const user: User | null = (await getUser()) ?? null
  return next({ context: { user } })
})

export const requireAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getUser()
  if (!user) throw new Error('Autenticação necessária')
  return next({ context: { user } })
})

export function requireRoleMiddleware(role: string) {
  return createMiddleware().server(async ({ next }) => {
    const user = await getUser()
    if (!user) throw new Error('Autenticação necessária')
    if (!user.roles?.includes(role)) throw new Error(`Papel '${role}' necessário`)
    return next({ context: { user } })
  })
}
