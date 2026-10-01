import { Link } from 'react-router-dom'
import { Droplet, CircleCheck, Clock, ChartNoAxesColumn, MapPin } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { ocorrenciaService } from '../services/ocorrenciaService'
import { consumoService } from '../services/consumoService'
import { tipoLabel, formatarData } from '../utils/format'

export default function Inicio() {
  const { usuario } = useAuth()
  const id = usuario!.id
  const oc = useCarregar(() => ocorrenciaService.listar(id), [id], [])
  const co = useCarregar(() => consumoService.listar(id), [id], [])

  const resolvidas = oc.dados.filter((o) => o.status === 'RESOLVIDA')
  const tempos = resolvidas.filter((o) => o.dataResolucao).map(
    (o) => (new Date(o.dataResolucao!).getTime() - new Date(o.dataRegistro).getTime()) / 86400000,
  )
  const tempoMedio = tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0
  const ultimoConsumo = co.dados.at(-1)?.volumeM3 ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Olá, {usuario!.nomeCompleto.split(' ')[0]}!</h1>
        <p className="text-sm">Aqui você acompanha suas ocorrências e seu consumo de água.</p>
      </div>
      {(oc.erro || co.erro) && <p className="text-sm text-red-600">{oc.erro || co.erro}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icone={<Droplet />} rotulo="Total de ocorrências" valor={String(oc.dados.length)} />
        <StatCard icone={<CircleCheck />} rotulo="Ocorrências resolvidas" valor={String(resolvidas.length)} />
        <StatCard icone={<Clock />} rotulo="Tempo médio de atendimento" valor={`${tempoMedio} dias`} />
        <StatCard icone={<ChartNoAxesColumn />} rotulo="Consumo do mês" valor={`${ultimoConsumo} m³`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card flex min-h-64 flex-col items-center justify-center bg-aqua-300 text-center">
          <MapPin className="h-10 w-10 text-aqua-900" />
          <p className="mt-2 text-sm font-semibold">Mapa de ocorrências</p>
          <p className="text-xs">Integre aqui Leaflet ou Google Maps usando latitude/longitude dos endereços.</p>
        </div>
        <div className="card">
          <div className="mb-3 flex justify-between">
            <h2 className="font-bold">Últimas ocorrências</h2>
            <Link to="/ocorrencias" className="text-xs text-aqua-600">Ver todas</Link>
          </div>
          <ul className="space-y-3">
            {oc.dados.slice(0, 3).map((o) => (
              <li key={o.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{tipoLabel[o.tipo]}</p>
                  <p className="text-xs text-aqua-700">{formatarData(o.dataRegistro)}</p>
                </div>
                <StatusBadge status={o.status} />
              </li>
            ))}
            {!oc.carregando && oc.dados.length === 0 && (
              <li className="text-sm">Nenhuma ocorrência ainda. <Link to="/ocorrencias/nova" className="text-aqua-600">Registre a primeira.</Link></li>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-xl bg-aqua-300 p-4">
        <p className="font-bold">Cada gota conta.</p>
        <p className="text-sm">Juntos por uma cidade com mais água e mais qualidade de vida.</p>
      </div>
    </div>
  )
}
