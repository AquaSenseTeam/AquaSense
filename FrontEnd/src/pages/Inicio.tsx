import { Link } from 'react-router-dom'
import {
  Droplet,
  CircleCheck,
  Clock,
  ChartNoAxesColumn,
  MapPin,
  ArrowRight,
  Plus,
  ClipboardList,
  MapPinned,
  RefreshCw,
} from 'lucide-react'
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

  const oc = useCarregar(
    () => ocorrenciaService.listar(id),
    [id],
    [],
  )

  const co = useCarregar(
    () => consumoService.listar(id),
    [id],
    [],
  )

  const resolvidas = oc.dados.filter(
    (o) => o.status.toUpperCase() === 'RESOLVIDA',
  )

  const tempos = resolvidas
    .filter((o) => o.dataResolucao)
    .map(
      (o) =>
        (new Date(o.dataResolucao!).getTime() -
          new Date(o.dataRegistro).getTime()) /
        86400000,
    )
    .filter((dias) => dias >= 0)

  const tempoMedio = tempos.length
    ? Math.round(
        tempos.reduce((a, b) => a + b, 0) / tempos.length,
      )
    : 0

  const consumosOrdenados = [...co.dados].sort((a, b) =>
    (a.mesReferencia ?? '').localeCompare(b.mesReferencia ?? ''),
  )

  const ultimoConsumo = consumosOrdenados.at(-1)?.volumeM3 ?? 0

  const emAcompanhamento = oc.dados.filter((o) => {
    const status = o.status.toUpperCase()
    return status === 'EM_ANALISE' || status === 'EM_ANDAMENTO'
  }).length

  return (
    <div className="space-y-7 pb-8">
      {/* Boas-vindas */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aqua-600 via-aqua-600 to-cyan-500 px-6 py-7 text-white shadow-sm sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-36 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
              <Droplet size={14} />
              Seu espaço de acompanhamento
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Olá, {usuario!.nomeCompleto.split(' ')[0]}!
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-white/85 sm:text-base">
              Acompanhe suas ocorrências, monitore seu consumo
              e ajude a construir uma cidade com mais água e
              qualidade de vida.
            </p>
          </div>

          <Link
            to="/ocorrencias/nova"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-aqua-50"
          >
            <Plus size={18} color="black" />
            Registrar ocorrência
          </Link>
        </div>
      </section>

      {/* Mensagens de erro */}
      {(oc.erro || co.erro) && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {oc.erro || co.erro}
        </div>
      )}

      {/* Indicadores */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Resumo da sua conta
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Veja os principais dados da sua atividade.
            </p>
          </div>

          <span className="hidden rounded-full bg-aqua-50 px-3 py-1.5 text-xs font-medium text-aqua-800 sm:inline-flex">
            Atualizado pela sua conta
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icone={<Droplet />}
            rotulo="Total de ocorrências"
            valor={String(oc.dados.length)}
            detalhe="Registros realizados"
          />

          <StatCard
            icone={<CircleCheck />}
            rotulo="Ocorrências resolvidas"
            valor={String(resolvidas.length)}
            detalhe="Problemas solucionados"
          />

          <StatCard
            icone={<Clock />}
            rotulo="Tempo médio de atendimento"
            valor={`${tempoMedio} dias`}
            detalhe={
              tempos.length
                ? 'Considerando registros resolvidos'
                : 'Ainda sem histórico de resolução'
            }
          />

          <StatCard
            icone={<ChartNoAxesColumn />}
            rotulo="Consumo mais recente"
            valor={`${ultimoConsumo} m³`}
            detalhe="Último mês registrado"
          />
        </div>
      </section>

      {/* Mapa e acompanhamento */}
      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Área do mapa */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                <MapPinned size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Mapa de ocorrências
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Visualize os pontos de atendimento
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              <MapPin size={13} />
              Mapa interativo em breve
            </span>
          </div>

          <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 px-6 py-10 text-center sm:min-h-[340px]">
            {/* Elementos decorativos temporários */}
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <div className="absolute left-[12%] top-[20%] h-24 w-24 rounded-full border border-sky-200" />
              <div className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full border border-sky-200" />
              <div className="absolute bottom-[12%] left-[35%] h-36 w-36 rounded-full border border-sky-200" />

              <svg
                viewBox="0 0 600 360"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M-20 90 L180 130 L260 40 L410 105 L630 60"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="12"
                />
                <path
                  d="M20 380 L130 250 L270 270 L390 180 L620 220"
                  fill="none"
                  stroke="#bae6fd"
                  strokeWidth="10"
                />
                <path
                  d="M100 -20 L180 100 L160 210 L250 380"
                  fill="none"
                  stroke="#dbeafe"
                  strokeWidth="8"
                />
                <path
                  d="M420 -20 L380 90 L460 180 L430 380"
                  fill="none"
                  stroke="#dbeafe"
                  strokeWidth="8"
                />
              </svg>
            </div>

            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/90 text-aqua-700 shadow-sm">
              <MapPinned size={30} />
            </div>

            <h3 className="relative z-10 mt-5 text-lg font-bold text-gray-800">
              Acompanhe sua região
            </h3>

            <p className="relative z-10 mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Em breve, você poderá visualizar sua localização
              e os pontos de ocorrência diretamente no mapa.
            </p>

            <div className="relative z-10 mt-5 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-2 text-xs font-medium text-gray-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Sua localização
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3 py-2 text-xs font-medium text-gray-600">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Ocorrências
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              A exibição dos pontos dependerá dos dados de localização
              disponíveis nos endereços e nas ocorrências.
            </p>

            <Link
              to="/ocorrencias"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-aqua-700 transition hover:text-aqua-900"
            >
              Ver ocorrências
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Últimas ocorrências */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-gray-900">
                Últimas ocorrências
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Acompanhe seus registros recentes.
              </p>
            </div>

            <Link
              to="/ocorrencias"
              aria-label="Ver todas as ocorrências"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-aqua-700 transition hover:bg-aqua-50"
            >
              <ArrowRight size={19} />
            </Link>
          </div>

          <div className="p-5">
            {oc.carregando ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                <RefreshCw
                  size={17}
                  className="animate-spin text-aqua-600"
                />
                Carregando ocorrências...
              </div>
            ) : oc.dados.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                  <ClipboardList size={23} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  Nenhuma ocorrência ainda
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
                  Seus registros aparecerão aqui para facilitar
                  o acompanhamento.
                </p>

                <Link
                  to="/ocorrencias/nova"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-aqua-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-aqua-700"
                >
                  <Plus size={16} />
                  Registrar primeira ocorrência
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {[...oc.dados]
                  .sort(
                    (a, b) =>
                      new Date(b.dataRegistro).getTime() -
                      new Date(a.dataRegistro).getTime(),
                  )
                  .slice(0, 4)
                  .map((o) => (
                    <li
                      key={o.id}
                      className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                        <Droplet size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {tipoLabel[o.tipo as keyof typeof tipoLabel] ??
                            o.tipo}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatarData(o.dataRegistro)}
                        </p>

                        <div className="mt-2">
                          <StatusBadge status={o.status} />
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}

            {!oc.carregando && oc.dados.length > 0 && (
              <Link
                to="/ocorrencias"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-aqua-200 hover:bg-aqua-50 hover:text-aqua-800"
              >
                <ClipboardList size={17} />
                Consultar todas as ocorrências
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Acompanhamento e incentivo */}
      <section className="grid gap-5 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-aqua-100 bg-aqua-50/70 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-700 shadow-sm">
            <Clock size={21} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Acompanhe seus atendimentos
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {emAcompanhamento > 0
                ? `Você tem ${emAcompanhamento} ${
                    emAcompanhamento === 1
                      ? 'ocorrência em acompanhamento'
                      : 'ocorrências em acompanhamento'
                  }. Consulte os detalhes para acompanhar a situação.`
                : 'Consulte o histórico para verificar o andamento dos seus registros.'}
            </p>

            <Link
              to="/ocorrencias"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-aqua-800 hover:text-aqua-950"
            >
              Acessar minhas ocorrências
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <Droplet size={21} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              Cada gota conta
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Acompanhar o consumo e informar problemas são atitudes
              importantes para reduzir o desperdício de água.
            </p>

            <Link
              to="/meu-consumo"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-800 transition hover:text-blue-950"
            >
              Ver meu consumo
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
