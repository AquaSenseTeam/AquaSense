import { Mail, ChevronDown, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SubPagina from '../../components/SubPagina'

const perguntas = [
  {
    p: 'Como registro uma ocorrência?',
    r: 'Vá em "Registrar ocorrência", escolha o tipo de problema, o endereço e descreva o que está acontecendo. Ao confirmar, ela é enviada para análise.',
  },
  {
    p: 'Como acompanho o andamento?',
    r: 'Em "Minhas ocorrências" você vê o status de cada registro (Em análise, Em andamento, Resolvida ou Recusada). Você também recebe uma notificação a cada atualização.',
  },
  {
    p: 'Posso cadastrar mais de um endereço?',
    r: 'Sim. Em Perfil > Endereços você adiciona, edita ou remove endereços. Ao registrar uma ocorrência, escolha em qual deles está o problema.',
  },
  {
    p: 'Como altero minha senha?',
    r: 'Em Perfil > Segurança, informe a senha atual e a nova senha, com no mínimo 8 caracteres.',
  },
  {
    p: 'Como deixo de receber certos avisos?',
    r: 'Em Perfil > Preferências de notificação você pode ligar ou desligar cada tipo de aviso.',
  },
]

export default function Ajuda() {
  return (
    <SubPagina
      titulo="Ajuda e suporte"
      descricao="Encontre respostas para suas dúvidas e saiba como entrar em contato com nossa equipe."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-700 shadow-sm">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                Como podemos ajudar?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Reunimos respostas para as dúvidas mais comuns sobre o uso do AquaSense.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-gray-800">Perguntas frequentes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Selecione uma pergunta para ver a resposta.
            </p>
          </div>

          <div className="divide-y divide-gray-100 px-5 sm:px-6">
            {perguntas.map(({ p, r }, index) => (
              <details key={p} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-sm font-semibold text-gray-700 outline-none transition hover:text-aqua-700 focus-visible:ring-2 focus-visible:ring-aqua-500 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-aqua-50 text-xs font-bold text-aqua-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="pt-1">{p}</span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 group-open:text-aqua-600" />
                </summary>
                <p className="ml-10 mt-3 pb-1 text-sm leading-relaxed text-gray-500">
                  {r}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-aqua-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800">
                Ainda precisa de ajuda?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Entre em contato com nossa equipe pelo e-mail abaixo.
              </p>
              <a
                href="mailto:aquasense@gmail.com"
                className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-aqua-700 transition hover:text-aqua-900"
              >
                <Mail className="h-4 w-4 shrink-0" />
                aquasense@gmail.com
              </a>
            </div>
            <a
              href="mailto:aquasense@gmail.com"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-aqua-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-aqua-700"
            >
              Falar com suporte
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <p className="text-center text-sm text-gray-500">
          Quer conhecer melhor o projeto?{' '}
          <Link
            to="/perfil/sobre"
            className="font-semibold text-aqua-700 transition hover:text-aqua-900"
          >
            Sobre o AquaSense
          </Link>
        </p>
      </div>
    </SubPagina>
  )
}