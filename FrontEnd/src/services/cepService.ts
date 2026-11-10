
export interface EnderecoViaCep {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function buscarEnderecoPorCep(
  cep: string,
): Promise<EnderecoViaCep> {
  const cepLimpo = cep.replace(/\D/g, '')

  if (!/^\d{8}$/.test(cepLimpo)) {
    throw new Error('Digite um CEP válido com 8 números.')
  }

  const resposta = await fetch(
    `https://viacep.com.br/ws/${cepLimpo}/json/`,
  )

  if (!resposta.ok) {
    throw new Error('Não foi possível consultar o CEP. Tente novamente.')
  }

  const endereco: EnderecoViaCep = await resposta.json()

  if (endereco.erro) {
    throw new Error('CEP não encontrado. Confira os números digitados.')
  }

  return endereco
}

export function formatarCep(cep: string): string {
  const numeros = cep.replace(/\D/g, '').slice(0, 8)

  if (numeros.length <= 5) return numeros

  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
}
