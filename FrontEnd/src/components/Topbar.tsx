
import { useEffect, useState } from 'react'
import {
  Bell,
  Search,
  User,
  Building2,
  Menu,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usuarioService } from '../services/usuarioService'
import Logo from './Logo'

interface TopbarProps {
  naoLidas: number
  onMenuClick?: () => void
  menuAberto?: boolean
}

export default function Topbar({
  naoLidas,
  onMenuClick,
  menuAberto = false,
}: TopbarProps) {
  const { usuario } = useAuth()
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)

  const isAdmin = usuario?.tipo === 'ADMIN'
  const isEmpresa = usuario?.tipo === 'EMPRESA'
  const isMorador = usuario?.tipo === 'MORADOR'

  const rotaNotificacoes = isEmpresa
    ? '/empresa/notificacoes'
    : '/notificacoes'

  const rotaPerfil = isAdmin
    ? '/admin'
    : isEmpresa
      ? '/empresa/perfil'
      : '/perfil'

  useEffect(() => {
    let ativo = true
    let url: string | null = null

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFotoUrl(null)

    // Por enquanto, somente moradores possuem foto de perfil.
    if (!isMorador) return

    usuarioService.obterFotoPerfil()
      .then(async (resposta) => {
        const blob = await resposta.blob()

        if (!ativo) return

        url = URL.createObjectURL(blob)
        setFotoUrl(url)
      })
      .catch(() => {
        // Exibe o avatar padrão se não houver foto.
      })

    return () => {
      ativo = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [usuario?.email, isMorador])

  return (
    <header className="relative z-30 flex h-[74px] shrink-0 items-center gap-3 border-b bg-white px-3 shadow-sm sm:px-5">

      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-aqua-900 transition hover:bg-aqua-50 md:hidden"
        >
          {menuAberto ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      <Logo />

      <div className="relative mx-auto hidden w-full max-w-xl sm:block">
        <Search className="absolute left-3 top-1.5 h-4 w-4 text-aqua-600" />
        <input
          className="input w-full pl-9 focus:outline-none"
          placeholder="Buscar por endereço, ocorrência ou número..."
        />
      </div>

      {!isAdmin && (
        <Link
          to={rotaNotificacoes}
          aria-label="Notificações"
          className="relative ml-auto shrink-0"
        >
          <Bell className="h-5 w-5" />

          {naoLidas > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
              {naoLidas}
            </span>
          )}
        </Link>
      )}

      <Link
        to={rotaPerfil}
        aria-label={isEmpresa ? 'Dados da empresa' : 'Meu perfil'}
        className={`flex shrink-0 items-center gap-2 text-sm ${
          isAdmin ? 'ml-auto' : ''
        }`}
      >
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt="Foto de perfil"
            className="h-8 w-8 rounded-full border border-aqua-100 object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-aqua-100 text-aqua-600">
            {isEmpresa ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </span>
        )}

        <span className="hidden sm:inline">
          {usuario?.nomeCompleto}
        </span>
      </Link>
    </header>
  )
}
