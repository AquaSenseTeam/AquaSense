
import { useState } from 'react'
import {
  Bell,
  Check,
  CheckCheck,
  Droplets,
  AlertTriangle,
  ClipboardList,
  Info,
  Clock,
  Filter,
} from 'lucide-react'

import SubPagina from '../components/SubPagina'

type TipoNotificacao = 'OCORRENCIA' | 'ALERTA' | 'SISTEMA'

interface Notificacao {
  id: number
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  data: string
  hora: string
  lida: boolean
}

const notificacoesIniciais: Notificacao[] = [
  {
    id: 1,
    tipo: 'OCORRENCIA',
    titulo: 'Nova ocorrência registrada',
    mensagem: 'Um morador registrou um vazamento de água no município atendido pela empresa.',
    data: '18/11/2026',
    hora: '09:35',
    lida: false,
  },
  {
    id: 2,
    tipo: 'ALERTA',
    titulo: 'Aumento de consumo identificado',
    mensagem: 'Foi identificado um aumento no consumo de água acima da média esperada.',
    data: '17/11/2026',
    hora: '16:20',
    lida: false,
  },
  {
    id: 3,
    tipo: 'OCORRENCIA',
    titulo: 'Ocorrência atualizada',
    mensagem: 'Uma ocorrência teve seu atendimento iniciado.',
    data: '17/11/2026',
    hora: '14:10',
    lida: true,
  },
  {
    id: 4,
    tipo: 'SISTEMA',
    titulo: 'Bem-vindo ao AquaSense!',
    mensagem: 'Acompanhe por aqui as atualizações e informações importantes da plataforma.',
    data: '16/11/2026',
    hora: '10:00',
    lida: true,
  },
]

const configuracaoTipo = {
  OCORRENCIA: {
    icone: ClipboardList,
    cor: 'bg-blue-50 text-blue-600',
    etiqueta: 'Ocorrência',
  },
  ALERTA: {
    icone: AlertTriangle,
    cor: 'bg-amber-50 text-amber-600',
    etiqueta: 'Alerta',
  },
  SISTEMA: {
    icone: Info,
    cor: 'bg-aqua-50 text-aqua-700',
    etiqueta: 'Sistema',
  },
}

type Filtro = 'TODAS' | 'NAO_LIDAS'

export default function EmpresaNotificacoes() {
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)
  const [filtro, setFiltro] = useState<Filtro>('TODAS')

  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const notificacoesFiltradas = notificacoes.filter((n) =>
    filtro === 'TODAS' ? true : !n.lida
  )

  function marcarComoLida(id: number) {
    setNotificacoes((anteriores) =>
      anteriores.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      )
    )
  }

  function marcarTodasComoLidas() {
    setNotificacoes((anteriores) =>
      anteriores.map((n) => ({ ...n, lida: true }))
    )
  }

  return (
    <SubPagina
      titulo="Notificações"
      descricao="Acompanhe as atualizações e os avisos da sua empresa."
    >
      <div className="space-y-6">

        {/* Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total de notificações</p>
              <div className="p-2 rounded-xl bg-aqua-50 text-aqua-700">
                <Bell size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">
              {notificacoes.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Não lidas</p>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-3">
              {naoLidas}
            </p>
          </div>
        </div>

        {/* Lista de notificações */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-gray-800">
                Atualizações recentes
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Veja os avisos e acontecimentos da plataforma.
              </p>
            </div>

            <button
              onClick={marcarTodasComoLidas}
              disabled={naoLidas === 0}
              className="flex items-center gap-2 text-sm font-medium text-aqua-700 hover:text-aqua-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck size={17} />
              Marcar todas como lidas
            </button>
          </div>

          {/* Filtros */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />

            <button
              onClick={() => setFiltro('TODAS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filtro === 'TODAS'
                  ? 'bg-aqua-50 text-aqua-700'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Todas
            </button>

            <button
              onClick={() => setFiltro('NAO_LIDAS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filtro === 'NAO_LIDAS'
                  ? 'bg-aqua-50 text-aqua-700'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Não lidas ({naoLidas})
            </button>
          </div>

          {/* Itens */}
          <div className="divide-y divide-gray-100">
            {notificacoesFiltradas.length > 0 ? (
              notificacoesFiltradas.map((notificacao) => {
                const config = configuracaoTipo[notificacao.tipo]
                const Icone = config.icone

                return (
                  <div
                    key={notificacao.id}
                    className={`p-5 flex gap-4 transition hover:bg-gray-50 ${
                      !notificacao.lida ? 'bg-aqua-50/30' : ''
                    }`}
                  >
                    <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${config.cor}`}>
                      <Icone size={21} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm font-semibold ${
                          notificacao.lida ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notificacao.titulo}
                        </h3>

                        {!notificacao.lida && (
                          <span className="w-2 h-2 rounded-full bg-aqua-600" />
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                        {notificacao.mensagem}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.cor}`}>
                          {config.etiqueta}
                        </span>

                        <span className="text-xs text-gray-400">
                          {notificacao.data} às {notificacao.hora}
                        </span>
                      </div>
                    </div>

                    {!notificacao.lida && (
                      <button
                        onClick={() => marcarComoLida(notificacao.id)}
                        title="Marcar como lida"
                        className="self-start p-2 rounded-lg text-gray-400 hover:text-aqua-700 hover:bg-aqua-50 transition"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="py-16 px-5 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                  <Droplets size={26} />
                </div>
                <h3 className="font-semibold text-gray-700 mt-4">
                  Nenhuma notificação por aqui
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Você não possui notificações não lidas.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Dados demonstrativos. A integração com notificações em tempo real estará disponível em breve.
        </p>
      </div>
    </SubPagina>
  )
}
