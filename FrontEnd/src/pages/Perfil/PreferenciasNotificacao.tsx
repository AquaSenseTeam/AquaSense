import { useState } from 'react'
import SubPagina from '../../components/SubPagina'
import Mensagem, { type Msg } from '../../components/Mensagem'
import { useCarregar } from '../../hooks'
import { preferenciaService, type Preferencias } from '../../services/preferenciaService'

const padrao: Preferencias = { receberOcorrencia: true, receberSistema: true, receberDicas: true, receberAlertaConsumo: true }
const opcoes: { chave: keyof Preferencias; titulo: string; texto: string }[] = [
  { chave: 'receberOcorrencia', titulo: 'Ocorrências', texto: 'Avisos sobre o registro e o andamento das suas ocorrências.' },
  { chave: 'receberSistema', titulo: 'Sistema', texto: 'Atualizações e comunicados do AquaSense.' },
  { chave: 'receberDicas', titulo: 'Dicas de economia', texto: 'Sugestões para usar a água de forma mais consciente.' },
  { chave: 'receberAlertaConsumo', titulo: 'Alertas de consumo', texto: 'Aviso quando seu consumo variar bastante.' },
]

export default function PreferenciasNotificacao() {
  const { dados, setDados, erro } = useCarregar(() => preferenciaService.obter(), [], padrao)
  const [msg, setMsg] = useState<Msg | null>(null)

  async function alternar(chave: keyof Preferencias) {
    const anterior = dados
    setDados({ ...dados, [chave]: !dados[chave] }) // atualiza na hora; desfaz se falhar
    try {
      setDados(await preferenciaService.atualizar({ [chave]: !anterior[chave] }))
      setMsg({ tipo: 'ok', texto: 'Preferência salva.' })
    } catch {
      setDados(anterior)
      setMsg({ tipo: 'erro', texto: 'Não foi possível salvar a preferência.' })
    }
  }

  return (
    <SubPagina titulo="Preferências de notificação" descricao="Escolha quando e como receber notificações.">
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <Mensagem msg={msg} />
      <ul className="card divide-y divide-aqua-100 p-0">
        {opcoes.map(({ chave, titulo, texto }) => (
          <li key={chave} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="text-sm font-semibold">{titulo}</p>
              <p className="text-xs">{texto}</p>
            </div>
            <button role="switch" aria-checked={dados[chave]} aria-label={titulo} onClick={() => alternar(chave)}
              className={`relative h-6 w-11 rounded-full transition ${dados[chave] ? 'bg-aqua-600' : 'bg-aqua-300'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${dados[chave] ? 'left-5' : 'left-0.5'}`} />
            </button>
          </li>
        ))}
      </ul>
    </SubPagina>
  )
}
