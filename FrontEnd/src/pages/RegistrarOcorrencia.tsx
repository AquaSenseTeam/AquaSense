import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, CircleX, ChartNoAxesColumn, Ellipsis } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCarregar } from "../hooks";
import { ocorrenciaService } from "../services/ocorrenciaService";
import { usuarioService } from "../services/usuarioService";
import { tipoLabel } from "../utils/format";
import type { TipoOcorrencia } from "../types";

const tipos = [
  {
    valor: "VAZAMENTO" as TipoOcorrencia,
    Icone: Droplet,
    texto:
      "Informe um vazamento de água na sua residência, comércio ou na rua.",
  },
  {
    valor: "FALTA_DE_AGUA" as TipoOcorrencia,
    Icone: CircleX,
    texto: "Registre a falta de água na sua região.",
  },
  {
    valor: "AUMENTO_DE_CONSUMO" as TipoOcorrencia,
    Icone: ChartNoAxesColumn,
    texto: "Identifique um possível aumento anormal no seu consumo.",
  },
  {
    valor: "OUTROS" as TipoOcorrencia,
    Icone: Ellipsis,
    texto: "Outros problemas relacionados ao saneamento.",
  },
];
const titulos = ["Tipo", "Local", "Detalhes", "Confirmação"];

export default function RegistrarOcorrencia() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const id = usuario!.id;
  const en = useCarregar(() => usuarioService.listarEnderecos(id), [id], []);
  const [passo, setPasso] = useState(1);
  const [tipo, setTipo] = useState<TipoOcorrencia | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [usarLocalizacaoAtual, setUsarLocalizacaoAtual] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  const podeAvancar =
    (passo === 1 && tipo !== null) ||
    (passo === 2 && (enderecoId !== null || usarLocalizacaoAtual)) ||
    passo >= 3;

  function obterLocalizacao() {
    setMensagemLocalizacao("");

    if (!navigator.geolocation) {
      setMensagemLocalizacao(
        "Seu navegador não oferece suporte à geolocalização.",
      );
      return;
    }

    setBuscandoLocalizacao(true);

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        setLocalizacao({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        });

        setUsarLocalizacaoAtual(true);
        setEnderecoId(null);

        setMensagemLocalizacao("Localização obtida com sucesso!");
        setBuscandoLocalizacao(false);
      },
      () => {
        setMensagemLocalizacao(
          "Não foi possível obter sua localização. Verifique a permissão do navegador ou informe o endereço manualmente.",
        );
        setBuscandoLocalizacao(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  async function enviar() {
    try {
      await ocorrenciaService.criar({
        enderecoId: usarLocalizacaoAtual ? null : enderecoId,
        latitude: usarLocalizacaoAtual ? localizacao?.latitude : null,
        longitude: usarLocalizacaoAtual ? localizacao?.longitude : null,
        tipo: tipo!,
        descricao,
      });

      navigate("/ocorrencias");
    } catch {
      setErro("Não foi possível registrar. A API está rodando?");
    }
  }

  const [localizacao, setLocalizacao] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false);
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState("");

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Registrar ocorrência</h1>
        <p className="text-sm">
          Informe os detalhes do problema para que possamos ajudar.
        </p>
      </div>
      <div className="flex items-center justify-between">
        {titulos.map((t, i) => (
          <div key={t} className="flex flex-1 items-center gap-2 text-xs">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${passo >= i + 1 ? "bg-aqua-600" : "bg-aqua-300"}`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{t}</span>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        {passo === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {tipos.map(({ valor, Icone, texto }) => (
              <button
                key={valor}
                onClick={() => setTipo(valor)}
                className={`flex gap-3 rounded-xl border-2 p-4 text-left ${tipo === valor ? "border-aqua-600 bg-aqua-100" : "border-transparent bg-aqua-100/50"}`}
              >
                <Icone className="h-8 w-8 shrink-0 text-aqua-600" />
                <div>
                  <p className="font-bold">{tipoLabel[valor]}</p>
                  <p className="text-xs">{texto}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        {passo === 2 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Onde está o problema?</p>

            <div className="rounded-xl border border-aqua-200 bg-aqua-50 p-4">
              <p className="font-semibold text-gray-800">
                Localização do problema
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Se o problema estiver no local onde você está, use sua
                localização atual. Você também pode selecionar um endereço
                cadastrado abaixo.
              </p>

              <button
                type="button"
                onClick={obterLocalizacao}
                disabled={buscandoLocalizacao}
                className="mt-3 rounded-xl bg-aqua-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {buscandoLocalizacao
                  ? "Obtendo localização..."
                  : "Usar minha localização"}
              </button>

              {mensagemLocalizacao && (
                <p role="status" className="mt-2 text-sm text-gray-700">
                  {mensagemLocalizacao}
                </p>
              )}

              {localizacao && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600">
                    Latitude: {localizacao.latitude.toFixed(6)} · Longitude:{" "}
                    {localizacao.longitude.toFixed(6)}
                  </p>

                  <label className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={usarLocalizacaoAtual}
                      onChange={(e) => {
                        setUsarLocalizacaoAtual(e.target.checked);

                        if (e.target.checked) {
                          setEnderecoId(null);
                        }
                      }}
                    />
                    Usar esta localização para a ocorrência
                  </label>
                </div>
              )}
            </div>

            {en.dados.map((e) => (
              <label
                key={e.id}
                className="flex items-center gap-2 rounded-lg border border-aqua-300 p-3 text-sm"
              >
                <input
                  type="radio"
                  name="end"
                  checked={enderecoId === e.id}
                  onChange={() => {
                    setEnderecoId(e.id);
                    setUsarLocalizacaoAtual(false);
                  }}
                />
                {e.logradouro}, {e.numero} - {e.cidade}/{e.estado}
              </label>
            ))}
            {en.dados.length === 0 && (
              <p className="text-sm">
                Nenhum endereço cadastrado. Adicione um no seu perfil.
              </p>
            )}
          </div>
        )}
        {passo === 3 && (
          <label className="block text-sm font-semibold">
            Descreva o que está acontecendo
            <textarea
              className="input mt-2 h-32 w-200 focus:outline-none bg-aqua-100 p-2 rounded-2xl"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
        )}
        {passo === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Confira os dados da ocorrência
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Verifique as informações antes de finalizar o envio.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-aqua-100 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-aqua-600">
                  Tipo de ocorrência
                </p>
                <p className="font-semibold text-gray-800">
                  {tipo && tipoLabel[tipo] ? tipoLabel[tipo] : "Não informado"}
                </p>
              </div>

              <div className="rounded-xl border border-aqua-100 bg-white p-4 shadow-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-aqua-600">
                  Local da ocorrência
                </p>

                {usarLocalizacaoAtual && localizacao ? (
                  <>
                    <p className="font-semibold text-gray-800">
                      Minha localização atual
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Latitude: {localizacao.latitude.toFixed(6)}
                      {" · "}
                      Longitude: {localizacao.longitude.toFixed(6)}
                    </p>
                  </>
                ) : (
                  <p className="font-semibold text-gray-800">
                    {en.dados.find((e) => e.id === enderecoId)?.logradouro
                      ? `${en.dados.find((e) => e.id === enderecoId)?.logradouro}, ${
                          en.dados.find((e) => e.id === enderecoId)?.numero
                        }`
                      : "Endereço não informado"}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-aqua-100 bg-white p-4 shadow-sm sm:col-span-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-aqua-600">
                  Descrição
                </p>
                <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-700">
                  {descricao?.trim() || "Nenhuma descrição informada."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-aqua-50 p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-aqua-100 text-aqua-700">
                ✓
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Tudo pronto para enviar?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Confirme os dados acima para registrar sua ocorrência no
                  AquaSense.
                </p>
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <p className="font-semibold">
                  Não foi possível registrar a ocorrência
                </p>
                <p className="mt-1">{erro}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <button
            className="btn-outline bg-red-100 p-2 rounded-3xl"
            disabled={passo === 1}
            onClick={() => setPasso(passo - 1)}
          >
            Voltar
          </button>
          {passo < 4 ? (
            <button
              className="btn bg-emerald-100 p-2 rounded-3xl"
              disabled={!podeAvancar}
              onClick={() => setPasso(passo + 1)}
            >
              Próximo
            </button>
          ) : (
            <button
              className="btn bg-emerald-100 p-2 rounded-3xl"
              onClick={enviar}
            >
              Registrar ocorrência
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
