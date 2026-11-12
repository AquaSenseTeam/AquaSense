
import { useEffect, useState, type FormEvent } from 'react'
import { MapPin, Plus, Trash2, LoaderCircle } from 'lucide-react'
import { api, ApiError } from '../services/api'

interface CidadeAtendida {
  id: number
  cidade: string
  estado: string
}

export default function EmpresaCidades() {
  const [cidades, setCidades] = useState<CidadeAtendida[]>([])
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [removendo, setRemovendo] = useState<number | null>(null)

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarCidades() {
    try {
      setErro('')
      const resposta = await api<CidadeAtendida[]>('/empresa/cidades')
      setCidades(resposta)
    } catch (error) {
      setErro(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível carregar as cidades atendidas.',
      )
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarCidades()
  }, [])

  async function adicionarCidade(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (!cidade.trim() || estado.length !== 2) {
      setErro('Informe uma cidade e a sigla do estado.')
      return
    }

    try {
      setSalvando(true)

      const novaCidade = await api<CidadeAtendida>('/empresa/cidades', {
        method: 'POST',
        body: JSON.stringify({
          cidade: cidade.trim(),
          estado: estado.toUpperCase(),
        }),
      })

      setCidades(atual => [...atual, novaCidade])
      setCidade('')
      setEstado('')
      setSucesso('Cidade adicionada com sucesso!')
    } catch (error) {
      if (error instanceof ApiError) {
        setErro(error.message)
      } else {
        setErro('Não foi possível adicionar a cidade.')
      }
    } finally {
      setSalvando(false)
    }
  }

  async function removerCidade(id: number) {
    const confirmar = window.confirm(
      'Tem certeza de que deseja remover esta cidade da área de atendimento?',
    )

    if (!confirmar) return

    setErro('')
    setSucesso('')

    try {
      setRemovendo(id)

      await api<void>(`/empresa/cidades/${id}`, {
        method: 'DELETE',
      })

      setCidades(atual => atual.filter(item => item.id !== id))
      setSucesso('Cidade removida com sucesso!')
    } catch (error) {
      setErro(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível remover a cidade.',
      )
    } finally {
      setRemovendo(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Cidades atendidas
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie os municípios em que sua empresa presta serviços de
          saneamento.
        </p>
      </div>

      {erro && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {sucesso}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-800">
          Adicionar município
        </h2>

        <form
          onSubmit={adicionarCidade}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              type="text"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              placeholder="Ex.: Sorocaba"
              maxLength={100}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-aqua-600"
            />
          </div>

          <div className="w-full sm:w-28">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Estado (UF)
            </label>
            <input
              type="text"
              value={estado}
              onChange={e =>
                setEstado(e.target.value.toUpperCase().slice(0, 2))
              }
              placeholder="SP"
              maxLength={2}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 uppercase outline-none transition focus:border-aqua-600"
            />
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="flex items-center justify-center gap-2 rounded-lg bg-aqua-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-aqua-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {salvando ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="font-semibold text-gray-800">
              Área de atendimento
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {cidades.length} {cidades.length === 1 ? 'município cadastrado' : 'municípios cadastrados'}
            </p>
          </div>
          <MapPin className="h-6 w-6 text-aqua-700" />
        </div>

        {carregando ? (
          <div className="flex justify-center p-10">
            <LoaderCircle className="h-6 w-6 animate-spin text-aqua-700" />
          </div>
        ) : cidades.length === 0 ? (
          <div className="p-10 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-700">
              Nenhuma cidade cadastrada
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Adicione o primeiro município da sua área de atendimento.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {cidades.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-aqua-50 p-2">
                    <MapPin className="h-5 w-5 text-aqua-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.cidade}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.estado}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removerCidade(item.id)}
                  disabled={removendo === item.id}
                  title="Remover cidade"
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {removendo === item.id ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
