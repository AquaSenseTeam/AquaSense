/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Droplet,
  Waves,
  Gauge,
  CircleHelp,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { ocorrenciaService } from '../services/ocorrenciaService'
import type { Ocorrencia, TipoOcorrencia } from '../types'

const tipos: Record<TipoOcorrencia, string> = {
  VAZAMENTO: 'Vazamentos',
  FALTA_DE_AGUA: 'Falta de água',
  AUMENTO_DE_CONSUMO: 'Aumento de consumo',
  OUTROS: 'Outros',
}

const icones = {
  VAZAMENTO: Droplet,
  FALTA_DE_AGUA: Waves,
  AUMENTO_DE_CONSUMO: Gauge,
  OUTROS: CircleHelp,
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(data))
}

export default function EmpresaDashboard() {
  const navigate = useNavigate()

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregarDados() {
    try {
      setCarregando(true)
      setErro('')

      const dados = await ocorrenciaService.listarDaEmpresa()
      setOcorrencias(dados)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      setErro('Não foi possível carregar os dados do painel.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const resumo = useMemo(() => ({
    total: ocorrencias.length,
    pendentes: ocorrencias.filter(o => o.status === 'PENDENTE').length,
    andamento: ocorrencias.filter(o => o.status === 'EM_ANDAMENTO').length,
    resolvidas: ocorrencias.filter(o => o.status === 'RESOLVIDA').length,
  }), [ocorrencias])

  const distribuicao = useMemo(() => {
    const quantidade = (tipo: TipoOcorrencia) =>
      ocorrencias.filter(o => o.tipo === tipo).length

    return (Object.keys(tipos) as TipoOcorrencia[])
      .map(tipo => ({
        tipo,
        nome: tipos[tipo],
        total: quantidade(tipo),
        percentual: ocorrencias.length
          ? (quantidade(tipo) / ocorrencias.length) * 100
          : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [ocorrencias])

  const recentes = ocorrencias.slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-aqua-700">
            Painel da empresa
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acompanhe os indicadores e as solicitações recebidas.
          </p>
        </div>

        <button
          type="button"
          onClick={carregarDados}
          disabled={carregando}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${carregando ? 'animate-spin' : ''}`} />
          Atualizar dados
        </button>
      </div>

      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            titulo: 'Total de ocorrências',
            valor: resumo.total,
            legenda: 'Solicitações recebidas',
            Icone: ClipboardList,
            cor: 'bg-aqua-50 text-aqua-700',
          },
          {
            titulo: 'Pendentes',
            valor: resumo.pendentes,
            legenda: 'Aguardando atendimento',
            Icone: AlertCircle,
            cor: 'bg-amber-50 text-amber-600',
          },
          {
            titulo: 'Em andamento',
            valor: resumo.andamento,
            legenda: 'Em atendimento',
            Icone: Clock3,
            cor: 'bg-blue-50 text-blue-600',
          },
          {
            titulo: 'Resolvidas',
            valor: resumo.resolvidas,
            legenda: 'Atendimentos concluídos',
            Icone: CheckCircle2,
            cor: 'bg-emerald-50 text-emerald-600',
          },
        ].map(card => (
          <div
            key={card.titulo}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${card.cor}`}>
                <card.Icone className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              {carregando ? '—' : card.valor}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-700">
              {card.titulo}
            </p>
            <p className="mt-1 text-xs text-gray-400">{card.legenda}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="font-semibold text-gray-900">
            Ocorrências por categoria
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Distribuição das solicitações recebidas.
          </p>

          {carregando ? (
            <div className="mt-6 h-40 animate-pulse rounded-xl bg-gray-100" />
          ) : resumo.total === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              Ainda não há dados para exibir.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {distribuicao.map(item => {
                const Icone = icones[item.tipo]

                return (
                  <div key={item.tipo}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-gray-700">
                        <Icone className="h-4 w-4 text-aqua-700" />
                        {item.nome}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.total}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-aqua-600 transition-all"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-semibold text-gray-900">
                Ocorrências recentes
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Últimas solicitações recebidas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/empresa/ocorrencias')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-aqua-700 hover:text-aqua-900"
            >
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {carregando ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map(item => (
                <div key={item} className="h-14 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : recentes.length === 0 ? (
            <p className="px-5 py-14 text-center text-sm text-gray-400">
              Nenhuma ocorrência recebida até o momento.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentes.map(ocorrencia => {
                const Icone = icones[ocorrencia.tipo] ?? CircleHelp

                return (
                  <div
                    key={ocorrencia.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <div className="rounded-xl bg-aqua-50 p-2.5 text-aqua-700">
                      <Icone className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {tipos[ocorrencia.tipo]}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        #{ocorrencia.id} · {formatarData(ocorrencia.dataRegistro)}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-gray-500">
                      {ocorrencia.status === 'PENDENTE'
                        ? 'Pendente'
                        : ocorrencia.status === 'EM_ANDAMENTO'
                          ? 'Em andamento'
                          : ocorrencia.status === 'RESOLVIDA'
                            ? 'Resolvida'
                            : 'Cancelada'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
