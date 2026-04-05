import { useEffect } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'
import { IdentityProvider } from '@/lib/identity-context'
import { CallbackHandler } from '@/components/CallbackHandler'
import { Header } from '@/components/Header'
//import '@/styles.css'
import appCss from '@/styles.css?url'

const AUTH_ROUTES = ['/login', '/recuperar-senha']

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'GMV – Grupo Missões Veteranos' },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
  component: RootLayout,
})

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-military-green mb-4">404</h1>
      <p className="text-gray-600 mb-8">Página ou Missão não encontrada no sistema.</p>
      <a href="/dashboard" className="bg-military-olive text-white px-6 py-2 rounded">
        Voltar ao Painel
      </a>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <link rel="stylesheet" href={appCss} />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((error) => console.error('Service worker registration failed:', error))
    }
  }, [])

  return (
    <IdentityProvider>
      <CallbackHandler>
        <div className="min-h-screen bg-parchment">
          {!isAuthPage && <Header />}
          <Outlet />
        </div>
      </CallbackHandler>
    </IdentityProvider>
  )
}
