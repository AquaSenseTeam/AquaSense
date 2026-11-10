import { useState, type ChangeEvent, type FormEvent } from "react";
import { MapPin, Pencil, Trash2, Plus, X, Save, MapPinned } from "lucide-react";
import SubPagina from "../../components/SubPagina";
import Mensagem, { type Msg } from "../../components/Mensagem";
import { useCarregar } from "../../hooks";
import {
  usuarioService,
  type DadosEndereco,
} from "../../services/usuarioService";
import { ApiError } from "../../services/api";
import type { Endereco } from "../../types";
import { buscarEnderecoPorCep, formatarCep } from "../../services/cepService";

const vazio: DadosEndereco = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  cidade: "",
  estado: "",
};

const campos: {
  nome: keyof DadosEndereco;
  rotulo: string;
  ph: string;
}[] = [
  { nome: "cep", rotulo: "CEP", ph: "00000-000" },
  { nome: "logradouro", rotulo: "Endereço", ph: "Rua, avenida, etc." },
  { nome: "numero", rotulo: "Número", ph: "Número do imóvel" },
  {
    nome: "complemento",
    rotulo: "Complemento",
    ph: "Apto, bloco, etc. (opcional)",
  },
  { nome: "cidade", rotulo: "Cidade", ph: "Nome da cidade" },
  { nome: "estado", rotulo: "Estado (UF)", ph: "Ex.: SP" },
];

export default function Enderecos() {
  const { dados, setDados, erro } = useCarregar(
    () => usuarioService.listarEnderecos(),
    [],
    [],
  );

  const [form, setForm] = useState<DadosEndereco>(vazio);
  const [editando, setEditando] = useState<number | null>(null);
  const [aberto, setAberto] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [mensagemCep, setMensagemCep] = useState("");

  const falha = (e: unknown) =>
    setMsg({
      tipo: "erro",
      texto:
        e instanceof ApiError ? e.message : "Algo deu errado. Tente novamente.",
    });

  const mudar = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep") {
      const cep = value.replace(/\D/g, "").slice(0, 8);

      setForm((anterior) => ({ ...anterior, cep }));
      setMensagemCep("");

      if (cep.length === 8) {
        void preencherEnderecoPeloCep(cep);
      }

      return;
    }

    setForm((anterior) => ({ ...anterior, [name]: value }));
  };

  async function preencherEnderecoPeloCep(cep: string) {
    setBuscandoCep(true);
    setMensagemCep("");

    try {
      const endereco = await buscarEnderecoPorCep(cep);

      setForm((anterior) => ({
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

  function novo() {
    setForm({ ...vazio });
    setEditando(null);
    setAberto(true);
    setMsg(null);
    setMensagemCep("");
  }

  function editar(endereco: Endereco) {
    setForm({
      cep: endereco.cep,
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento ?? "",
      cidade: endereco.cidade,
      estado: endereco.estado,
    });
    setEditando(endereco.id);
    setAberto(true);
    setMsg(null);
  }

  function cancelar() {
    setAberto(false);
    setEditando(null);
    setForm({ ...vazio });
    setMsg(null);
    setMensagemCep("");
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    try {
      if (editando !== null) {
        await usuarioService.atualizarEndereco(editando, form);
      } else {
        await usuarioService.criarEndereco(form);
      }

      setDados(await usuarioService.listarEnderecos());
      setAberto(false);
      setEditando(null);
      setForm({ ...vazio });
      setMsg({ tipo: "ok", texto: "Endereço salvo com sucesso." });
    } catch (err) {
      falha(err);
    }
  }

  async function remover(id: number) {
    if (!confirm("Tem certeza de que deseja remover este endereço?")) return;

    setMsg(null);

    try {
      await usuarioService.removerEndereco(id);
      setDados(await usuarioService.listarEnderecos());
      setMsg({ tipo: "ok", texto: "Endereço removido com sucesso." });
    } catch (err) {
      falha(err);
    }
  }

  return (
    <SubPagina
      titulo="Meus endereços"
      descricao="Gerencie os locais vinculados à sua conta no AquaSense."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-aqua-100 bg-gradient-to-br from-aqua-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-600 shadow-sm">
              <MapPinned className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                Seus locais cadastrados
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Mantenha seus endereços atualizados para facilitar o registro de
                ocorrências.
              </p>
            </div>
          </div>

          {!aberto && (
            <button
              type="button"
              onClick={novo}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-aqua-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar endereço
            </button>
          )}
        </div>

        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <Mensagem msg={msg} />

        {aberto && (
          <form
            onSubmit={salvar}
            className="overflow-hidden rounded-2xl border border-aqua-100 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aqua-100 text-aqua-700">
                  {editando !== null ? (
                    <Pencil className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    {editando !== null ? "Editar endereço" : "Novo endereço"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Preencha os dados do local abaixo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelar}
                aria-label="Fechar formulário"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              {campos.map(({ nome, rotulo, ph }) => (
                <label
                  key={nome}
                  className={`block text-sm font-medium text-gray-700 ${
                    nome === "logradouro" || nome === "complemento"
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  {rotulo}
                  <input
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
                    name={nome}
                    placeholder={ph}
                    value={
                      nome === "cep"
                        ? formatarCep(form.cep)
                        : (form[nome] ?? "")
                    }
                    onChange={mudar}
                    maxLength={nome === "estado" ? 2 : undefined}
                    autoComplete={
                      nome === "cep"
                        ? "postal-code"
                        : nome === "logradouro"
                          ? "street-address"
                          : nome === "numero"
                            ? "off"
                            : nome === "cidade"
                              ? "address-level2"
                              : nome === "estado"
                                ? "address-level1"
                                : "address-line2"
                    }
                    required={nome !== "complemento"}
                  />

                  {nome === "cep" && (
                    <span
                      role="status"
                      className={`mt-2 block text-xs ${
                        buscandoCep
                          ? "text-gray-500"
                          : mensagemCep.startsWith("Endereço encontrado")
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {buscandoCep ? "Buscando endereço..." : mensagemCep}
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={cancelar}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
              >
                <Save className="h-4 w-4" />
                Salvar endereço
              </button>
            </div>
          </form>
        )}

        {dados.length === 0 && !aberto ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-50 text-aqua-600">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-bold text-gray-800">
              Nenhum endereço cadastrado
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Adicione seu primeiro endereço para vinculá-lo às ocorrências
              registradas no AquaSense.
            </p>
            <button
              type="button"
              onClick={novo}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-aqua-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-aqua-700"
            >
              <Plus className="h-4 w-4" />
              Cadastrar primeiro endereço
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dados.map((endereco) => (
              <article
                key={endereco.id}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-aqua-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700 transition group-hover:bg-aqua-100">
                  <MapPin className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words font-semibold text-gray-800">
                    {endereco.logradouro}, {endereco.numero}
                    {endereco.complemento ? ` — ${endereco.complemento}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {endereco.cidade}/{endereco.estado}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    CEP {endereco.cep}
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => editar(endereco)}
                    aria-label={`Editar endereço ${endereco.logradouro}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-aqua-100 px-3 py-2.5 text-sm font-medium text-aqua-700 transition hover:bg-aqua-50 sm:flex-none"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => remover(endereco.id)}
                    aria-label={`Remover endereço ${endereco.logradouro}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </SubPagina>
  );
}
