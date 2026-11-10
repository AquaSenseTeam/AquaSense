import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CalendarDays,
  MapPin,
  Droplet,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useCarregar } from "../hooks";
import { ocorrenciaService } from "../services/ocorrenciaService";
import { usuarioService } from "../services/usuarioService";
import { tipoLabel, statusLabel, formatarData } from "../utils/format";
import { buscarEnderecoPorCoordenadas } from "../services/geocodificacaoService";

export default function MinhasOcorrencias() {
  const { usuario } = useAuth();
  const id = usuario!.id;

  const oc = useCarregar(() => ocorrenciaService.listar(id), [id], []);

  const en = useCarregar(() => usuarioService.listarEnderecos(id), [id], []);

  const [tipo, setTipo] = useState("");
  const [status, setStatus] = useState("");
  const [busca, setBusca] = useState("");

  const [enderecosGPS, setEnderecosGPS] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelado = false;

    async function carregarEnderecosGPS() {
      const ocorrenciasGPS = oc.dados.filter(
        (o) =>
          o.enderecoId == null &&
          o.latitude != null &&
          o.longitude != null &&
          !enderecosGPS[o.id],
      );

      for (const ocorrencia of ocorrenciasGPS) {
        if (cancelado) return;

        const endereco = await buscarEnderecoPorCoordenadas(
          ocorrencia.latitude!,
          ocorrencia.longitude!,
        );

        if (cancelado) return;

        if (endereco) {
          setEnderecosGPS((atuais) => ({
            ...atuais,
            [ocorrencia.id]: endereco,
          }));
        }

        // Respeita o limite do serviço público.
        await new Promise((resolver) => setTimeout(resolver, 1100));
      }
    }

    void carregarEnderecosGPS();

    return () => {
      cancelado = true;
    };
  }, [oc.dados, enderecosGPS]);

  const filtradas = useMemo(
    () =>
      oc.dados.filter((o) => {
        const correspondeTipo = !tipo || o.tipo === tipo;
        const correspondeStatus = !status || o.status === status;
        const correspondeBusca =
          !busca ||
          (tipoLabel[o.tipo] ?? o.tipo)
            .toLowerCase()
            .includes(busca.toLowerCase()) ||
          String(o.id).includes(busca);

        return correspondeTipo && correspondeStatus && correspondeBusca;
      }),
    [oc.dados, tipo, status, busca],
  );

  
const enderecoDe = (
  ocorrenciaId: number,
  enderecoId: number | null | undefined,
  latitude?: number | null,
  longitude?: number | null,
) => {
  if (enderecoId != null) {
    const endereco = en.dados.find(
      (e) => Number(e.id) === Number(enderecoId)
    )

    if (endereco) {
      return `${endereco.logradouro}, ${endereco.numero} - ${endereco.cidade}/${endereco.estado}`
    }
  }

  // Se não houver endereço cadastrado, utiliza o GPS.
  if (latitude != null && longitude != null) {
    return (
      enderecosGPS[ocorrenciaId] ??
      `Localização GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`
    )
  }

  return 'Local não identificado'
}


  const total = oc.dados.length;
  const totalFiltrado = filtradas.length;

  const emAndamento = oc.dados.filter(
    (o) =>
      o.status.toLowerCase().includes("andamento") ||
      o.status.toLowerCase().includes("análise"),
  ).length;

  const resolvidas = oc.dados.filter(
    (o) => o.status.toLowerCase() === "resolvida",
  ).length;

  const limparFiltros = () => {
    setTipo("");
    setStatus("");
    setBusca("");
  };

  const nomeTipo = (tipo: string) =>
    Object.prototype.hasOwnProperty.call(tipoLabel, tipo)
      ? tipoLabel[tipo as keyof typeof tipoLabel]
      : tipo;

  const nomeStatus = (status: string) =>
    Object.prototype.hasOwnProperty.call(statusLabel, status)
      ? statusLabel[status as keyof typeof statusLabel]
      : status;

  useEffect(() => {
    console.log("OCORRÊNCIAS RECEBIDAS:", oc.dados);
    console.log("ENDEREÇOS RECEBIDOS:", en.dados);
  }, [oc.dados, en.dados]);

  return (
    <div className="space-y-6 pb-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-aqua-700">
            <ClipboardList size={17} />
            <span>Atendimento</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Minhas ocorrências
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Acompanhe seus registros, consulte os endereços e veja as
            atualizações de cada ocorrência.
          </p>
        </div>

        <Link
          to="/ocorrencias/nova"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-aqua-700 focus:outline-none focus:ring-2 focus:ring-aqua-500 focus:ring-offset-2"
        >
          <Plus size={18} />
          Nova ocorrência
        </Link>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total de registros
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{total}</p>
              <p className="mt-1 text-xs text-gray-400">
                Ocorrências cadastradas
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <ClipboardList size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Em acompanhamento
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {emAndamento}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Em análise ou em andamento
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <RefreshCw size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolvidas</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {resolvidas}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Problemas solucionados
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Droplet size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Erro de carregamento */}
      {oc.erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Não foi possível carregar as ocorrências: {oc.erro}
        </div>
      )}

      {/* Filtros */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-aqua-700" />
            <h2 className="font-semibold text-gray-900">Filtrar ocorrências</h2>
          </div>

          <p className="text-xs text-gray-400 sm:ml-auto">
            {totalFiltrado} de {total} registros
          </p>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-gray-600">
              Buscar
            </span>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Tipo ou número do registro"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-aqua-500 focus:bg-white focus:ring-2 focus:ring-aqua-100"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-gray-600">
              Tipo de ocorrência
            </span>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-aqua-500 focus:bg-white focus:ring-2 focus:ring-aqua-100"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(tipoLabel).map(([chave, rotulo]) => (
                <option key={chave} value={chave}>
                  {rotulo}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-gray-600">
              Status
            </span>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-aqua-500 focus:bg-white focus:ring-2 focus:ring-aqua-100"
            >
              <option value="">Todos os status</option>
              {Object.entries(statusLabel).map(([chave, rotulo]) => (
                <option key={chave} value={chave}>
                  {rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {(tipo || status || busca) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3">
            <span className="text-xs text-gray-500">Filtros ativos</span>

            {tipo && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {nomeTipo(tipo)}
              </span>
            )}

            {status && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                {nomeStatus(status)}
              </span>
            )}

            {busca && (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                Busca: {busca}
              </span>
            )}

            <button
              type="button"
              onClick={limparFiltros}
              className="ml-auto text-xs font-semibold text-aqua-700 transition hover:text-aqua-900"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {/* Lista de ocorrências */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Registros recentes</h2>
          <p className="mt-1 text-xs text-gray-500">
            Consulte as informações e o status das suas solicitações.
          </p>
        </div>

        {oc.carregando ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <RefreshCw size={28} className="animate-spin text-aqua-600" />
            <p className="mt-4 text-sm font-medium text-gray-700">
              Carregando ocorrências...
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Aguarde enquanto buscamos seus registros.
            </p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-50 text-aqua-700">
              {tipo || status || busca ? (
                <Search size={25} />
              ) : (
                <ClipboardList size={25} />
              )}
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {tipo || status || busca
                ? "Nenhuma ocorrência encontrada"
                : "Você ainda não tem ocorrências"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              {tipo || status || busca
                ? "Tente alterar os filtros para encontrar o registro desejado."
                : "Quando identificar um problema relacionado ao abastecimento de água, registre uma ocorrência para acompanhar o atendimento."}
            </p>

            {tipo || status || busca ? (
              <button
                type="button"
                onClick={limparFiltros}
                className="mt-5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Limpar filtros
              </button>
            ) : (
              <Link
                to="/ocorrencias/nova"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-aqua-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-aqua-700"
              >
                <Plus size={17} />
                Registrar ocorrência
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Tabela para telas maiores */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Ocorrência</th>
                    <th className="px-5 py-4">Endereço</th>
                    <th className="px-5 py-4">Data do registro</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filtradas.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-gray-100 transition hover:bg-aqua-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                            <Droplet size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {tipoLabel[o.tipo] ?? o.tipo}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Registro #{o.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          <span>
                            {enderecoDe(o.id, o.enderecoId, o.latitude, o.longitude)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarDays
                            size={15}
                            className="shrink-0 text-gray-400"
                          />
                          {formatarData(o.dataRegistro)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards para dispositivos móveis */}
            <div className="space-y-3 p-4 md:hidden">
              {filtradas.map((o) => (
                <article
                  key={o.id}
                  className="rounded-xl border border-gray-100 p-4 transition hover:border-aqua-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-700">
                      <Droplet size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {tipoLabel[o.tipo] ?? o.tipo}
                          </h3>
                          <p className="mt-1 text-xs text-gray-400">
                            Registro #{o.id}
                          </p>
                        </div>

                        <StatusBadge status={o.status} />
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <p className="flex items-start gap-2">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-gray-400"
                          />
                          <span>
                            {enderecoDe(o.id, o.enderecoId, o.latitude, o.longitude)}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          {formatarData(o.dataRegistro)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!oc.carregando && filtradas.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Exibindo {totalFiltrado} de {total}{" "}
              {total === 1 ? "ocorrência" : "ocorrências"}
            </span>

            <Link
              to="/ocorrencias/nova"
              className="inline-flex items-center gap-1 font-semibold text-aqua-700 transition hover:text-aqua-900"
            >
              Registrar outra ocorrência
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
