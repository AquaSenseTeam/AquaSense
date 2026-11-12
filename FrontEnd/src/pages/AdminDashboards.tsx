
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

import {
  adminEmpresaService,
  type Empresa,
  type StatusAprovacao,
} from '../services/adminEmpresaService'

import { ApiError } from '../services/api'

type Filtro = 'TODAS' | StatusAprovacao

export default function AdminDashboard() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [filtro, setFiltro] = useState<Filtro>('TODAS')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregarEmpresas() {
    try {
      setCarregando(true)
      setErro('')

      const dados = await adminEmpresaService.listarTodas()
      setEmpresas(dados)
    } catch (e) {
      setErro(
        e instanceof ApiError
          ? e.message
          : 'Não foi possível carregar as empresas.'
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarEmpresas()
  }, [])

  const total = empresas.length

  const pendentes = empresas.filter(
    empresa => empresa.statusAprovacao === 'PENDENTE'
  ).length

  const aprovadas = empresas.filter(
    empresa => empresa.statusAprovacao === 'APROVADA'
  ).length

  const rejeitadas = empresas.filter(
    empresa => empresa.statusAprovacao === 'REJEITADA'
  ).length

  const empresasFiltradas = empresas.filter(empresa =>
    filtro === 'TODAS'
      ? true
      : empresa.statusAprovacao === filtro
  )

  function obterStatus(status: StatusAprovacao) {
    const estilos = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      APROVADA: 'bg-green-100 text-green-800',
      REJEITADA: 'bg-red-100 text-red-800',
    }

    const nomes = {
      PENDENTE: 'Pendente',
      APROVADA: 'Aprovada',
      REJEITADA: 'Rejeitada',
    }

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${estilos[status]}`}
      >
        {nomes[status]}
      </span>
    )
  }

  const cards = [
    {
      titulo: 'Total de empresas',
      valor: total,
      icone: Building2,
      cor: 'bg-blue-100 text-blue-700',
    },
    {
      titulo: 'Pendentes',
      valor: pendentes,
      icone: Clock,
      cor: 'bg-yellow-100 text-yellow-700',
    },
    {
      titulo: 'Aprovadas',
      valor: aprovadas,
      icone: CheckCircle2,
      cor: 'bg-green-100 text-green-700',
    },
    {
      titulo: 'Rejeitadas',
      valor: rejeitadas,
      icone: XCircle,
      cor: 'bg-red-100 text-red-700',
    },
  ]

  if (carregando) {
    return (
      <div className="p-6 text-gray-500">
        Carregando painel administrativo...
      </div>
    )
  }

  return (
    <main className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Painel administrativo
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Acompanhe as empresas cadastradas e gerencie os acessos ao AquaSense.
          </p>
        </div>

        <button
          onClick={carregarEmpresas}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </header>

      {erro && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          {erro}
        </div>
      )}

      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => {
          const Icone = card.icone

          return (
            <article
              key={card.titulo}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {card.titulo}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {card.valor}
                  </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.cor}`}>
                  <Icone size={23} />
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {/* Empresas cadastradas */}
      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Empresas cadastradas
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Acompanhe a situação dos cadastros na plataforma.
            </p>
          </div>

          <Link
            to="/admin/empresas"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Gerenciar empresas
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 p-5">
          {[
            { valor: 'TODAS', nome: 'Todas' },
            { valor: 'PENDENTE', nome: 'Pendentes' },
            { valor: 'APROVADA', nome: 'Aprovadas' },
            { valor: 'REJEITADA', nome: 'Rejeitadas' },
          ].map(opcao => (
            <button
              key={opcao.valor}
              onClick={() => setFiltro(opcao.valor as Filtro)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filtro === opcao.valor
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opcao.nome}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="divide-y divide-gray-100">
          {empresasFiltradas.length === 0 ? (
            <div className="p-10 text-center">
              <Building2
                size={36}
                className="mx-auto mb-3 text-gray-300"
              />

              <h3 className="font-semibold text-gray-700">
                Nenhuma empresa encontrada
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Não existem empresas com esse status no momento.
              </p>
            </div>
          ) : (
            empresasFiltradas.map(empresa => (
              <article
                key={empresa.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Building2 size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-800">
                      {empresa.nome}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      CNPJ: {empresa.cnpj}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {empresa.email}
                    </p>
                  </div>
                </div>

                {obterStatus(empresa.statusAprovacao)}
              </article>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-400">
            Exibindo {empresasFiltradas.length} de {total} empresas.
          </p>
        </div>
      </section>
    </main>
  )
}
