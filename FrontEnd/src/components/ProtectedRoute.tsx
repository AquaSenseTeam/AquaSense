
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { TipoUsuario } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  tiposPermitidos?: TipoUsuario[]
}

export default function ProtectedRoute({
  children,
  tiposPermitidos,
}: ProtectedRouteProps) {
  const { usuario } = useAuth()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (
    tiposPermitidos &&
    !tiposPermitidos.includes(usuario.tipo)
  ) {
    const rotasPorTipo: Record<TipoUsuario, string> = {
      MORADOR: '/inicio',
      EMPRESA: '/empresa',
      ADMIN: '/admin',
    }

    return <Navigate to={rotasPorTipo[usuario.tipo]} replace />
  }

  return <>{children}</>
}
