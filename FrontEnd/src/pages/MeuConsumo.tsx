import { useState } from 'react'
import {
  Droplet,
  Calendar,
  TrendingUp,
  Activity,
  Lightbulb,
  History,
  ArrowLeftRight,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../components/StatCard'
import TabsFilter from '../components/TabsFilter'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { consumoService } from '../services/consumoService'
import { dicaService } from '../services/dicaService'
import { mesCurto } from '../utils/format'

type Aba = 'geral' | 'historico' | 'comparativo' | 'dicas'

const abas = [
  { valor: 'geral' as Aba, rotulo: 'Visão geral' },
  { valor: 'historico' as Aba, rotulo: 'Histórico' },
  { valor: 'comparativo' as Aba, rotulo: 'Comparativo' },
  { valor: 'dicas' as Aba, rotulo: 'Dicas' },
]

const numero = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
  })

export default function MeuConsumo() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState<Aba>('geral')

  const {
    dados: consumos,
    erro,
  } = useCarregar(
    () => consumoService.listar(usuario!.id),
    [usuario!.id],
    [],
  )

  const { dados: dicas } = useCarregar(
    () => dicaService.listar(),
    [],
    [],
  )

  const dados = [...consumos].sort((a, b) =>
    (a.mesReferencia ?? '').localeCompare(b.mesReferencia ?? ''),
  )

  const volumes = dados.map((d) => d.volumeM3)
  const atual = volumes.at(-1) ?? 0
  const anterior = volumes.at(-2) ?? 0
  const media = volumes.length
    ? volumes.reduce((a, b) => a + b, 0) / volumes.length
    : 0
  const maior = Math.max(0, ...volumes)
  const variacao = anterior
    ? Math.round(((atual - anterior) / anterior) * 100)
    : 0

  const grafico = dados.map((d) => ({
    mes: mesCurto(d.mesReferencia),
    volume: d.volumeM3,
  }))

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-700 shadow-sm">
            <Droplet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              Meu consumo
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
              Acompanhe seu consumo de água, compare os meses e descubra maneiras de economizar.
            </p>
          </div>
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl">
        <TabsFilter
          abas={abas}
          ativa={aba}
          onChange={(valor) => setAba(valor as Aba)}
        />
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      {aba === 'geral' && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icone={<Droplet />}
              rotulo="Consumo mais recente"
              valor={`${numero(atual)} m³`}
              detalhe={
                anterior
                  ? `${variacao > 0 ? '+' : ''}${variacao}% em relação ao mês anterior`
                  : 'Ainda sem mês anterior para comparar'
              }
            />
            <StatCard
              icone={<Calendar />}
              rotulo="Média mensal"
              valor={`${numero(media)} m³`}
              detalhe={`Com base em ${dados.length} ${dados.length === 1 ? 'registro' : 'registros'}`}
            />
            <StatCard
              icone={<TrendingUp />}
              rotulo="Maior consumo"
              valor={`${numero(maior)} m³`}
              detalhe="Maior valor registrado no histórico"
            />
          </div>

          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">
                  Evolução do consumo
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Volume mensal de água em metros cúbicos (m³).
                </p>
              </div>
            </div>

            {grafico.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-5 text-center">
                <Droplet className="h-9 w-9 text-aqua-300" />
                <p className="mt-3 font-semibold text-gray-700">
                  Ainda não há dados de consumo
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Quando houver registros, eles aparecerão neste gráfico.
                </p>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={grafico}
                    margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5edf0"
                    />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: '#eaf7fb' }}
                      formatter={(value) => [`${value} m³`, 'Consumo']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #dcecf0',
                      }}
                    />
                    <Bar
                      dataKey="volume"
                      name="Consumo"
                      fill="#1e8fd0"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {anterior > 0 && (
            <section className="flex items-start gap-3 rounded-2xl border border-aqua-100 bg-aqua-50/70 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-700">
                {variacao > 0 ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {variacao > 0
                    ? 'Seu consumo aumentou'
                    : variacao < 0
                      ? 'Seu consumo diminuiu'
                      : 'Seu consumo permaneceu estável'}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {variacao > 0
                    ? `O registro mais recente está ${variacao}% acima do mês anterior. Vale conferir se houve mudança na rotina ou algum possível vazamento.`
                    : variacao < 0
                      ? `O registro mais recente está ${Math.abs(variacao)}% abaixo do mês anterior. Continue acompanhando seus hábitos de consumo.`
                      : 'O registro mais recente tem o mesmo volume do mês anterior.'}
                </p>
              </div>
            </section>
          )}
        </div>
      )}

      {aba === 'historico' && (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Histórico de consumo</h2>
              <p className="mt-1 text-xs text-gray-500">
                Consulte os volumes registrados por mês.
              </p>
            </div>
          </div>

          {dados.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Nenhum registro de consumo disponível.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Mês de referência</th>
                    <th className="px-5 py-4 text-right">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...dados].reverse().map((d) => (
                    <tr
                      key={d.id}
                      className="transition hover:bg-aqua-50/40"
                    >
                      <td className="px-5 py-4 font-medium text-gray-700">
                        {d.mesReferencia}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-aqua-700">
                        {numero(d.volumeM3)} m³
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {aba === 'comparativo' && (
        <section className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Comparativo mensal</h2>
              <p className="mt-1 text-sm text-gray-500">
                Compare o registro mais recente com o anterior.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Registro mais recente</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {numero(atual)} <span className="text-base font-medium text-gray-400">m³</span>
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Registro anterior</p>
              <p className="mt-2 text-3xl font-bold text-gray-800">
                {numero(anterior)} <span className="text-base font-medium text-gray-400">m³</span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Gauge className="h-6 w-6 text-aqua-700" />
              <p className="font-semibold text-gray-700">Variação do consumo</p>
            </div>
            <p className="mt-3 text-4xl font-bold text-aqua-700">
              {anterior > 0 ? `${variacao > 0 ? '+' : ''}${variacao}%` : '—'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {anterior > 0
                ? variacao > 0
                  ? 'Houve aumento em relação ao registro anterior.'
                  : variacao < 0
                    ? 'Houve redução em relação ao registro anterior.'
                    : 'Não houve variação entre os dois registros.'
                : 'É necessário ter dois registros para calcular a variação.'}
            </p>
          </div>
        </section>
      )}

      {aba === 'dicas' && (
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                Dicas para economizar água
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Pequenas mudanças podem fazer a diferença.
              </p>
            </div>
          </div>

          {dicas.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Nenhuma dica disponível no momento.
            </p>
          ) : (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {dicas.map((d, index) => (
                <article
                  key={d.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-aqua-200 hover:bg-aqua-50/40"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-aqua-700 shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{d.titulo}</h3>
                      {d.descricao && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-500">
                          {d.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}