/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from './api'
import type { Consumo } from '../types'

export const consumoService = {
  listar: (_usuarioId?: number) => api<Consumo[]>('/consumos'),
}
