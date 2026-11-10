import { useState, type FormEvent } from 'react'
import { LockKeyhole, ShieldCheck, Eye, EyeOff, Save, KeyRound } from 'lucide-react'
import SubPagina from '../../components/SubPagina'
import Mensagem, { type Msg } from '../../components/Mensagem'
import { usuarioService } from '../../services/usuarioService'
import { ApiError } from '../../services/api'

export default function Seguranca() {
  const [atual, setAtual] = useState('')
  const [nova, setNova] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [msg, setMsg] = useState<Msg | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [mostrarAtual, setMostrarAtual] = useState(false)
  const [mostrarNova, setMostrarNova] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)

  async function salvar(e: FormEvent) {
    e.preventDefault()
    setMsg(null)

    if (nova.length < 8) {
      setMsg({
        tipo: 'erro',
        texto: 'A nova senha precisa ter 8 caracteres ou mais.',
      })
      return
    }

    if (nova !== confirmar) {
      setMsg({
        tipo: 'erro',
        texto: 'As senhas não coincidem. Confira a confirmação.',
      })
      return
    }

    setSalvando(true)

    try {
      await usuarioService.alterarSenha(atual, nova)
      setAtual('')
      setNova('')
      setConfirmar('')
      setMsg({ tipo: 'ok', texto: 'Senha alterada com sucesso.' })
    } catch (err) {
      setMsg({
        tipo: 'erro',
        texto:
          err instanceof ApiError
            ? err.message
            : 'Não foi possível alterar a senha. Tente novamente.',
      })
    } finally {
      setSalvando(false)
    }
  }

  const campoSenha = (
    rotulo: string,
    valor: string,
    alterar: (valor: string) => void,
    mostrar: boolean,
    alternar: () => void,
    placeholder: string,
    autoComplete: string,
    minLength?: number,
  ) => (
    <label className="block text-sm font-medium text-gray-700">
      {rotulo}
      <div className="relative mt-2">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
          type={mostrar ? 'text' : 'password'}
          value={valor}
          onChange={(e) => alterar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          type="button"
          onClick={alternar}
          aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-aqua-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua-500"
        >
          {mostrar ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </label>
  )

  return (
    <SubPagina
      titulo="Segurança"
      descricao="Proteja sua conta e mantenha suas credenciais atualizadas."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-700 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Sua conta, protegida</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Use uma senha forte e não compartilhe suas credenciais com outras pessoas.
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={salvar}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Alterar senha</h3>
              <p className="mt-1 text-xs text-gray-500">
                Preencha os três campos para atualizar sua senha.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {campoSenha(
              'Senha atual',
              atual,
              setAtual,
              mostrarAtual,
              () => setMostrarAtual((v) => !v),
              'Digite sua senha atual',
              'current-password',
            )}

            {campoSenha(
              'Nova senha',
              nova,
              setNova,
              mostrarNova,
              () => setMostrarNova((v) => !v),
              'Mínimo de 8 caracteres',
              'new-password',
              8,
            )}

            {campoSenha(
              'Confirmar nova senha',
              confirmar,
              setConfirmar,
              mostrarConfirmar,
              () => setMostrarConfirmar((v) => !v),
              'Digite novamente a nova senha',
              'new-password',
              8,
            )}

            <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Dica de segurança
                </p>
                <p className="mt-1 text-xs leading-relaxed text-blue-800">
                  Escolha uma senha com pelo menos 8 caracteres e evite reutilizar senhas de outros serviços.
                </p>
              </div>
            </div>

            <Mensagem msg={msg} />
          </div>

          <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {salvando ? 'Atualizando...' : 'Atualizar senha'}
            </button>
          </div>
        </form>
      </div>
    </SubPagina>
  )
}