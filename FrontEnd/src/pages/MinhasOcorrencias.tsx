import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../contexts/AuthContext'
import { useCarregar } from '../hooks'
import { ocorrenciaService } from '../services/ocorrenciaService'
import { usuarioService } from '../services/usuarioService'
import { tipoLabel, statusLabel, formatarData } from '../utils/format'

export default function MinhasOcorrencias() {
  const { usuario } = useAuth()
  const id = usuario!.id
  const oc = useCarregar(() => ocorrenciaService.listar(id), [id], [])
  const en = useCarregar(() => usuarioService.listarEnderecos(id), [id], [])
  const [tipo, setTipo] = useState('')
  const [status, setStatus] = useState('')

  const filtradas = useMemo(
    () => oc.dados.filter((o) => (!tipo || o.tipo === tipo) && (!status || o.status === status)),
    [oc.dados, tipo, status],
  )
  const enderecoDe = (eid: number) => {
    const e = en.dados.find((x) => x.id === eid)
    return e ? `${e.logradouro}, ${e.numero}` : '-'
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Minhas ocorrências</h1>
        <p className="text-sm">Acompanhe o status de todas as suas ocorrências.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select className="input w-auto" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Todos os tipos</option>
          {Object.entries(tipoLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          {Object.entries(statusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Link to="/ocorrencias/nova" className="btn ml-auto">+ Nova ocorrência</Link>
      </div>
      {oc.erro && <p className="text-sm text-red-600">{oc.erro}</p>}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-aqua-700">
            <tr><th className="p-2">Tipo</th><th className="p-2">Endereço</th><th className="p-2">Data</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {filtradas.map((o) => (
              <tr key={o.id} className="border-t border-aqua-100">
                <td className="p-2">{tipoLabel[o.tipo]}</td>
                <td className="p-2">{enderecoDe(o.enderecoId)}</td>
                <td className="p-2">{formatarData(o.dataRegistro)}</td>
                <td className="p-2"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!oc.carregando && filtradas.length === 0 && <p className="p-4 text-sm">Nenhuma ocorrência encontrada.</p>}
      </div>
      <p className="text-xs">Mostrando {filtradas.length} de {oc.dados.length} ocorrências</p>
    </div>
  )
}
