import { useEffect, useState } from 'react'
import { Bell, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usuarioService } from '../services/usuarioService'
import Logo from './Logo'

export default function Topbar({ naoLidas }: { naoLidas: number }) {
  const { usuario } = useAuth()
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)

  useEffect(() => {
    let ativo = true
    let url: string | null = null

    setFotoUrl(null)

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
  }, [usuario?.email])

  return (
    <header className="flex items-center gap-4 bg-white px-4 py-2 shadow-sm">
      <Logo />

      <div className="relative mx-auto hidden w-full max-w-xl sm:block">
        <Search className="absolute left-3 top-1.5 h-4 w-4 text-aqua-600" />
        <input
          className="input w-full pl-9 focus:outline-none"
          placeholder="Buscar por endereço, ocorrência ou número..."
        />
      </div>

      <Link to="/notificacoes" aria-label="Notificações" className="relative ml-auto">
        <Bell className="h-5 w-5" />

        {naoLidas > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
            {naoLidas}
          </span>
        )}
      </Link>

      <Link
        to="/perfil"
        aria-label="Meu perfil"
        className="flex shrink-0 items-center gap-2 text-sm"
      >
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt="Foto de perfil"
            className="h-8 w-8 rounded-full border border-aqua-100 object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-aqua-100 text-aqua-600">
            <User className="h-5 w-5" />
          </span>
        )}

        <span className="hidden sm:inline">
          {usuario?.nomeCompleto}
        </span>
      </Link>
    </header>
  )
}