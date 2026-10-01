import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplet, CircleX, ChartNoAxesColumn, Ellipsis } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { ocorrenciaService } from '../services/ocorrenciaService'
import { usuarioService } from '../services/usuarioService'
import { tipoLabel } from '../utils/format'
import type { TipoOcorrencia } from '../types'

const tipos = [
  { valor: 'VAZAMENTO' as TipoOcorrencia, Icone: Droplet, texto: 'Informe um vazamento de água na sua residência, comércio ou na rua.' },
  { valor: 'FALTA_DE_AGUA' as TipoOcorrencia, Icone: CircleX, texto: 'Registre a falta de água na sua região.' },
  { valor: 'AUMENTO_DE_CONSUMO' as TipoOcorrencia, Icone: ChartNoAxesColumn, texto: 'Identifique um possível aumento anormal no seu consumo.' },
  { valor: 'OUTROS' as TipoOcorrencia, Icone: Ellipsis, texto: 'Outros problemas relacionados ao saneamento.' },
]
const titulos = ['Tipo', 'Local', 'Detalhes', 'Confirmação']

export default function RegistrarOcorrencia() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const id = usuario!.id
  const en = useCarregar(() => usuarioService.listarEnderecos(id), [id], [])
  const [passo, setPasso] = useState(1)
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null)
  const [enderecoId, setEnderecoId] = useState<number | null>(null)
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')

  const podeAvancar = (passo === 1 && tipo) || (passo === 2 && enderecoId) || passo >= 3

  async function enviar() {
    try {
      await ocorrenciaService.criar({
        usuarioId: id, enderecoId: enderecoId!, tipo: tipo!, descricao,
        status: 'EM_ANALISE', dataRegistro: new Date().toISOString(),
      })
      navigate('/ocorrencias')
    } catch {
      setErro('Não foi possível registrar. A API está rodando?')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Registrar ocorrência</h1>
        <p className="text-sm">Informe os detalhes do problema para que possamos ajudar.</p>
      </div>
      <div className="flex items-center justify-between">
        {titulos.map((t, i) => (
          <div key={t} className="flex flex-1 items-center gap-2 text-xs">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${passo >= i + 1 ? 'bg-aqua-600' : 'bg-aqua-300'}`}>{i + 1}</span>
            <span className="hidden sm:inline">{t}</span>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        {passo === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {tipos.map(({ valor, Icone, texto }) => (
              <button key={valor} onClick={() => setTipo(valor)}
                className={`flex gap-3 rounded-xl border-2 p-4 text-left ${tipo === valor ? 'border-aqua-600 bg-aqua-100' : 'border-transparent bg-aqua-100/50'}`}>
                <Icone className="h-8 w-8 shrink-0 text-aqua-600" />
                <div>
                  <p className="font-bold">{tipoLabel[valor]}</p>
                  <p className="text-xs">{texto}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {passo === 2 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Onde está o problema?</p>
            {en.dados.map((e) => (
              <label key={e.id} className="flex items-center gap-2 rounded-lg border border-aqua-300 p-3 text-sm">
                <input type="radio" name="end" checked={enderecoId === e.id} onChange={() => setEnderecoId(e.id)} />
                {e.logradouro}, {e.numero} - {e.cidade}/{e.estado}
              </label>
            ))}
            {en.dados.length === 0 && <p className="text-sm">Nenhum endereço cadastrado. Adicione um no seu perfil.</p>}
          </div>
        )}
        {passo === 3 && (
          <label className="block text-sm font-semibold">
            Descreva o que está acontecendo
            <textarea className="input mt-2 h-32" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
        )}
        {passo === 4 && (
          <div className="space-y-1 text-sm">
            <p><b>Tipo:</b> {tipo && tipoLabel[tipo]}</p>
            <p><b>Local:</b> {en.dados.find((e) => e.id === enderecoId)?.logradouro}</p>
            <p><b>Descrição:</b> {descricao || '—'}</p>
            {erro && <p className="text-red-600">{erro}</p>}
          </div>
        )}
        <div className="flex justify-between">
          <button className="btn-outline" disabled={passo === 1} onClick={() => setPasso(passo - 1)}>Voltar</button>
          {passo < 4
            ? <button className="btn" disabled={!podeAvancar} onClick={() => setPasso(passo + 1)}>Próximo</button>
            : <button className="btn" onClick={enviar}>Registrar ocorrência</button>}
        </div>
      </div>
    </div>
  )
}
