import { api } from './api'
import type { Notificacao } from '../types'

export const notificacaoService = {
  listar: (usuarioId: number) =>
    api<Notificacao[]>(`/notificacoes?usuarioId=${usuarioId}&_sort=dataHora&_order=desc`),
  marcarComoLida: (id: number) =>
    api<Notificacao>(`/notificacoes/${id}`, { method: 'PATCH', body: JSON.stringify({ lida: true }) }),
}
