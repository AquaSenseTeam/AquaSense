import { useState } from 'react'
import { Droplet, Calendar, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '../components/StatCard'
import TabsFilter from '../components/TabsFilter'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { consumoService } from '../services/consumoService'
import { mesCurto } from '../utils/format'

type Aba = 'geral' | 'historico' | 'comparativo' | 'dicas'
const abas = [
  { valor: 'geral' as Aba, rotulo: 'Visão geral' },
  { valor: 'historico' as Aba, rotulo: 'Histórico' },
  { valor: 'comparativo' as Aba, rotulo: 'Comparativo' },
  { valor: 'dicas' as Aba, rotulo: 'Dicas' },
]
const dicas = [
  'Verifique vazamentos em torneiras e encanamentos.',
  'Tome banhos mais curtos.',
  'Use a água de forma mais consciente no dia a dia.',
]

export default function MeuConsumo() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState<Aba>('geral')
  const { dados, erro } = useCarregar(() => consumoService.listar(usuario!.id), [usuario!.id], [])

  const volumes = dados.map((d) => d.volumeM3)
  const atual = volumes.at(-1) ?? 0
  const anterior = volumes.at(-2) ?? 0
  const media = volumes.length ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0
  const maior = Math.max(0, ...volumes)
  const variacao = anterior ? Math.round(((atual - anterior) / anterior) * 100) : 0
  const grafico = dados.map((d) => ({ mes: mesCurto(d.mesReferencia), volume: d.volumeM3 }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Meu consumo</h1>
        <p className="text-sm">Acompanhe seu consumo de água e identifique possíveis variações.</p>
      </div>
      <TabsFilter abas={abas} ativa={aba} onChange={setAba} />
      {erro && <p className="text-sm text-red-600">{erro}</p>}

      {aba === 'geral' && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icone={<Droplet />} rotulo="Consumo atual" valor={`${atual} m³`} detalhe={`${variacao}% em relação ao mês anterior`} />
            <StatCard icone={<Calendar />} rotulo="Média mensal" valor={`${media.toFixed(1)} m³`} />
            <StatCard icone={<TrendingUp />} rotulo="Maior consumo" valor={`${maior} m³`} />
          </div>
          <div className="card h-72">
            <p className="mb-2 text-sm font-semibold">Consumo mensal (m³)</p>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={grafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" /><YAxis /><Tooltip />
                <Bar dataKey="volume" fill="#1e8fd0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {aba === 'historico' && (
        <div className="card">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-aqua-700"><tr><th className="p-2">Mês</th><th className="p-2">Volume</th></tr></thead>
            <tbody>
              {[...dados].reverse().map((d) => (
                <tr key={d.id} className="border-t border-aqua-100"><td className="p-2">{d.mesReferencia}</td><td className="p-2">{d.volumeM3} m³</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {aba === 'comparativo' && (
        <div className="card text-sm">
          <p>Este mês: <b>{atual} m³</b></p>
          <p>Mês anterior: <b>{anterior} m³</b></p>
          <p>Variação: <b>{variacao}%</b></p>
        </div>
      )}
      {aba === 'dicas' && (
        <div className="card">
          <p className="mb-2 font-semibold">Dicas de economia de água</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">{dicas.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
