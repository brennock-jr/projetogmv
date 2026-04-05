import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useIdentity } from '@/lib/identity-context'
import { Shield, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { BotaoInstalar } from './BotaoInstalar'

export function Header() {
  const { user, logout } = useIdentity()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isChefia = user?.roles?.includes('chefia')

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }

  const navLinks = [
    { to: '/dashboard', label: 'Painel' },
    { to: '/atividades', label: 'Atividades' },
    {to: '/perfil', label: 'Meu Perfil'},
    ...(isChefia ? [{ to: '/chefia', label: 'Chefia' }] : []),
  ]

  return (
    <header className="bg-military-green text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90">
            <div className="bg-military-gold rounded p-1.5">
              <img 
              src="/logo.png" 
              alt="logo-arredondada-gmv"
              className="w-8 h-8 object-contain"
              ></img>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-widest text-military-gold uppercase">GMV</span>
              <span className="text-[10px] text-gray-300 tracking-wider uppercase hidden sm:block">
                Grupo Missões Veteranos
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded text-sm font-medium uppercase tracking-wider transition-colors ${
                  location.pathname === link.to
                    ? 'bg-military-olive text-white'
                    : 'text-gray-300 hover:bg-military-olive/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <BotaoInstalar />
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name || user.email}</p>
                <p className="text-xs text-military-gold uppercase tracking-wider">
                  {isChefia ? 'Chefia' : 'Agente'}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-military-olive/60 hover:bg-military-olive px-3 py-1.5 rounded text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-military-green border-t border-military-olive/50">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-medium uppercase tracking-wider ${
                  location.pathname === link.to
                    ? 'bg-military-olive text-white'
                    : 'text-gray-300 hover:bg-military-olive/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-military-olive/50">
              {user && (
                <p className="px-3 py-1 text-xs text-military-gold uppercase tracking-wider">
                  {user.name || user.email} · {isChefia ? 'Chefia' : 'Agente'}
                </p>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-military-olive/50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
