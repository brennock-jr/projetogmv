import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  login,
  signup,
  requestPasswordRecovery,
  AuthError,
  MissingIdentityError,
} from '@netlify/identity'
import { useIdentity } from '@/lib/identity-context'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Tab = 'login' | 'cadastro' | 'recuperar'

function LoginPage() {
  const { user, ready } = useIdentity()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (ready && user) {
      navigate({ to: '/dashboard' })
    }
  }, [ready, user])

  const limparMensagens = () => {
    setErro('')
    setSucesso('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    limparMensagens()
    setCarregando(true)
    try {
      await login(email, senha)
      navigate({ to: '/dashboard' })
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        setErro('Serviço de autenticação indisponível.')
      } else if (err instanceof AuthError) {
        if (err.status === 401) setErro('Email ou senha inválidos.')
        else setErro(err.message)
      } else {
        setErro('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    limparMensagens()
    setCarregando(true)
    try {
      const u = await signup(email, senha, { full_name: nome })
      if ((u as any).emailVerified) {
        navigate({ to: '/dashboard' })
      } else {
        setSucesso(`Conta criada! Verifique seu email (${email}) para confirmar o cadastro.`)
      }
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.status === 403) setErro('Cadastro de novos usuários não está disponível.')
        else if (err.status === 422) setErro('Email inválido ou senha muito fraca (mínimo 6 caracteres).')
        else setErro(err.message)
      } else {
        setErro('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault()
    limparMensagens()
    setCarregando(true)
    try {
      await requestPasswordRecovery(email)
      setSucesso(`Email de recuperação enviado para ${email}. Verifique sua caixa de entrada.`)
    } catch (err) {
      if (err instanceof AuthError) setErro(err.message)
      else setErro('Ocorreu um erro. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
   <div className="min-h-screen bg-military-green flex flex-col items-center justify-center px-4 py-12">
      {/* Emblem */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-military-gold rounded-full mb-4 shadow-xl overflow-hidden">
          <img src="/logo.png" alt="GMV Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">GMV</h1>
        <p className="text-military-gold text-sm tracking-widest uppercase mt-1">
          Grupo Missões Veteranos
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-parchment rounded-lg shadow-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-parchment-dark">
          {[
            { key: 'login', label: 'Entrar' },
            { key: 'cadastro', label: 'Cadastrar' },
            { key: 'recuperar', label: 'Recuperar Senha' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as Tab); limparMensagens() }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tab === t.key
                  ? 'bg-military-olive text-white'
                  : 'text-gray-600 hover:bg-parchment-dark'
              } ${t.key === 'recuperar' ? 'hidden' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Messages */}
          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {erro}
            </div>
          )}
          {sucesso && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {sucesso}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60"
              >
                {carregando ? 'Aguarde...' : 'Entrar'}
              </button>
              <button
                type="button"
                onClick={() => { setTab('recuperar'); limparMensagens() }}
                className="w-full text-center text-xs text-military-olive hover:underline mt-1"
              >
                Esqueci minha senha
              </button>
            </form>
          )}

          {/* Cadastro Form */}
          {tab === 'cadastro' && (
            <form onSubmit={handleCadastro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Seu nome"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60"
              >
                {carregando ? 'Aguarde...' : 'Criar Conta'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Após o cadastro, confirme seu email para ativar a conta. Novos usuários recebem o papel de <strong>Agente</strong>.
              </p>
            </form>
          )}

          {/* Recuperar Senha Form */}
          {tab === 'recuperar' && (
            <form onSubmit={handleRecuperar} className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Informe seu email para receber o link de recuperação de senha.
              </p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-military-olive text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-military-olive hover:bg-military-green text-white py-2.5 rounded font-semibold uppercase tracking-wider text-sm transition-colors disabled:opacity-60"
              >
                {carregando ? 'Aguarde...' : 'Enviar Link'}
              </button>
              <button
                type="button"
                onClick={() => { setTab('login'); limparMensagens() }}
                className="w-full text-center text-xs text-military-olive hover:underline"
              >
                Voltar para o login
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        GMV © {new Date().getFullYear()} · Todos os direitos reservados
      </p>
    </div>
  )
}
