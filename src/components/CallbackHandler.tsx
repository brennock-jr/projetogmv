import { useEffect } from 'react'
import { handleAuthCallback } from '@netlify/identity'
import { useNavigate } from '@tanstack/react-router'

const AUTH_HASH_PATTERN =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

export function CallbackHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (AUTH_HASH_PATTERN.test(window.location.hash)) {
      handleAuthCallback()
        .then((result) => {
          if (!result) return
          if (result.type === 'recovery') {
            sessionStorage.setItem('gmv_recovery_mode', 'true')
            navigate({ to: '/dashboard' })
          } else if (result.type === 'confirmation' || result.type === 'oauth' || result.type === 'invite') {
            navigate({ to: '/dashboard' })
          }
        })
        .catch(console.error)
    }
  }, [])

  return <>{children}</>
}
