import { api } from './api'
import type { Endereco, Usuario } from '../types'

export const usuarioService = {
  // MOCK: no back real, o login é POST /auth/login e devolve um token.
  async login(email: string, senha: string): Promise<Usuario | null> {
    const lista = await api<Usuario[]>(`/usuarios?email=${encodeURIComponent(email)}`)
    const u = lista.find((x) => x.senha === senha)
    return u ?? null
  },
  cadastrar: (dados: Omit<Usuario, 'id'>) =>
    api<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (id: number, dados: Partial<Usuario>) =>
    api<Usuario>(`/usuarios/${id}`, { method: 'PATCH', body: JSON.stringify(dados) }),
  listarEnderecos: (usuarioId: number) => api<Endereco[]>(`/enderecos?usuarioId=${usuarioId}`),
  criarEndereco: (dados: Omit<Endereco, 'id'>) =>
    api<Endereco>('/enderecos', { method: 'POST', body: JSON.stringify(dados) }),
}
