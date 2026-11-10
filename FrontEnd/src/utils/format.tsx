import type { StatusOcorrencia, TipoOcorrencia } from '../types'

export const tipoLabel: Record<TipoOcorrencia, string> = {
  VAZAMENTO: 'Vazamento',
  FALTA_DE_AGUA: 'Falta de água',
  AUMENTO_DE_CONSUMO: 'Aumento de consumo',
  OUTROS: 'Outros',
}

export const statusLabel: Record<StatusOcorrencia, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
  CANCELADA: 'Cancelada',
}

export const formatarData = (iso?: string | null) => iso
  ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  : '—'

export const mesCurto = (ym: string) => {
  const mes = ym.slice(0, 7)
  return new Date(`${mes}-01T00:00:00`).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
}
