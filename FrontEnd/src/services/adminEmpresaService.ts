
import { api } from './api'

export type StatusAprovacao = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

export interface Empresa {
  id: number
  nome: string
  cnpj: string
  email: string
  statusAprovacao: StatusAprovacao
}

export const adminEmpresaService = {
  listarTodas: () => api<Empresa[]>('/admin/empresas'),

  listarPendentes: () => api<Empresa[]>('/admin/empresas/pendentes'),

  aprovar: (id: number) =>
    api<Empresa>(`/admin/empresas/${id}/aprovar`, { method: 'PATCH' }),

  rejeitar: (id: number) =>
    api<Empresa>(`/admin/empresas/${id}/rejeitar`, { method: 'PATCH' }),
}
