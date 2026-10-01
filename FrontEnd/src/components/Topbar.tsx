import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Topbar({ naoLidas }: { naoLidas: number }) {
  const { usuario } = useAuth()
  return (
    <header className="flex items-center gap-4 bg-white px-4 py-2 shadow-sm">
      <div className="relative mx-auto hidden w-full max-w-xl sm:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-aqua-600" />
        <input className="input pl-9" placeholder="Buscar por endereço, ocorrência ou número..." />
      </div>
      <Link to="/notificacoes" className="relative ml-auto">
        <Bell className="h-5 w-5" />
        {naoLidas > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
            {naoLidas}
          </span>
        )}
      </Link>
      <Link to="/perfil" className="flex items-center gap-2 text-sm">
        <span className="h-8 w-8 rounded-full bg-aqua-100" />
        <span className="hidden sm:inline">{usuario?.nomeCompleto}</span>
      </Link>
    </header>
  )
}
