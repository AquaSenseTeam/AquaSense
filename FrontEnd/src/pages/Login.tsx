import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Droplet,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function entrar(e: FormEvent) {
  e.preventDefault()
  setErro('')
  setCarregando(true)

  try {
    const ok = await login(email, senha)

    if (ok) {
      const usuarioSalvo = localStorage.getItem('aquasense:usuario')

      if (!usuarioSalvo) {
        setErro('Não foi possível identificar o tipo de usuário.')
        return
      }

      const usuario = JSON.parse(usuarioSalvo) as { tipo: string }

      switch (usuario.tipo) {
        case 'ADMIN':
          navigate('/admin', { replace: true })
          break

        case 'EMPRESA':
          navigate('/empresa', { replace: true })
          break

        case 'MORADOR':
        default:
          navigate('/inicio', { replace: true })
          break
      }
    } else {
      setErro('E-mail ou senha incorretos.')
    }
  } catch {
    setErro(
      'Não foi possível conectar ao servidor. Verifique se o backend Spring Boot está iniciado.',
    )
  } finally {
    setCarregando(false)
  }
}

  return (
    <main className="min-h-screen bg-gray-50 md:grid md:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-aqua-900 via-aqua-600 to-aqua-300 p-10 text-white md:flex md:flex-col md:justify-between lg:p-14">
        <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <Link to="/login" className="relative inline-flex w-fit items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Droplet className="h-7 w-7" />
          </span>
          <span className="text-xl font-bold tracking-tight">AquaSense</span>
        </Link>

        <div className="relative my-12 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-aqua-50">
            <ShieldCheck className="h-4 w-4" />
            Conectando pessoas à gestão da água
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
            Juntos por um uso mais consciente da água.
          </h1>

          <p className="mt-5 text-base leading-relaxed text-aqua-50/90">
            Acompanhe seu consumo, registre problemas e ajude a construir comunidades mais sustentáveis.
          </p>

          <ul className="mt-8 space-y-5">
            {[
              'Registre vazamentos e falta de água',
              'Acompanhe suas ocorrências',
              'Receba atualizações importantes',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/95">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-200" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          AquaSense · Tecnologia a serviço da sustentabilidade.
        </p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 md:px-10 lg:px-14">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="mb-10 inline-flex items-center gap-2 text-lg font-bold text-aqua-800 md:hidden"
          >
            <Droplet className="h-7 w-7" />
            AquaSense
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-100 text-aqua-700">
              <Droplet className="h-7 w-7" />
            </div>

            <p className="text-sm font-semibold text-aqua-700">
              BEM-VINDA DE VOLTA
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-800">
              Entre na sua conta
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Acesse o AquaSense para acompanhar suas informações e ocorrências.
            </p>
          </div>

          <form
            onSubmit={entrar}
            className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <label className="block text-sm font-medium text-gray-700">
              E-mail
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Senha
              <div className="relative mt-2">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-aqua-700"
                >
                  {mostrarSenha ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 text-gray-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-aqua-600 focus:ring-aqua-500"
                />
                Lembrar-me
              </label>

              <span className="text-right text-gray-400">
                Esqueceu sua senha?
              </span>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-700"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-600/80 focus:outline-none focus:ring-2 focus:ring-aqua-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? 'Entrando...' : 'Entrar na minha conta'}
              {!carregando && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <p className="text-center text-sm text-gray-500">
              Ainda não tem uma conta?{' '}
              <Link
                to="/cadastro"
                className="font-semibold text-aqua-600 transition hover:text-aqua-900"
              >
                Cadastre-se
              </Link>
            </p>
          </form>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            Acesse sua conta com segurança.
          </p>
        </div>
      </section>
    </main>
  )
}