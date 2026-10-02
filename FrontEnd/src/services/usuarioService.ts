/* eslint-disable @typescript-eslint/no-unused-vars */

import { api } from './api'
import type { Endereco, Usuario } from '../types'

export interface RespostaAuth {
  token: string
  usuario: Usuario
}

export interface NovoCadastro {
  nomeCompleto: string
  cpf: string
  email: string
  telefone?: string
  senha: string
  endereco: Omit<Endereco, 'id' | 'usuarioId'>
}

export const usuarioService = {
  login: (email: string, senha: string) =>
    api<RespostaAuth>('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),
  cadastrar: (dados: NovoCadastro) =>
    api<RespostaAuth>('/auth/register', { method: 'POST', body: JSON.stringify(dados) }),
  atualizar: (dados: Partial<Usuario>) =>
    api<Usuario>('/usuarios/me', { method: 'PATCH', body: JSON.stringify(dados) }),
  // o parâmetro é ignorado: o back usa o usuário do token
  listarEnderecos: (_usuarioId?: number) => api<Endereco[]>('/enderecos'),
  criarEndereco: (dados: Omit<Endereco, 'id' | 'usuarioId'>) =>
    api<Endereco>('/enderecos', { method: 'POST', body: JSON.stringify(dados) }),
}
