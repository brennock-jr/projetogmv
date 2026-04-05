import { createServerFn } from '@tanstack/react-start'
import { getUser } from '@netlify/identity'

export const getServerUser = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getUser()
  return (user ?? null) as any
})
