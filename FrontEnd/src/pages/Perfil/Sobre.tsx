import { Droplet, Clock, Users, Leaf } from 'lucide-react'
import SubPagina from '../../components/SubPagina'
import Logo from '../../components/Logo'

const pilares = [
  { Icone: Droplet, titulo: 'Informar', texto: 'Registre vazamentos, falta de água e outros problemas de saneamento.' },
  { Icone: Clock, titulo: 'Acompanhar', texto: 'Veja o status das suas ocorrências e receba atualizações.' },
  { Icone: Users, titulo: 'Conectar', texto: 'Aproxime quem identifica o problema de quem pode solucioná-lo.' },
  { Icone: Leaf, titulo: 'Preservar', texto: 'Cada informação contribui para o uso consciente da água.' },
]

export default function Sobre() {
  return (
    <SubPagina titulo="Sobre o AquaSense" descricao="Saiba mais sobre o nosso projeto.">
      <div className="card space-y-3">
        <Logo />
        <p className="text-sm leading-relaxed">
          O AquaSense conecta você aos serviços de saneamento para comunicar ocorrências de forma simples e eficiente.
          A plataforma centraliza os registros e facilita o encaminhamento das ocorrências para a empresa responsável,
          contribuindo para uma comunicação mais eficiente.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {pilares.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="card flex gap-3">
            <Icone className="h-8 w-8 shrink-0 rounded-full bg-aqua-100 p-1.5 text-aqua-600" />
            <div>
              <p className="text-sm font-semibold">{titulo}</p>
              <p className="text-xs">{texto}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-aqua-900 p-4 text-white">
        <p className="font-bold">Cada gota importa.</p>
        <p className="text-sm">Informar. Conectar. Preservar.</p>
      </div>
      <p className="text-center text-xs">AquaSense · versão 1.0 · aquasense@gmail.com</p>
    </SubPagina>
  )
}
