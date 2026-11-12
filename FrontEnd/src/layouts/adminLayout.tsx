
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import Topbar from '../components/Topbar'

export default function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar
        naoLidas={0}
        onMenuClick={() => setMenuAberto(!menuAberto)}
        menuAberto={menuAberto}
      />

      <div className="flex flex-1">
        <AdminSidebar />

        {menuAberto && (
          <div
            className="fixed inset-0 top-[74px] z-20 bg-black/40 md:hidden"
            onClick={() => setMenuAberto(false)}
          >
            <div
              className="h-full w-64 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <AdminSidebar
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
