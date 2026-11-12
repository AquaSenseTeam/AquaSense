
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../contexts/AuthContext'
import { notificacaoService } from '../services/notificacaoService'

export default function AppLayout() {
  const { usuario } = useAuth()
  const [naoLidas, setNaoLidas] = useState(0)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    if (!usuario) return

    notificacaoService.listar(usuario.id)
      .then(n => setNaoLidas(n.filter(x => !x.lida).length))
      .catch(() => setNaoLidas(0))
  }, [usuario])

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar
        naoLidas={naoLidas}
        onMenuClick={() => setMenuAberto(!menuAberto)}
        menuAberto={menuAberto}
      />

      <div className="flex flex-1">
        <Sidebar naoLidas={naoLidas} />

        {menuAberto && (
          <div
            className="fixed inset-0 top-[74px] z-20 bg-black/40 md:hidden"
            onClick={() => setMenuAberto(false)}
          >
            <div
              className="h-full w-64 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar
                naoLidas={naoLidas}
                mobile
                onNavigate={() => setMenuAberto(false)}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
