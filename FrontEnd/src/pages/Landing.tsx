import { Link } from "react-router-dom";
import {
  Droplet,
  Clock,
  Users,
  Leaf,
  ArrowUpRight,
  Mail,
  Feather,
} from "lucide-react";

import GitHub from "@mui/icons-material/GitHub";

import mockupLogin from "../assets/mockupLogin.png";
import torneira from "../assets/torneira.png";
import solucao from "../assets/solucao.png";

const passos = [
  {
    Icone: Droplet,
    titulo: "Registre Ocorrências",
    texto:
      "Informe vazamentos, falta de água e outros problemas de saneamento.",
  },
  {
    Icone: Clock,
    titulo: "Acompanhe o andamento",
    texto: "Veja o status da sua ocorrência e receba atualizações.",
  },
  {
    Icone: Users,
    titulo: "Conecte a comunidade",
    texto: "Ajude a tornar sua cidade mais eficiente e sustentável.",
  },
  {
    Icone: Leaf,
    titulo: "Preserve o futuro",
    texto: "Cada informação contribui para o uso consciente da água.",
  },
];

// Onda que inicia uma seção azul-marinho.
function OndaEntradaEscura() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="block h-[100px] w-full"
      aria-hidden="true"
    >
      <path
        d="
          M0 35
          C170 85 245 115 430 82
          C620 48 750 0 940 8
          C1130 15 1280 45 1440 70
          L1440 120
          L0 120
          Z
        "
        fill="#064477"
      />
    </svg>
  );
}

// Onda que encerra uma seção azul-marinho.
function OndaSaidaEscura() {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className="block h-[90px] w-full"
      aria-hidden="true"
    >
      <path
        d="
          M0 0
          L1440 0
          L1440 48
          C1280 105 1160 120 990 72
          C800 18 720 8 540 65
          C350 125 180 85 0 35
          Z
        "
        fill="#064477"
      />
    </svg>
  );
}

export default function Landing() {
  return (
    <main className="overflow-hidden bg-[#E8F3F9] text-[#064477]">
      {/* CABEÇALHO */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 lg:px-12">
        <Link to="/inicio" className="flex shrink-0 items-center gap-2">
          <Droplet size={38} strokeWidth={2.5} className="text-[#168BC5]" />

          <div>
            <span className="block text-xl font-extrabold leading-none">
              AquaSense
            </span>
            <span className="text-[9px] tracking-wider text-gray-500">
              Sua cidade, nossa água
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <a href="#inicio" className="border-b-2 border-[#168BC5] pb-1">
            Início
          </a>

          <a href="#projeto" className="transition hover:text-[#279CCB]">
            Sobre o projeto
          </a>

          <a href="#contato" className="transition hover:text-[#279CCB]">
            Contato
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/cadastro"
            className="rounded-full bg-[#064477] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0875A8]"
          >
            Começar
          </Link>

          <Link
            to="/login"
            className="rounded-full border border-[#064477] px-5 py-2.5 text-xs font-semibold transition hover:bg-[#064477] hover:text-white"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section
        id="inicio"
        className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-6 pb-28 pt-10 lg:grid-cols-2 lg:px-16"
      >
        <div className="relative z-10 max-w-xl">
          <p className="mb-2 text-sm font-bold text-gray-900 md:text-base">
            Comunique. Acompanhe. Preserve.
          </p>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#064477] md:text-5xl lg:text-[54px]">
            A água da cidade também está{" "}
            <span className="text-[#399CC1]">nas suas mãos.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-gray-600 md:text-base">
            O AquaSense conecta você aos serviços de saneamento para comunicar
            ocorrências de forma simples e eficiente.
          </p>

          <Link
            to="/cadastro"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#064477] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-1 hover:bg-[#0875A8]"
          >
            Conheça o AquaSense
            <ArrowUpRight size={19} />
          </Link>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <img
            src={mockupLogin}
            alt="Demonstração da plataforma AquaSense em um notebook"
            className="relative z-10 left-96 max-w-[1000px]"
          />
        </div>

        {/* ONDA DO HERO */}
      </section>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#C4E6FA" fill-opacity="1" d="M0,128L30,128C60,128,120,128,180,149.3C240,171,300,213,360,208C420,203,480,149,540,138.7C600,128,660,160,720,170.7C780,181,840,171,900,160C960,149,1020,139,1080,160C1140,181,1200,235,1260,261.3C1320,288,1380,288,1410,288L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg> */}

      {/* ETAPAS */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#BDD5E8"
          fill-opacity="1"
          d="M0,96L48,85.3C96,75,192,53,288,80C384,107,480,181,576,213.3C672,245,768,235,864,229.3C960,224,1056,224,1152,197.3C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <section className="bg-[#BDD5E8] px-6 py-10 lg:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(({ Icone, titulo, texto }) => (
            <article key={titulo} className="flex flex-col items-start">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D6EAF7] text-[#064477]">
                <Icone size={29} strokeWidth={1.8} />
              </div>

              <h2 className="text-base font-bold text-gray-900">{titulo}</h2>

              <p className="mt-2 max-w-xs text-xs leading-5 text-gray-600">
                {texto}
              </p>
            </article>
          ))}
        </div>
      </section>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#bdd5e8" fill-opacity="1" d="M0,192L60,176C120,160,240,128,360,138.7C480,149,600,203,720,229.3C840,256,960,256,1080,240C1200,224,1320,192,1380,176L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      {/* PROBLEMA E SOLUÇÃO */}
      <section
        id="projeto"
        className="mx-auto max-w-7xl space-y-20 px-6 py-20 lg:px-16 lg:py-24"
      >
        {/* O PROBLEMA */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-extrabold text-[#9BBBD5] md:text-3xl">
              O Problema
            </h2>

            <div className="rounded-[42px] border border-white/70 bg-white/40 p-7 shadow-[inset_0_0_25px_rgba(255,255,255,0.7)] md:p-9">
              <h3 className="text-xl font-bold leading-relaxed text-[#064477]">
                Problemas com a água não podem esperar.
              </h3>

              <p className="mt-6 text-sm font-medium leading-7 text-[#399CC1]">
                Vazamentos, falta de água e outros problemas no abastecimento
                podem afetar casas, comércios e empresas, além de contribuir
                para o desperdício de um recurso essencial. Muitas vezes, a
                dificuldade está justamente em comunicar o problema e acompanhar
                sua resolução.
              </p>

              <p className="mt-2 text-sm font-medium leading-7 text-[#399CC1]">
                O AquaSense surge para tornar esse processo mais simples,
                aproximando quem identifica o problema de quem pode
                solucioná-lo.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={torneira}
              alt="Torneira com uma gota de água"
              className="w-full max-w-[430px] object-contain"
            />
          </div>
        </div>

        {/* NOSSA SOLUÇÃO */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="order-2 flex justify-center md:order-1">
            <img
              src={solucao}
              alt="Mão segurando uma lâmpada iluminada"
              className="w-full max-w-[440px] object-contain"
            />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="mb-6 text-2xl font-extrabold text-[#9BBBD5] md:text-3xl">
              Nossa solução
            </h2>

            <div className="rounded-[42px] border border-white/70 bg-white/40 p-7 shadow-[inset_0_0_25px_rgba(255,255,255,0.7)] md:p-9">
              <h3 className="text-center text-xl font-bold leading-relaxed text-[#064477]">
                Uma solução que conecta pessoas e saneamento.
              </h3>

              <p className="mt-5 text-sm font-medium leading-7 text-[#399CC1]">
                Com o AquaSense, a população pode registrar ocorrências
                relacionadas ao abastecimento de água e acompanhar suas
                informações de maneira organizada.
              </p>

              <p className="mt-5 text-sm font-medium leading-7 text-[#399CC1]">
                A plataforma centraliza os registros e facilita o encaminhamento
                das ocorrências para a empresa responsável pelo saneamento,
                contribuindo para uma comunicação mais eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CADA GOTA IMPORTA */}
      <section className="bg-[#E8F3F9]">
        {/* ENTRADA DA SEÇÃO AZUL */}
        <OndaEntradaEscura />

        <div className="bg-[#064477] px-6 py-14 text-white lg:px-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#8BC8E9]/40 bg-[#8BC8E9]/20 text-[#A8DDF6]">
                <Feather size={43} strokeWidth={1.4} />
              </div>

              <h2 className="mt-4 text-xl font-bold">
                Informar. Conectar. Preservar.
              </h2>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold">Cada gota importa.</h2>

              <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/90">
                A água é um recurso essencial e seu desperdício afeta toda a
                sociedade. Ao facilitar a identificação e comunicação de
                problemas, o AquaSense contribui para uma utilização mais
                consciente dos recursos hídricos.
              </p>
            </div>
          </div>
        </div>

        {/* SAÍDA DA SEÇÃO AZUL */}
        <OndaSaidaEscura />
      </section>

      {/* RODAPÉ */}
      <footer
        id="contato"
        className="relative mt-40 bg-[#064477] px-6 pb-8 pt-12 text-white lg:px-16"
      >
        {/* CURVA SUPERIOR DO RODAPÉ */}
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-full left-0 h-[80px] w-full"
          aria-hidden="true"
        >
          <path
            d="
              M0 40
              C180 5 300 0 460 65
              C620 125 700 100 860 50
              C1050 -5 1160 0 1300 45
              C1360 65 1400 85 1440 100
              L1440 110
              L0 110
              Z
            "
            fill="#064477"
          />
        </svg>

        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#A8DDF6]">AquaSense</h2>

            <p className="mt-3 max-w-xs text-sm font-medium leading-6">
              Tecnologia conectando pessoas, saneamento e sustentabilidade.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm font-semibold md:items-end">
            <a href="#inicio" className="transition hover:text-[#A8DDF6]">
              Início
            </a>

            <a href="#projeto" className="transition hover:text-[#A8DDF6]">
              Sobre o projeto
            </a>

            <a href="#contato" className="transition hover:text-[#A8DDF6]">
              Contato
            </a>
          </nav>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center gap-5 pt-6 text-xs font-medium sm:flex-row">
          <a
            href="https://github.com/AquaSenseTeam"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition hover:text-[#A8DDF6]"
          >
            <GitHub />
            AquaSenseTeam
          </a>

          <a
            href="mailto:support.aquasense@gmail.com"
            className="flex items-center gap-2 transition hover:text-[#A8DDF6]"
          >
            <Mail size={19} />
            support.aquasense@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
