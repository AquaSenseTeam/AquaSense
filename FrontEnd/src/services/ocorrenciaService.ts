
import { api } from './api'
import type { Ocorrencia, TipoOcorrencia } from '../types'

type NovaOcorrencia = {
  enderecoId?: number | null
  latitude?: number | null
  longitude?: number | null
  tipo: TipoOcorrencia
  descricao?: string | null
}

export const ocorrenciaService = {
  listar: (_usuarioId?: number) =>
    api<Ocorrencia[]>('/ocorrencias'),

  criar: (dados: NovaOcorrencia) =>
    api<Ocorrencia>('/ocorrencias', {
      method: 'POST',
      body: JSON.stringify({
        enderecoId: dados.enderecoId ?? null,
        latitude: dados.latitude ?? null,
        longitude: dados.longitude ?? null,
        tipo: dados.tipo,
        descricao: dados.descricao ?? null,
      }),
    }),
}
