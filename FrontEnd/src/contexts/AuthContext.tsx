import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Usuario } from '../types'
import { usuarioService } from '../services/usuarioService'
import { ApiError, TOKEN_KEY } from '../services/api'

interface AuthCtx {
  usuario: Usuario | null
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
  atualizar: (u: Usuario) => void
}

const Ctx = createContext<AuthCtx | null>(null)
const KEY = 'aquasense:usuario'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem(KEY)
    if (!salvo || !localStorage.getItem(TOKEN_KEY)) return null
    try { return JSON.parse(salvo) as Usuario } catch { return null }
  })

  async function login(email: string, senha: string) {
    try {
      const resposta = await usuarioService.login(email, senha)
      localStorage.setItem(TOKEN_KEY, resposta.token)
      const u = await usuarioService.me()
      localStorage.setItem(KEY, JSON.stringify(u))
      setUsuario(u)
      return true
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(KEY)
      if (e instanceof ApiError && e.status === 401) return false
      throw e
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem(KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  function atualizar(u: Usuario) {
    setUsuario(u)
    localStorage.setItem(KEY, JSON.stringify(u))
  }

  return <Ctx.Provider value={{ usuario, login, logout, atualizar }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
