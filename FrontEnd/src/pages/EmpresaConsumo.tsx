
import { useState } from 'react'
import {
  Droplets,
  TrendingUp,
  Users,
  CalendarDays,
  PlusCircle,
  LockKeyhole,
  Info,
  BarChart3,
} from 'lucide-react'

import SubPagina from '../components/SubPagina'

type Aba = 'visao-geral' | 'inserir'

const consumoMensal = [
  { mes: 'Jun', valor: 58 },
  { mes: 'Jul', valor: 72 },
  { mes: 'Ago', valor: 65 },
  { mes: 'Set', valor: 82 },
  { mes: 'Out', valor: 69 },
  { mes: 'Nov', valor: 76 },
]

export default function EmpresaConsumo() {
  const [aba, setAba] = useState<Aba>('visao-geral')

  const maiorConsumo = Math.max(...consumoMensal.map((item) => item.valor))

  return (
    <SubPagina
      titulo="Indicadores de consumo"
      descricao="Acompanhe os dados e indicadores de consumo de água dos moradores."
    >
      <div className="space-y-6">

        {/* Abas */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2 flex flex-wrap gap-2">
          <button
            onClick={() => setAba('visao-geral')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
              aba === 'visao-geral'
                ? 'bg-aqua-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={18} />
            Visão geral
          </button>

          <button
            onClick={() => setAba('inserir')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition ${
              aba === 'inserir'
                ? 'bg-aqua-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <PlusCircle size={18} />
            Inserir consumo
          </button>
        </div>

        {aba === 'visao-geral' ? (
          <>
            {/* Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Consumo total</span>
                  <div className="p-2 rounded-xl bg-aqua-50 text-aqua-700">
                    <Droplets size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">
                  1.248 m³
                </p>
                <span className="text-xs text-gray-400">
                  Novembro de 2026
                </span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Média por morador</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Users size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">
                  12,4 m³
                </p>
                <span className="text-xs text-gray-400">
                  Média mensal
                </span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Variação mensal</span>
                  <div className="p-2 rounded-xl bg-red-50 text-red-600">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">
                  +8,5%
                </p>
                <span className="text-xs text-red-500">
                  Em relação ao mês anterior
                </span>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Moradores monitorados</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Users size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">
                  100
                </p>
                <span className="text-xs text-gray-400">
                  Dados demonstrativos
                </span>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    Histórico de consumo
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Evolução do consumo total nos últimos seis meses.
                  </p>
                </div>

                <span className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={15} />
                  Junho – Novembro de 2026
                </span>
              </div>

              <div className="h-64 flex items-end justify-around gap-3 border-b border-l border-gray-100 px-2">
                {consumoMensal.map((item) => (
                  <div
                    key={item.mes}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                  >
                    <span className="text-xs text-gray-500">
                      {item.valor}%
                    </span>

                    <div
                      className="w-full max-w-12 bg-aqua-500 hover:bg-aqua-600 rounded-t-lg transition-all"
                      style={{
                        height: `${(item.valor / maiorConsumo) * 75}%`,
                      }}
                    />

                    <span className="text-xs text-gray-500">
                      {item.mes}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-5">
                Valores ilustrativos para demonstração da interface.
              </p>
            </div>

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800">
                  Análise do período
                </h3>

                <div className="flex items-center gap-3 mt-5">
                  <div className="p-3 rounded-xl bg-red-50 text-red-600">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Tendência de aumento
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      O consumo apresentou crescimento no último mês.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-800">
                  Acompanhamento
                </h3>

                <div className="flex items-center gap-3 mt-5">
                  <div className="p-3 rounded-xl bg-aqua-50 text-aqua-700">
                    <Droplets size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Monitoramento mensal
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Os indicadores serão atualizados conforme os dados forem disponibilizados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Aba de inserção */
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10">
            <div className="max-w-xl mx-auto text-center py-8">

              <div className="w-20 h-20 rounded-3xl bg-aqua-50 text-aqua-700 flex items-center justify-center mx-auto">
                <Droplets size={38} />
              </div>

              <span className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                <LockKeyhole size={14} />
                Disponível em breve
              </span>

              <h2 className="text-xl font-bold text-gray-800 mt-5">
                Inserção de consumo mensal
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed mt-3">
                Em breve, sua empresa poderá registrar o consumo mensal
                de cada morador, informando o volume em metros cúbicos
                e o mês de referência.
              </p>

              <div className="bg-aqua-50/70 border border-aqua-100 rounded-2xl p-5 mt-7 text-left">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-aqua-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-aqua-800">
                      Funcionalidade em desenvolvimento
                    </p>
                    <p className="text-xs text-aqua-700 mt-1 leading-relaxed">
                      O formulário de lançamento e o histórico individual
                      de consumo estarão disponíveis em uma próxima atualização.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">
                <div className="rounded-xl border border-gray-100 p-4">
                  <Users size={20} className="text-aqua-700 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    Selecionar morador
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <CalendarDays size={20} className="text-aqua-700 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    Definir referência
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <Droplets size={20} className="text-aqua-700 mb-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    Informar consumo
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SubPagina>
  )
}
