import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usuarioService } from '../services/usuarioService'

const inicial = {
  nomeCompleto: '', cpf: '', email: '', telefone: '', senha: '', confirmar: '',
  cep: '', logradouro: '', numero: '', complemento: '', cidade: '', estado: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [f, setF] = useState(inicial)
  const [erro, setErro] = useState('')

  const mudar = (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [e.target.name]: e.target.value })

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (f.senha.length < 8) return setErro('A senha precisa ter 8 caracteres ou mais.')
    if (f.senha !== f.confirmar) return setErro('As senhas não coincidem.')
    try {
      const u = await usuarioService.cadastrar({
        nomeCompleto: f.nomeCompleto, cpf: f.cpf, email: f.email, telefone: f.telefone, senha: f.senha,
      })
      await usuarioService.criarEndereco({
        usuarioId: u.id, cep: f.cep, logradouro: f.logradouro, numero: f.numero,
        complemento: f.complemento, cidade: f.cidade, estado: f.estado,
      })
      navigate('/login')
    } catch {
      setErro('Não foi possível concluir o cadastro. A API está rodando?')
    }
  }

  const campo = (name: keyof typeof inicial, rotulo: string, ph = '', type = 'text') => (
    <label className="block text-xs font-medium">
      {rotulo}
      <input className="input mt-1" name={name} type={type} placeholder={ph} value={f[name]} onChange={mudar}
        required={!['complemento', 'telefone'].includes(name)} />
    </label>
  )

  return (
    <div className="grid min-h-screen md:grid-cols-[2fr_1fr]">
      <form onSubmit={enviar} className="p-6 md:p-12">
        <h1 className="mt-6 text-center text-2xl font-bold">Crie sua conta</h1>
        <p className="mb-6 text-center text-xs">Preencha os dados abaixo para começar a usar o AquaSense</p>
        <div className="grid gap-6 rounded-2xl bg-aqua-300 p-6 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-bold">Dados pessoais</h2>
            {campo('nomeCompleto', 'Nome completo', 'Digite seu nome')}
            {campo('cpf', 'CPF', '000.000.000-00')}
            {campo('email', 'E-mail', 'exemplo@email.com', 'email')}
            {campo('telefone', 'Telefone', '(11)99999-9999')}
            <h2 className="pt-2 font-bold">Senha</h2>
            {campo('senha', 'Senha', 'Mínimo de 8 caracteres', 'password')}
            {campo('confirmar', 'Confirmar senha', 'Repita sua senha', 'password')}
          </div>
          <div className="space-y-3">
            <h2 className="font-bold">Endereço</h2>
            {campo('cep', 'CEP', '00000-000')}
            {campo('logradouro', 'Endereço', 'Rua, Av, etc')}
            {campo('numero', 'Número', 'Número')}
            {campo('complemento', 'Complemento', 'Apto, Bloco, etc')}
            {campo('cidade', 'Cidade', 'Cidade')}
            {campo('estado', 'Estado', 'UF')}
          </div>
        </div>
        {erro && <p className="mt-3 text-center text-sm text-red-600">{erro}</p>}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button className="btn">Cadastrar</button>
          <Link to="/login" className="btn text-center">Já tem uma conta? Faça login</Link>
        </div>
      </form>
      <aside className="hidden bg-aqua-300 p-10 md:block">
        <h2 className="text-xl font-bold">Faça parte do AquaSense!</h2>
        <p className="mt-2 text-sm">Juntos podemos construir cidades mais sustentáveis e com melhor gestão da água.</p>
        <ul className="mt-6 space-y-4 text-sm font-medium">
          <li>Registre ocorrências</li><li>Receba notificações</li>
          <li>Acompanhe o andamento</li><li>Economize água</li>
        </ul>
      </aside>
    </div>
  )
}
