
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2 } from 'lucide-react'

const itens = [
  {
    to: '/admin',
    rotulo: 'Visão geral',
    Icone: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/empresas',
    rotulo: 'Empresas',
    Icone: Building2,
  },
]

interface AdminSidebarProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function AdminSidebar({
  mobile = false,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <aside
      className={`shrink-0 bg-aqua-900 p-3 text-white ${
        mobile ? 'h-full w-64' : 'hidden w-56 md:block'
      }`}
    >
      <nav className="flex flex-col gap-1">
        {itens.map(({ to, rotulo, Icone, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                isActive
                  ? 'bg-aqua-600'
                  : 'hover:bg-aqua-700'
              }`
            }
          >
            <Icone className="h-4 w-4" />
            <span>{rotulo}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
