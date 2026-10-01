import { api } from './api'
import type { Ocorrencia } from '../types'

export const ocorrenciaService = {
  listar: (usuarioId: number) =>
    api<Ocorrencia[]>(`/ocorrencias?usuarioId=${usuarioId}`),
  criar: (dados: Omit<Ocorrencia, 'id'>) =>
    api<Ocorrencia>('/ocorrencias', { method: 'POST', body: JSON.stringify(dados) }),
}