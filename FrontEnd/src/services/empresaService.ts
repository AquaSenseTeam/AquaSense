
import { api } from './api'

export interface Empresa {
  id: number
  nome: string
  cnpj: string
  email: string
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
}
