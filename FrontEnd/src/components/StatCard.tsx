import type { ReactNode } from 'react'

interface Props {
  icone: ReactNode
  rotulo: string
  valor: string
  detalhe?: string
}

export default function StatCard({ icone, rotulo, valor, detalhe }: Props) {
  return (
    <div className="card flex flex-col gap-1">
      <div className="text-aqua-600">{icone}</div>
      <p className="text-xs text-aqua-700">{rotulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
      {detalhe && <p className="text-[11px] text-aqua-700">{detalhe}</p>}
    </div>
  )
}
