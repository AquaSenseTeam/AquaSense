/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  MapPin,
  FileText,
  LoaderCircle,
  BadgeCheck,
} from "lucide-react";

import SubPagina from "../components/SubPagina";
import Mensagem, { type Msg } from "../components/Mensagem";
import { ApiError } from "../services/api";
import {
  empresaService,
  type EmpresaDetalhes,
} from "../services/empresaService";

export default function EmpresaPerfil() {
  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);

  const [nomeFantasia, setNomeFantasia] = useState("");
  const [telefone, setTelefone] = useState("");

  const [carregando, setCarregando] = useState(true);

  const [msg, setMsg] = useState<Msg | null>(null);

  async function carregarDados() {
    try {
      setMsg(null);

      const resposta = await empresaService.buscarMeusDados();

      setEmpresa(resposta);
      setNomeFantasia(resposta.nomeFantasia ?? "");
      setTelefone(resposta.telefone ?? "");
    } catch (error) {
      setMsg({
        tipo: "erro",
        texto:
          error instanceof ApiError
            ? error.message
            : "Não foi possível carregar os dados da empresa.",
      });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDados();
  }, []);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMsg({
      tipo: "erro",
      texto: "A edição dos dados ainda não está disponível.",
    });
  }

  const status = {
    APROVADA: {
      texto: "Aprovada",
      classe: "bg-green-50 text-green-700 border-green-200",
    },
    PENDENTE: {
      texto: "Em análise",
      classe: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    REJEITADA: {
      texto: "Rejeitada",
      classe: "bg-red-50 text-red-700 border-red-200",
    },
  };

  return (
    <SubPagina
      titulo="Dados da empresa"
      descricao="Consulte as informações cadastrais da sua empresa no AquaSense."
    >
      {carregando ? (
        <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-12">
          <LoaderCircle className="h-7 w-7 animate-spin text-aqua-700" />
        </div>
      ) : !empresa ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-700">
            Não foi possível carregar os dados da empresa.
          </p>
          <button
            type="button"
            onClick={carregarDados}
            className="mt-4 rounded-xl bg-aqua-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-aqua-700"
          >
            Tentar novamente
          </button>
          <div className="mt-4">
            <Mensagem msg={msg} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-aqua-700 shadow-sm">
              <Building2 className="h-7 w-7" />
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-gray-800">
                {empresa.nomeFantasia || empresa.nome}
              </h2>
              <p className="mt-1 text-sm text-gray-500">Cadastro empresarial</p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status[empresa.statusAprovacao].classe}`}
            >
              <BadgeCheck className="h-4 w-4" />
              {status[empresa.statusAprovacao].texto}
            </span>
          </div>

          <form
            onSubmit={salvar}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    Informações cadastrais
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Consulte os dados registrados da sua empresa.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
                Razão social
                <div className="relative mt-2">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    value={empresa.nome}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
                Nome fantasia
                <div className="relative mt-2">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                    maxLength={150}
                    placeholder="Nome fantasia da empresa"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                CNPJ
                <div className="relative mt-2">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    value={empresa.cnpj}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Telefone
                <div className="relative mt-2">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    maxLength={20}
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
                E-mail
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={empresa.email ?? ""}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium text-gray-700 sm:col-span-2">
                Município de cadastro
                <div className="relative mt-2">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    value={[empresa.cidade, empresa.estado]
                      .filter(Boolean)
                      .join(" - ")}
                    disabled
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>
              </label>
            </div>

            <div className="mx-5 mb-5 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:mx-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Informações protegidas
                </p>
                <p className="mt-1 text-xs leading-relaxed text-blue-800">
                  A razão social, o CNPJ e o e-mail são informações protegidas
                  nesta tela. Para solicitar alterações, entre em contato com o
                  suporte do AquaSense.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
              <Mensagem msg={msg} />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                    Salvar alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </SubPagina>
  );
}
