import { createMiddleware } from '@tanstack/react-start'

export interface User {
  id: string
  email: string
  roles: string[]
  user_metadata: {
    full_name?: string
    idade?: string
    altura?: string
    peso?: string
    termoAceite?: boolean
    [key: string]: any
  }
}

// Mock de autenticação para portabilidade Vercel
// Em produção, use um provider como Clerk, Auth0 ou Supabase Auth
async function getAuthenticatedUser(): Promise<User | null> {
  // Para fins de demonstração/protótipo sem Netlify Identity:
  // Tenta recuperar de um cookie ou header (simulado aqui)
  return null 
}

export const identityMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuthenticatedUser()
  return next({ context: { user } })
})

export const requireAuthMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuthenticatedUser()
  if (!user) throw new Error('Autenticação necessária')
  return next({ context: { user } })
})

export function requireRoleMiddleware(role: string) {
  return createMiddleware().server(async ({ next }) => {
    const user = await getAuthenticatedUser()
    if (!user) throw new Error('Autenticação necessária')
    if (!user.roles?.includes(role)) throw new Error(`Papel '${role}' necessário`)
    return next({ context: { user } })
  })
}
