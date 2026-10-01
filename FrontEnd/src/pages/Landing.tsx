import { Link } from 'react-router-dom'
import { Droplet, Clock, Users, Leaf } from 'lucide-react'

const passos = [
  { Icone: Droplet, titulo: 'Registre ocorrências', texto: 'Informe vazamentos, falta de água e outros problemas de saneamento.' },
  { Icone: Clock, titulo: 'Acompanhe o andamento', texto: 'Veja o status da sua ocorrência e receba atualizações.' },
  { Icone: Users, titulo: 'Conecte a comunidade', texto: 'Ajude a tornar sua cidade mais eficiente e sustentável.' },
  { Icone: Leaf, titulo: 'Preserve o futuro', texto: 'Cada informação contribui para o uso consciente da água.' },
]

export default function Landing() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 md:px-16">
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#inicio">Início</a>
          <a href="#projeto">Sobre o projeto</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="flex gap-2">
          <Link to="/cadastro" className="btn">Começar</Link>
          <Link to="/login" className="btn-outline">Log in</Link>
        </div>
      </header>

      <section id="inicio" className="px-6 py-16 md:px-16">
        <p className="text-sm font-semibold">Comunique. Acompanhe. Preserve.</p>
        <h1 className="mt-2 max-w-xl text-4xl font-bold md:text-5xl">
          A água da cidade também está nas <span className="text-aqua-600">suas mãos.</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm">
          O AquaSense conecta você aos serviços de saneamento para comunicar ocorrências de forma simples e eficiente.
        </p>
        <Link to="/cadastro" className="btn mt-6 inline-block">Conheça o AquaSense</Link>
      </section>

      <section className="grid gap-6 bg-aqua-300 px-6 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-16">
        {passos.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="text-center">
            <Icone className="mx-auto mb-2 h-10 w-10 rounded-full bg-white p-2 text-aqua-600" />
            <h3 className="font-semibold">{titulo}</h3>
            <p className="text-xs">{texto}</p>
          </div>
        ))}
      </section>

      <section id="projeto" className="grid gap-8 px-6 py-16 md:grid-cols-2 md:px-16">
        <div className="card">
          <h2 className="text-xl font-bold">Problemas com a água não podem esperar.</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Vazamentos, falta de água e outros problemas no abastecimento podem afetar casas, comércios e empresas,
            além de contribuir para o desperdício de um recurso essencial. Muitas vezes, a dificuldade está em comunicar
            o problema e acompanhar sua resolução.
          </p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold">Uma solução que conecta pessoas e saneamento.</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Com o AquaSense, a população pode registrar ocorrências relacionadas ao abastecimento de água e acompanhar
            suas informações de maneira organizada. A plataforma centraliza os registros e facilita o encaminhamento
            à empresa responsável.
          </p>
        </div>
      </section>

      <section className="bg-aqua-900 px-6 py-12 text-white md:px-16">
        <h2 className="text-2xl font-bold">Cada gota importa.</h2>
        <p className="mt-2 max-w-xl text-sm">
          A água é um recurso essencial e seu desperdício afeta toda a sociedade. Ao facilitar a identificação e a
          comunicação de problemas, o AquaSense contribui para uma utilização mais consciente dos recursos hídricos.
        </p>
      </section>

      <footer id="contato" className="bg-aqua-900 px-6 py-8 text-sm text-white md:px-16">
        <p className="font-semibold">AquaSense</p>
        <p>Tecnologia conectando pessoas, saneamento e sustentabilidade.</p>
        <p className="mt-3">aquasense@gmail.com</p>
      </footer>
    </>
  )
}
