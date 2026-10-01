/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types'
import { usuarioService } from '../services/usuarioService'

interface AuthCtx {
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
const KEY = 'aquasense:usuario'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem(KEY)
    return salvo ? (JSON.parse(salvo) as Usuario) : null
  })

  async function login(email: string, senha: string) {
    const u = await usuarioService.login(email, senha)
    if (!u) return false
    setUsuario(u)
    localStorage.setItem(KEY, JSON.stringify(u))
    return true
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem(KEY)
  }

  return <Ctx.Provider value={{ usuario, login, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
