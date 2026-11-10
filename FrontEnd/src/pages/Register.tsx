import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Droplet,
  UserRound,
  MapPin,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { usuarioService } from "../services/usuarioService";
import { ApiError } from "../services/api";
import { buscarEnderecoPorCep, formatarCep } from "../services/cepService";

const inicial = {
  nomeCompleto: "",
  cpf: "",
  email: "",
  telefone: "",
  senha: "",
  confirmar: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [f, setF] = useState(inicial);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [mensagemCep, setMensagemCep] = useState("");

  async function preencherEnderecoPeloCep(cep: string) {
    setBuscandoCep(true);
    setMensagemCep("");

    try {
      const endereco = await buscarEnderecoPorCep(cep);

      setF((anterior) => ({
        ...anterior,
        logradouro: endereco.logradouro,
        cidade: endereco.localidade,
        estado: endereco.uf,
      }));

      setMensagemCep("Endereço encontrado! Confira os dados.");
    } catch (erro) {
      setMensagemCep(
        erro instanceof Error
          ? erro.message
          : "Não foi possível consultar o CEP.",
      );
    } finally {
      setBuscandoCep(false);
    }
  }

  const mudar = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep") {
      const cep = value.replace(/\D/g, "").slice(0, 8);

      setF((anterior) => ({ ...anterior, cep }));
      setMensagemCep("");

      if (cep.length === 8) {
        void preencherEnderecoPeloCep(cep);
      }

      return;
    }

    setF((anterior) => ({ ...anterior, [name]: value }));
  };
  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (f.senha.length < 8) {
      setErro("A senha precisa ter 8 caracteres ou mais.");
      return;
    }

    if (f.senha !== f.confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await usuarioService.cadastrar({
        nomeCompleto: f.nomeCompleto,
        cpf: f.cpf,
        email: f.email,
        telefone: f.telefone,
        senha: f.senha,
        endereco: {
          cep: f.cep,
          logradouro: f.logradouro,
          numero: f.numero,
          complemento: f.complemento,
          cidade: f.cidade,
          estado: f.estado,
        },
      });

      navigate("/login");
    } catch (e) {
      setErro(
        e instanceof ApiError
          ? e.message
          : "Não foi possível concluir o cadastro. Verifique se a API está rodando.",
      );
    } finally {
      setCarregando(false);
    }
  }

  const campo = (
    name: keyof typeof inicial,
    rotulo: string,
    ph = "",
    type = "text",
    obrigatorio = true,
  ) => {
    const senha = name === "senha" || name === "confirmar";
    const mostrar = name === "senha" ? mostrarSenha : mostrarConfirmacao;

    return (
      <label key={name} className="block text-sm font-medium text-gray-700">
        {rotulo}
        <div className="relative mt-2">
          <input
            className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100 ${
              senha ? "pr-12" : ""
            }`}
            name={name}
            type={senha ? (mostrar ? "text" : "password") : type}
            placeholder={ph}
            value={
              name === "cep" ? formatarCep(String(f[name] ?? "")) : f[name]
            }
            onChange={mudar}
            required={obrigatorio}
            autoComplete={
              name === "nomeCompleto"
                ? "name"
                : name === "email"
                  ? "email"
                  : name === "telefone"
                    ? "tel"
                    : name === "senha"
                      ? "new-password"
                      : name === "confirmar"
                        ? "new-password"
                        : name === "cep"
                          ? "postal-code"
                          : "off"
            }
            maxLength={
              name === "cpf"
                ? 14
                : name === "estado"
                  ? 2
                  : name === "telefone"
                    ? 20
                    : name === "cep"
                      ? 9
                      : undefined
            }
            minLength={senha ? 8 : undefined}
          />

          {senha && (
            <button
              type="button"
              onClick={() =>
                name === "senha"
                  ? setMostrarSenha((v) => !v)
                  : setMostrarConfirmacao((v) => !v)
              }
              aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:text-aqua-700"
            >
              {mostrar ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 md:grid md:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-aqua-900 via-aqua-600 to-aqua-300 p-10 text-white md:flex md:flex-col md:justify-between lg:p-14">
        <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full border border-white/10" />

        <Link
          to="/login"
          className="relative inline-flex w-fit items-center gap-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Droplet className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold tracking-tight">AquaSense</span>
        </Link>

        <div className="relative my-12 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-aqua-50">
            <Droplet className="h-4 w-4" />
            Cuidado com a água, cuidado com o futuro
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight lg:text-5xl">
            Faça parte de uma comunidade mais consciente.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-aqua-50/90">
            Cadastre-se para registrar problemas, acompanhar ocorrências e
            contribuir para uma gestão melhor da água.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Registre vazamentos e falta de água",
              "Acompanhe o andamento das ocorrências",
              "Receba atualizações importantes",
              "Descubra formas de economizar água",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-white/95"
              >
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

      <main className="flex items-center justify-center px-4 py-8 sm:px-8 md:px-10 lg:px-14">
        <div className="w-full max-w-2xl">
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-aqua-700 md:hidden"
          >
            <Droplet className="h-6 w-6" />
            AquaSense
          </Link>

          <div className="mb-7">
            <p className="text-sm font-semibold text-aqua-700">
              CRIE SUA CONTA
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-800">
              Boas-vindas ao AquaSense!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Preencha seus dados para começar. Os campos marcados são
              obrigatórios.
            </p>
          </div>

          <form onSubmit={enviar} className="space-y-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Dados pessoais</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Informações para identificar sua conta.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  {campo(
                    "nomeCompleto",
                    "Nome completo",
                    "Digite seu nome completo",
                  )}
                </div>
                {campo("cpf", "CPF", "000.000.000-00")}
                {campo("telefone", "Telefone", "(11) 99999-9999", "tel", false)}
                <div className="sm:col-span-2">
                  {campo("email", "E-mail", "voce@exemplo.com", "email")}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Crie sua senha</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Utilize pelo menos 8 caracteres.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {campo("senha", "Senha", "Mínimo de 8 caracteres", "password")}
                {campo(
                  "confirmar",
                  "Confirmar senha",
                  "Digite a senha novamente",
                  "password",
                )}
              </div>

              <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="h-4 w-4 shrink-0 text-aqua-600" />
                Não compartilhe sua senha com outras pessoas.
              </p>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Seu endereço</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Endereço inicial para vincular às suas ocorrências.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  {campo("cep", "CEP", "00000-000")}

                  {buscandoCep && (
                    <p className="mt-2 text-xs text-gray-500">
                      Buscando endereço...
                    </p>
                  )}

                  {!buscandoCep && mensagemCep && (
                    <p
                      role="status"
                      className={`mt-2 text-xs ${
                        mensagemCep.startsWith("Endereço encontrado")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {mensagemCep}
                    </p>
                  )}
                </div>
                {campo("estado", "Estado (UF)", "SP")}
                <div className="sm:col-span-2">
                  {campo("logradouro", "Rua ou avenida", "Nome do logradouro")}
                </div>
                {campo("numero", "Número", "Número do imóvel")}
                {campo(
                  "complemento",
                  "Complemento",
                  "Apto, bloco, etc.",
                  "text",
                  false,
                )}
                <div className="sm:col-span-2">
                  {campo("cidade", "Cidade", "Nome da cidade")}
                </div>
              </div>
            </section>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-600/80 focus:outline-none focus:ring-2 focus:ring-aqua-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Criando sua conta..." : "Criar minha conta"}
              {!carregando && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-semibold text-aqua-600 transition hover:text-aqua-900"
              >
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
