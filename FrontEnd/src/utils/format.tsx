import type { StatusOcorrencia, TipoOcorrencia } from '../types'

export const tipoLabel: Record<TipoOcorrencia, string> = {
  VAZAMENTO: 'Vazamento',
  FALTA_DE_AGUA: 'Falta de água',
  AUMENTO_DE_CONSUMO: 'Aumento de consumo',
  OUTROS: 'Outros',
}

export const statusLabel: Record<StatusOcorrencia, string> = {
  EM_ANALISE: 'Em análise',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
  RECUSADA: 'Recusada',
}

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export const mesCurto = (ym: string) =>
  new Date(`${ym}-01T00:00:00`).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
