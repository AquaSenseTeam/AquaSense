
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  TriangleAlert,
  CirclePlus,
  ChartNoAxesColumn,
  Bell,
  User,
  CircleHelp,
} from 'lucide-react'

const itens = [
  { to: '/inicio', rotulo: 'Início', Icone: Home },
  { to: '/ocorrencias', rotulo: 'Minhas ocorrências', Icone: TriangleAlert, end: true },
  { to: '/ocorrencias/nova', rotulo: 'Registrar ocorrência', Icone: CirclePlus },
  { to: '/consumo', rotulo: 'Meu consumo', Icone: ChartNoAxesColumn },
  { to: '/notificacoes', rotulo: 'Notificações', Icone: Bell },
  { to: '/perfil', rotulo: 'Perfil', Icone: User },
  { to: '/perfil/ajuda', rotulo: 'Ajuda', Icone: CircleHelp },
]

interface SidebarProps {
  naoLidas: number
  mobile?: boolean
  onNavigate?: () => void
}

export default function Sidebar({
  naoLidas,
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <aside
      className={`w-64 shrink-0 bg-aqua-900 p-3 text-white ${
        mobile ? 'h-full' : 'hidden w-56 md:block'
      }`}
    >
      <nav className="flex flex-col gap-1">
        {itens.map(({ to, rotulo, Icone, end }) => (
          <NavLink
            key={rotulo}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) => {
              const naAjuda = pathname.startsWith('/perfil/ajuda')
              const ativo =
                rotulo === 'Perfil'
                  ? isActive && !naAjuda
                  : isActive

              return `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                ativo ? 'bg-aqua-600' : 'hover:bg-aqua-700'
              }`
            }}
          >
            <Icone className="h-4 w-4" />
            <span className="flex-1">{rotulo}</span>

            {rotulo === 'Notificações' && naoLidas > 0 && (
              <span className="rounded-full bg-orange-500 px-2 text-xs">
                {naoLidas}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
