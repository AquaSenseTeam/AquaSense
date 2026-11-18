import { api } from './api'
import type { Ocorrencia, TipoOcorrencia, StatusOcorrencia } from '../types'


type NovaOcorrencia = {
  enderecoId?: number | null
  latitude?: number | null
  longitude?: number | null
  cidade?: string | null
  estado?: string | null
  tipo: TipoOcorrencia
  descricao?: string | null
}

export const ocorrenciaService = {
  listar: (_usuarioId?: number) =>
    api<Ocorrencia[]>('/ocorrencias'),

  listarDaEmpresa: () =>
    api<Ocorrencia[]>('/ocorrencias/empresa'),

  atualizarStatus: (id: number, status: StatusOcorrencia) =>
  api<Ocorrencia>(`/ocorrencias/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  criar: (dados: NovaOcorrencia) =>
    api<Ocorrencia>('/ocorrencias', {
      method: 'POST',
      body: JSON.stringify({
        enderecoId: dados.enderecoId ?? null,
        latitude: dados.latitude ?? null,
        longitude: dados.longitude ?? null,
        cidade: dados.cidade ?? null,
        estado: dados.estado ?? null,
        tipo: dados.tipo,
        descricao: dados.descricao ?? null,
      }),
    }),
}
