/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from './api'
import type { Notificacao } from '../types'

export const notificacaoService = {
  listar: (_usuarioId?: number) => api<Notificacao[]>('/notificacoes'),
  marcarComoLida: (id: number) =>
    api<Notificacao>(`/notificacoes/${id}`, { method: 'PATCH', body: JSON.stringify({ lida: true }) }),
}
