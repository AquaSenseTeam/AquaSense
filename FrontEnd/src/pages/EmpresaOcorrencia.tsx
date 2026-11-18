/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  RefreshCw,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Droplet,
  Waves,
  Gauge,
  CircleHelp,
  MapPin,
} from 'lucide-react'

import { ocorrenciaService } from '../services/ocorrenciaService'
import type { Ocorrencia, StatusOcorrencia, TipoOcorrencia } from '../types'

type FiltroStatus = 'TODAS' | StatusOcorrencia

const tipos: Record<TipoOcorrencia, string> = {
  VAZAMENTO: 'Vazamento',
  FALTA_DE_AGUA: 'Falta de água',
  AUMENTO_DE_CONSUMO: 'Aumento de consumo',
  OUTROS: 'Outros',
}

const statusLabels: Record<StatusOcorrencia, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDA: 'Resolvida',
  CANCELADA: 'Cancelada',
}

const iconesTipo = {
  VAZAMENTO: Droplet,
  FALTA_DE_AGUA: Waves,
  AUMENTO_DE_CONSUMO: Gauge,
  OUTROS: CircleHelp,
}

function formatarData(data: string) {
  if (!data) return 'Data não informada'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(data))
}

function classeStatus(status: StatusOcorrencia) {
  const classes: Record<StatusOcorrencia, string> = {
    PENDENTE: 'bg-amber-50 text-amber-700 ring-amber-200',
    EM_ANDAMENTO: 'bg-blue-50 text-blue-700 ring-blue-200',
    RESOLVIDA: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    CANCELADA: 'bg-gray-100 text-gray-600 ring-gray-200',
  }

  return classes[status]
}

export default function EmpresaOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [filtro, setFiltro] = useState<FiltroStatus>('TODAS')
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregarOcorrencias() {
    try {
      setErro('')
      setCarregando(true)

      const dados = await ocorrenciaService.listarDaEmpresa()
      setOcorrencias(dados)
    } catch (error) {
      console.error('Erro ao carregar ocorrências da empresa:', error)
      setErro('Não foi possível carregar as ocorrências. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarOcorrencias()
  }, [])

  const contagens = useMemo(() => ({
    total: ocorrencias.length,
    pendentes: ocorrencias.filter(o => o.status === 'PENDENTE').length,
    andamento: ocorrencias.filter(o => o.status === 'EM_ANDAMENTO').length,
    resolvidas: ocorrencias.filter(o => o.status === 'RESOLVIDA').length,
  }), [ocorrencias])

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()

    return ocorrencias.filter(ocorrencia => {
      const correspondeStatus =
        filtro === 'TODAS' || ocorrencia.status === filtro

      const texto = [
        ocorrencia.id,
        tipos[ocorrencia.tipo],
        ocorrencia.descricao ?? '',
      ].join(' ').toLowerCase()

      return correspondeStatus && texto.includes(termo)
    })
  }, [ocorrencias, filtro, busca])

  const filtros: { valor: FiltroStatus; rotulo: string }[] = [
    { valor: 'TODAS', rotulo: 'Todas' },
    { valor: 'PENDENTE', rotulo: 'Pendentes' },
    { valor: 'EM_ANDAMENTO', rotulo: 'Em andamento' },
    { valor: 'RESOLVIDA', rotulo: 'Resolvidas' },
    { valor: 'CANCELADA', rotulo: 'Canceladas' },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-aqua-700">
            Central de atendimento
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Ocorrências recebidas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe e gerencie as solicitações dos moradores.
          </p>
        </div>

        <button
          type="button"
          onClick={carregarOcorrencias}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-aqua-50 p-3 text-aqua-700">
              <ClipboardList className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-400">GERAL</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{contagens.total}</p>
          <p className="mt-1 text-sm text-gray-500">Total de ocorrências</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-400">ATENÇÃO</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{contagens.pendentes}</p>
          <p className="mt-1 text-sm text-gray-500">Pendentes</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Clock3 className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-400">EM PROCESSO</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{contagens.andamento}</p>
          <p className="mt-1 text-sm text-gray-500">Em andamento</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-gray-400">CONCLUÍDAS</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{contagens.resolvidas}</p>
          <p className="mt-1 text-sm text-gray-500">Resolvidas</p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Lista de ocorrências</h2>
              <p className="mt-1 text-sm text-gray-500">
                Consulte as solicitações registradas nas cidades atendidas.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar por tipo, descrição ou código"
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {filtros.map(item => (
              <button
                key={item.valor}
                type="button"
                onClick={() => setFiltro(item.valor)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  filtro === item.valor
                    ? 'bg-aqua-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </div>
        </div>

        {erro ? (
          <div className="p-10 text-center">
            <AlertCircle className="mx-auto h-9 w-9 text-red-400" />
            <p className="mt-3 font-medium text-gray-800">{erro}</p>
            <button
              type="button"
              onClick={carregarOcorrencias}
              className="mt-4 rounded-lg bg-aqua-700 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-800"
            >
              Tentar novamente
            </button>
          </div>
        ) : carregando ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-24 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : filtradas.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <ClipboardList className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              {ocorrencias.length === 0
                ? 'Nenhuma ocorrência recebida'
                : 'Nenhuma ocorrência encontrada'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {ocorrencias.length === 0
                ? 'Quando um morador registrar uma ocorrência em uma cidade atendida, ela aparecerá aqui.'
                : 'Tente alterar os filtros ou o termo da busca.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtradas.map(ocorrencia => {
              const Icone = iconesTipo[ocorrencia.tipo] ?? CircleHelp

              return (
                <article
                  key={ocorrencia.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="mt-1 rounded-xl bg-aqua-50 p-3 text-aqua-700">
                      <Icone className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {tipos[ocorrencia.tipo] ?? 'Outro tipo'}
                        </h3>
                        <span className="text-xs text-gray-400">
                          #{ocorrencia.id}
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {ocorrencia.descricao || 'Nenhuma descrição informada.'}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatarData(ocorrencia.dataRegistro)}
                        </span>

                        {ocorrencia.latitude != null && ocorrencia.longitude != null && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            Localização GPS
                          </span>
                        )}

                        {ocorrencia.enderecoId != null && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            Endereço cadastrado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center sm:justify-end">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${classeStatus(ocorrencia.status)}`}>
                      {statusLabels[ocorrencia.status]}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!carregando && !erro && filtradas.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
            <p className="text-xs text-gray-500">
              Exibindo {filtradas.length} de {ocorrencias.length} ocorrências
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
