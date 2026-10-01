interface Props<T extends string> {
  abas: { valor: T; rotulo: string }[]
  ativa: T
  onChange: (v: T) => void
}

export default function TabsFilter<T extends string>({ abas, ativa, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl bg-white p-2">
      {abas.map((a) => (
        <button
          key={a.valor}
          onClick={() => onChange(a.valor)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
            ativa === a.valor ? 'bg-aqua-900 text-white' : 'bg-aqua-100 text-aqua-900 hover:bg-aqua-300'
          }`}
        >
          {a.rotulo}
        </button>
      ))}
    </div>
  )
}
