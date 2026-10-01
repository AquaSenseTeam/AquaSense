import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const ok = await login(email, senha)
      if (ok) navigate('/inicio')
      else setErro('E-mail ou senha incorretos.')
    } catch {
      setErro('Não foi possível conectar à API. Rode "npm run api".')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-center bg-aqua-900 p-16 text-white md:flex">
        <h1 className="text-2xl font-bold">Juntos por um uso mais consciente da água</h1>
        <ul className="mt-8 space-y-4 text-sm">
          <li>Registre vazamentos, falta de água e outros problemas.</li>
          <li>Acompanhe suas ocorrências em tempo real.</li>
          <li>Contribua para o uso consciente da água.</li>
        </ul>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={entrar} className="card w-full max-w-sm space-y-4 p-8">
          <p className="text-center text-sm font-semibold">Faça login para continuar</p>
          <input className="input" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          <div className="flex justify-between text-xs">
            <label className="flex items-center gap-1"><input type="checkbox" /> Lembrar-me</label>
            <a href="#" className="text-aqua-600">Esqueceu sua senha?</a>
          </div>
          {erro && <p className="text-xs text-red-600">{erro}</p>}
          <button className="btn w-full" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
          <button type="button" className="btn-outline w-full" onClick={() => alert('Login com Google: não implementado no protótipo.')}>
            Entrar com Google
          </button>
          <p className="text-center text-xs">
            Ainda não tem uma conta? <Link to="/cadastro" className="font-semibold text-aqua-600">Cadastre-se agora</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
