/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'

// Carrega dados de uma função assíncrona e devolve { dados, carregando, erro }
export function useCarregar<T>(fn: () => Promise<T>, deps: unknown[], inicial: T) {
  const [dados, setDados] = useState<T>(inicial)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    setCarregando(true)
    fn()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar os dados. A API está rodando?'))
      .finally(() => setCarregando(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { dados, setDados, carregando, erro }
}
