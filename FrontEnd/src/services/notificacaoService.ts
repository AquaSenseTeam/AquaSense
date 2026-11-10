import { api } from './api'
import type { Notificacao } from '../types'

export const notificacaoService = {
  listar: (_usuarioId?: number) => api<Notificacao[]>('/notificacoes'),
  listarNaoLidas: () => api<Notificacao[]>('/notificacoes/nao-lidas'),
  marcarComoLida: (id: number) => api<Notificacao>(`/notificacoes/${id}/lida`, { method: 'PATCH' }),
}
