import { api } from './api'

export interface Dica {
  id: number
  titulo: string
  descricao?: string | null
}

export const dicaService = {
  listar: () => api<Dica[]>('/dicas'),
}
