import { api } from './api'

export interface Preferencias {
  receberOcorrencia: boolean
  receberSistema: boolean
  receberDicas: boolean
  receberAlertaConsumo: boolean
}

export const preferenciaService = {
  obter: () => api<Preferencias>('/preferencias'),
  atualizar: (dados: Partial<Preferencias>) =>
    api<Preferencias>('/preferencias', { method: 'PATCH', body: JSON.stringify(dados) }),
}
