import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface Props {
  titulo: string
  descricao: string
  children: ReactNode
}

export default function SubPagina({ titulo, descricao, children }: Props) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/perfil" className="inline-flex items-center gap-1 text-sm text-aqua-600">
        <ArrowLeft className="h-4 w-4" /> Voltar ao perfil
      </Link>
      <div>
        <h1 className="text-3xl font-bold">{titulo}</h1>
        <p className="text-sm">{descricao}</p>
      </div>
      {children}
    </div>
  )
}
