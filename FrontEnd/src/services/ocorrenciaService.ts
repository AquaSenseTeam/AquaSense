/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from './api'
import type { Ocorrencia } from '../types'

export const ocorrenciaService = {
  listar: (_usuarioId?: number) => api<Ocorrencia[]>('/ocorrencias'),
  criar: (dados: Pick<Ocorrencia, 'enderecoId' | 'tipo' | 'descricao'> & Partial<Ocorrencia>) =>
    api<Ocorrencia>('/ocorrencias', {
      method: 'POST',
      body: JSON.stringify({ enderecoId: dados.enderecoId, tipo: dados.tipo, descricao: dados.descricao }),
    }),
}
