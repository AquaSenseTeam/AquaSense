
import { api } from './api'

export interface Empresa {
  id: number
  nome: string
  cnpj: string
  email: string
  statusAprovacao: 'PENDENTE' | 'APROVADA' | 'REJEITADA'
}

export interface EmpresaDetalhes {
  id: number
  nome: string
  nomeFantasia: string | null
  cnpj: string
  email: string | null
  telefone: string | null
  cidade: string | null
  estado: string | null
  statusAprovacao: 'PENDENTE' | 'APROVADA' | 'REJEITADA'
}


export const empresaService = {
  listarPendentes: () =>
    api<Empresa[]>('/admin/empresas/pendentes'),

  aprovar: (id: number) =>
    api<Empresa>(`/admin/empresas/${id}/aprovar`, {
      method: 'PATCH',
    }),

  rejeitar: (id: number) =>
    api<Empresa>(`/admin/empresas/${id}/rejeitar`, {
      method: 'PATCH',
    }),

    buscarMeusDados: () =>
    api<EmpresaDetalhes>('/empresas/me'),
}
