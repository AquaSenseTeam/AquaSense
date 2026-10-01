import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../contexts/AuthContext'
import { notificacaoService } from '../services/notificacaoService'

export default function AppLayout() {
  const { usuario } = useAuth()
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    if (!usuario) return
    notificacaoService.listar(usuario.id).then((n) => setNaoLidas(n.filter((x) => !x.lida).length))
  }, [usuario])

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar naoLidas={naoLidas} />
      <div className="flex flex-1">
        <Sidebar naoLidas={naoLidas} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
