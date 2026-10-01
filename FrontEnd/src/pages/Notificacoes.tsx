import { useState } from 'react'
import { Droplet, CircleCheck, Bell, ChartNoAxesColumn, Faucet } from 'lucide-react'
import TabsFilter from '../components/TabsFilter'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { notificacaoService } from '../services/notificacaoService'
import { formatarData } from '../utils/format'
import type { TipoNotificacao } from '../types'

type Aba = 'todos' | TipoNotificacao
const abas = [
  { valor: 'todos' as Aba, rotulo: 'Todos' },
  { valor: 'OCORRENCIA' as Aba, rotulo: 'Ocorrência' },
  { valor: 'SISTEMA' as Aba, rotulo: 'Sistema' },
  { valor: 'DICA' as Aba, rotulo: 'Dicas' },
]
const icones = { OCORRENCIA: Droplet, SISTEMA: CircleCheck, DICA: Faucet, ALERTA_CONSUMO: ChartNoAxesColumn }

export default function Notificacoes() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState<Aba>('todos')
  const { dados, setDados, erro } = useCarregar(() => notificacaoService.listar(usuario!.id), [usuario!.id], [])

  const lista = dados.filter((n) => aba === 'todos' || n.tipo === aba || (aba === 'OCORRENCIA' && n.tipo === 'ALERTA_CONSUMO'))

  async function ler(id: number) {
    await notificacaoService.marcarComoLida(id)
    setDados(dados.map((n) => (n.id === id ? { ...n, lida: true } : n)))
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Notificações</h1>
        <p className="text-sm">Fique por dentro de todas as atualizações.</p>
      </div>
      <TabsFilter abas={abas} ativa={aba} onChange={setAba} />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <ul className="space-y-2">
        {lista.map((n) => {
          const Icone = icones[n.tipo] ?? Bell
          return (
            <li key={n.id} onClick={() => !n.lida && ler(n.id)}
              className={`card flex cursor-pointer items-start gap-3 ${n.lida ? 'opacity-70' : 'border-l-4 border-aqua-600'}`}>
              <Icone className="mt-1 h-5 w-5 text-aqua-600" />
              <div className="text-sm">
                <p className="font-semibold">{n.titulo}</p>
                <p className="text-xs">{n.mensagem}</p>
                <p className="text-[11px] text-aqua-700">{formatarData(n.dataHora)}</p>
              </div>
            </li>
          )
        })}
        {lista.length === 0 && <li className="text-sm">Nenhuma notificação por aqui.</li>}
      </ul>
    </div>
  )
}
