
import { useEffect, useState } from 'react'
import { Check, X, Building2, RefreshCw } from 'lucide-react'
import {
  adminEmpresaService,
  type Empresa,
} from '../services/adminEmpresaService'
import { ApiError } from '../services/api'

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [processando, setProcessando] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function carregarEmpresas() {
    try {
      setCarregando(true)
      setErro('')
      const dados = await adminEmpresaService.listarPendentes()
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

  async function analisarEmpresa(
    id: number,
    acao: 'aprovar' | 'rejeitar'
  ) {
    const confirmacao = window.confirm(
      acao === 'aprovar'
        ? 'Deseja aprovar o cadastro desta empresa?'
        : 'Deseja rejeitar o cadastro desta empresa?'
    )

    if (!confirmacao) return

    try {
      setProcessando(id)
      setErro('')
      setMensagem('')

      if (acao === 'aprovar') {
        await adminEmpresaService.aprovar(id)
      } else {
        await adminEmpresaService.rejeitar(id)
      }

      setEmpresas(atual =>
        atual.filter(empresa => empresa.id !== id)
      )

      setMensagem(
        acao === 'aprovar'
          ? 'Empresa aprovada com sucesso!'
          : 'Empresa rejeitada com sucesso!'
      )
    } catch (e) {
      setErro(
        e instanceof ApiError
          ? e.message
          : 'Não foi possível atualizar o cadastro.'
      )
    } finally {
      setProcessando(null)
    }
  }

  if (carregando) {
    return <p className="p-6">Carregando empresas...</p>
  }

  
  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Aprovação de empresas
          </h1>
          <p className="text-gray-500">
            Analise os cadastros das empresas de saneamento.
          </p>
        </div>

        <button
          onClick={carregarEmpresas}
          className="flex items-center gap-2 rounded-lg border px-4 py-2"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {erro && (
        <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {erro}
        </p>
      )}

      {mensagem && (
        <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
          {mensagem}
        </p>
      )}

      {empresas.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <Building2
            size={40}
            className="mx-auto mb-3 text-gray-400"
          />
          <h2 className="font-semibold">
            Nenhuma empresa pendente
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Todos os cadastros foram analisados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {empresas.map(empresa => (
            <article
              key={empresa.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {empresa.nome}
                  </h2>
                  <p className="text-sm text-gray-500">
                    CNPJ: {empresa.cnpj}
                  </p>
                  <p className="text-sm text-gray-500">
                    {empresa.email}
                  </p>
                </div>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Pendente
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    analisarEmpresa(empresa.id, 'aprovar')
                  }
                  disabled={processando !== null}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Check size={16} />
                  Aprovar
                </button>

                <button
                  onClick={() =>
                    analisarEmpresa(empresa.id, 'rejeitar')
                  }
                  disabled={processando !== null}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <X size={16} />
                  Rejeitar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
