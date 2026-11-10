import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Bell,
  Shield,
  CircleHelp,
  Info,
  ChevronRight,
  Camera,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usuarioService } from "../services/usuarioService";

const secoes = [
  {
    to: "/perfil/dados",
    Icone: User,
    titulo: "Dados pessoais",
    texto: "Nome, telefone, endereço e muito mais",
  },
  {
    to: "/perfil/enderecos",
    Icone: MapPin,
    titulo: "Endereços",
    texto: "Gerencie seus endereços cadastrados.",
  },
  {
    to: "/perfil/notificacoes",
    Icone: Bell,
    titulo: "Preferências de notificação",
    texto: "Escolha quando e como receber notificações.",
  },
  {
    to: "/perfil/seguranca",
    Icone: Shield,
    titulo: "Segurança",
    texto: "Altere sua senha e gerencie o acesso.",
  },
  {
    to: "/perfil/ajuda",
    Icone: CircleHelp,
    titulo: "Ajuda e suporte",
    texto: "Tire suas dúvidas e entre em contato.",
  },
  {
    to: "/perfil/sobre",
    Icone: Info,
    titulo: "Sobre o AquaSense",
    texto: "Saiba mais sobre o nosso projeto.",
  },
];

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoSelecionada, setFotoSelecionada] = useState<File | null>(null);
  const [previaUrl, setPreviaUrl] = useState<string | null>(null);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [mensagemFoto, setMensagemFoto] = useState("");
  const inputFotoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let url: string | null = null;
    let ativo = true;

    usuarioService
      .obterFotoPerfil()
      .then(async (resposta) => {
        const blob = await resposta.blob();
        if (!ativo) return;

        url = URL.createObjectURL(blob);
        setFotoUrl(url);
      })
      .catch(() => {
        // O usuário pode ainda não ter uma foto cadastrada.
      });

    return () => {
      ativo = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  useEffect(() => {
    if (!fotoSelecionada) {
      setPreviaUrl(null);
      return;
    }

    const url = URL.createObjectURL(fotoSelecionada);
    setPreviaUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [fotoSelecionada]);

  function selecionarFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!formatosPermitidos.includes(arquivo.type)) {
      setMensagemFoto("Selecione uma imagem JPG, PNG ou WEBP.");
      e.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagemFoto("A imagem deve ter no máximo 5 MB.");
      e.target.value = "";
      return;
    }

    setMensagemFoto("");
    setFotoSelecionada(arquivo);
  }

  async function salvarFoto() {
    if (!fotoSelecionada) return;

    setSalvandoFoto(true);
    setMensagemFoto("");

    try {
      await usuarioService.enviarFotoPerfil(fotoSelecionada);

      const resposta = await usuarioService.obterFotoPerfil();
      const blob = await resposta.blob();
      const novaUrl = URL.createObjectURL(blob);

      setFotoUrl((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return novaUrl;
      });

      setFotoSelecionada(null);

      if (inputFotoRef.current) {
        inputFotoRef.current.value = "";
      }

      setMensagemFoto("Foto de perfil atualizada com sucesso!");
    } catch (erro) {
      setMensagemFoto(
        erro instanceof Error
          ? erro.message
          : "Não foi possível atualizar a foto.",
      );
    } finally {
      setSalvandoFoto(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Meu perfil</h1>
        <p className="text-sm">Gerencie seus dados e preferências.</p>
      </div>
      <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0">
          {previaUrl || fotoUrl ? (
            <img
              src={previaUrl ?? fotoUrl ?? undefined}
              alt="Foto de perfil"
              className="h-20 w-20 rounded-full border-2 border-aqua-100 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-aqua-100 text-aqua-600">
              <User className="h-10 w-10" />
            </div>
          )}

          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            aria-label="Escolher foto de perfil"
            title="Alterar foto"
            className="absolute bottom-0 right-0 rounded-full bg-aqua-600 p-2 text-white shadow hover:bg-aqua-700"
          >
            <Camera className="h-4 w-4" />
          </button>

          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={selecionarFoto}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{usuario!.nomeCompleto}</p>
          <p className="break-all text-sm text-aqua-600">{usuario!.email}</p>

          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG ou WEBP · Máximo de 5 MB
          </p>

          {mensagemFoto && (
            <p role="status" className="mt-2 text-sm">
              {mensagemFoto}
            </p>
          )}

          {fotoSelecionada && (
            <button
              type="button"
              onClick={salvarFoto}
              disabled={salvandoFoto}
              className="btn mt-3 inline-flex items-center gap-2 disabled:opacity-60 bg-emerald-100 p-2 rounded-3xl"
            >
              {salvandoFoto && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              {salvandoFoto ? "Salvando..." : "Salvar nova foto"}
            </button>
          )}
        </div>

        <Link to="/perfil/dados" className="btn-outline shrink-0">
          Editar dados
        </Link>
      </div>
      <ul className="card divide-y divide-aqua-100 p-0">
        {secoes.map(({ to, Icone, titulo, texto }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex items-center gap-3 p-4 transition hover:bg-aqua-100/60"
            >
              <Icone className="h-5 w-5 text-aqua-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{titulo}</p>
                <p className="text-xs">{texto}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-aqua-600" />
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="w-full rounded-lg border border-red-500 py-3 text-red-500 hover:bg-red-50"
      >
        Sair da conta
      </button>
    </div>
  );
}
