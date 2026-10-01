import { useNavigate } from 'react-router-dom'
import { User, MapPin, Bell, Shield, CircleHelp, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const secoes = [
  { Icone: User, titulo: 'Dados pessoais', texto: 'Nome, telefone, endereço e muito mais' },
  { Icone: MapPin, titulo: 'Endereços', texto: 'Gerencie seus endereços cadastrados.' },
  { Icone: Bell, titulo: 'Preferências de notificação', texto: 'Escolha quando e como receber notificações.' },
  { Icone: Shield, titulo: 'Segurança', texto: 'Altere sua senha e gerencie o acesso.' },
  { Icone: CircleHelp, titulo: 'Ajuda e suporte', texto: 'Tire suas dúvidas e entre em contato.' },
  { Icone: Info, titulo: 'Sobre o AquaSense', texto: 'Saiba mais sobre o nosso projeto.' },
]

export default function Perfil() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Meu perfil</h1>
        <p className="text-sm">Gerencie seus dados e preferências.</p>
      </div>
      <div className="card flex items-center gap-4">
        <span className="h-16 w-16 rounded-full bg-aqua-100" />
        <div className="flex-1">
          <p className="text-lg font-bold">{usuario!.nomeCompleto}</p>
          <p className="text-sm text-aqua-600">{usuario!.email}</p>
        </div>
        <button className="btn-outline">Editar</button>
      </div>
      <ul className="card space-y-4">
        {secoes.map(({ Icone, titulo, texto }) => (
          <li key={titulo} className="flex items-center gap-3">
            <Icone className="h-5 w-5 text-aqua-600" />
            <div>
              <p className="text-sm font-semibold">{titulo}</p>
              <p className="text-xs">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => { logout(); navigate('/') }}
        className="w-full rounded-lg border border-red-500 py-3 text-red-500 hover:bg-red-50">
        Sair da conta
      </button>
    </div>
  )
}
