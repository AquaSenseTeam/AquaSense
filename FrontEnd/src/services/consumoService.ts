import { api } from './api'
import type { Consumo } from '../types'

export const consumoService = {
  listar: (usuarioId: number) =>
    api<Consumo[]>(`/consumos?usuarioId=${usuarioId}&_sort=mesReferencia&_order=asc`),
}
