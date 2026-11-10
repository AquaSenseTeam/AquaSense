export interface Msg {
  tipo: 'ok' | 'erro'
  texto: string
}

export default function Mensagem({ msg }: { msg: Msg | null }) {
  if (!msg) return null
  const cor = msg.tipo === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  return <p className={`rounded-lg px-3 py-2 text-sm ${cor}`}>{msg.texto}</p>
}
