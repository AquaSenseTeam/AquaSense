import { api, apiArquivo } from './api'
import type { Endereco, Usuario } from '../types'

export interface LoginResposta {
  token: string
  tipo: string
  usuarioId: number
  nomeCompleto: string
}

export type DadosEndereco = Omit<Endereco, 'id' | 'usuarioId'>

export interface NovoCadastro {
  nomeCompleto: string
  cpf: string
  email: string
  telefone?: string
  senha: string
  endereco: DadosEndereco
}

const corpo = (metodo: string, dados: unknown): RequestInit => ({ method: metodo, body: JSON.stringify(dados) })
const normalizarEndereco = (dados: DadosEndereco) => ({ ...dados, cep: dados.cep.replace(/\D/g, ''), estado: dados.estado.trim().toUpperCase() })

export const usuarioService = {
  login: (email: string, senha: string) => api<LoginResposta>('/auth/login', corpo('POST', { email, senha })),
  cadastrar: (dados: NovoCadastro) => api<Usuario>('/usuarios', corpo('POST', {
    ...dados,
    cpf: dados.cpf.replace(/\D/g, ''),
    endereco: normalizarEndereco(dados.endereco),
  })),
  me: () => api<Usuario>('/usuarios/me'),
  atualizar: (dados: Partial<Usuario>) => api<Usuario>('/usuarios/me', corpo('PATCH', dados)),
  alterarSenha: (senhaAtual: string, novaSenha: string) =>
    api<{ ok: boolean }>('/usuarios/me/senha', corpo('PATCH', { senhaAtual, novaSenha })),
  enviarFotoPerfil: (foto: File) => {
  const dados = new FormData()
  dados.append('foto', foto)

  return apiArquivo('/usuarios/me/foto', {
    method: 'POST',
    body: dados,
  })
},

obterFotoPerfil: () =>
  apiArquivo('/usuarios/me/foto', {
    method: 'GET',
  }),
  listarEnderecos: (_usuarioId?: number) => api<Endereco[]>('/enderecos'),
  criarEndereco: (dados: DadosEndereco) => api<Endereco>('/enderecos', corpo('POST', normalizarEndereco(dados))),
  atualizarEndereco: (id: number, dados: DadosEndereco) => api<Endereco>(`/enderecos/${id}`, corpo('PATCH', normalizarEndereco(dados))),
  removerEndereco: (id: number) => api<{ ok: boolean }>(`/enderecos/${id}`, { method: 'DELETE' }),
}
