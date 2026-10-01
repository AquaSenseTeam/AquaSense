import type { StatusOcorrencia } from '../types'
import { statusLabel } from '../utils/format'

const cores: Record<StatusOcorrencia, string> = {
  EM_ANALISE: 'bg-orange-200 text-orange-800',
  EM_ANDAMENTO: 'bg-orange-200 text-orange-800',
  RESOLVIDA: 'bg-green-200 text-green-800',
  RECUSADA: 'bg-red-200 text-red-800',
}

export default function StatusBadge({ status }: { status: StatusOcorrencia }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cores[status]}`}>
      {statusLabel[status]}
    </span>
  )
}
