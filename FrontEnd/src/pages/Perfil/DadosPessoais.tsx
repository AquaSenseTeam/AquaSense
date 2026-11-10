import { useState, type FormEvent } from 'react'
import { UserRound, Phone, Mail, ShieldCheck, Save, UserRoundCheck } from 'lucide-react'
import SubPagina from '../../components/SubPagina'
import Mensagem, { type Msg } from '../../components/Mensagem'
import { useAuth } from '../../contexts/AuthContext'
import { usuarioService } from '../../services/usuarioService'
import { ApiError } from '../../services/api'

export default function DadosPessoais() {
  const { usuario, atualizar } = useAuth()

  const [nome, setNome] = useState(usuario!.nomeCompleto)
  const [telefone, setTelefone] = useState(usuario!.telefone ?? '')
  const [msg, setMsg] = useState<Msg | null>(null)
  const [salvando, setSalvando] = useState(false)

  async function salvar(e: FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSalvando(true)

    try {
      const resposta = await usuarioService.atualizar({
        nomeCompleto: nome.trim(),
        telefone: telefone.trim(),
      })

      atualizar(resposta)
      setMsg({
        tipo: 'ok',
        texto: 'Seus dados foram atualizados com sucesso.',
      })
    } catch (err) {
      setMsg({
        tipo: 'erro',
        texto:
          err instanceof ApiError
            ? err.message
            : 'Não foi possível salvar suas alterações. Tente novamente.',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <SubPagina
      titulo="Dados pessoais"
      descricao="Gerencie suas informações pessoais e mantenha seu cadastro atualizado."
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-aqua-700 shadow-sm">
            <UserRoundCheck className="h-7 w-7" />
          </div>

          <div>
            <h2 className="font-bold text-gray-800">Suas informações</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Confira seus dados e atualize as informações que mudaram.
            </p>
          </div>
        </div>

        <form
          onSubmit={salvar}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Informações básicas</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Os campos marcados como editáveis podem ser atualizados abaixo.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
              Nome completo
              <div className="relative mt-2">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                  maxLength={150}
                  required
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Telefone
              <div className="relative mt-2">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                  maxLength={20}
                />
              </div>
              <span className="mt-1.5 block text-xs font-normal text-gray-400">
                Informe um telefone para contato.
              </span>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              CPF
              <div className="relative mt-2">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  value={usuario!.cpf}
                  disabled
                  readOnly
                />
              </div>
              <span className="mt-1.5 block text-xs font-normal text-gray-400">
                Dado protegido, não editável nesta tela.
              </span>
            </label>

            <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
              E-mail
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  type="email"
                  value={usuario!.email}
                  disabled
                  readOnly
                />
              </div>
            </label>
          </div>

          <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:mx-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Seus dados estão protegidos
              </p>
              <p className="mt-1 text-xs leading-relaxed text-blue-800">
                Para solicitar alterações no CPF ou no e-mail, entre em contato
                com o suporte do AquaSense.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
            <Mensagem msg={msg} />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={salvando}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Save className="h-4 w-4" />
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </SubPagina>
  )
}