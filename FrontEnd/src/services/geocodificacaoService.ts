
interface RespostaGeocodificacao {
  display_name?: string
  address?: {
    road?: string
    house_number?: string
    suburb?: string
    neighbourhood?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    state?: string
  }
}

export async function buscarEnderecoPorCoordenadas(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const parametros = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      addressdetails: '1',
      'accept-language': 'pt-BR',
    })

    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${parametros}`,
    )

    if (!resposta.ok) {
      return null
    }

    const dados: RespostaGeocodificacao = await resposta.json()
    const endereco = dados.address

    if (!endereco) {
      return dados.display_name ?? null
    }

    const rua = endereco.road
    const numero = endereco.house_number
    const bairro = endereco.suburb ?? endereco.neighbourhood
    const cidade =
      endereco.city ??
      endereco.town ??
      endereco.village ??
      endereco.municipality

    const partes = [
      rua ? `${rua}${numero ? `, ${numero}` : ''}` : null,
      bairro,
      cidade,
      endereco.state,
    ].filter(Boolean)

    return partes.length > 0
      ? partes.join(' - ')
      : dados.display_name ?? null
  } catch (erro) {
    console.error('Erro ao buscar endereço:', erro)
    return null
  }
}



export interface DadosEnderecoGeocodificado {
  endereco: string | null
  cidade: string | null
  estado: string | null
}

export async function buscarDadosEnderecoPorCoordenadas(
  latitude: number,
  longitude: number,
): Promise<DadosEnderecoGeocodificado | null> {
  try {
    const parametros = new URLSearchParams({
      format: 'jsonv2',
      lat: String(latitude),
      lon: String(longitude),
      addressdetails: '1',
      'accept-language': 'pt-BR',
    })

    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${parametros}`,
    )

    if (!resposta.ok) return null

    const dados: RespostaGeocodificacao = await resposta.json()
    const endereco = dados.address

    if (!endereco) {
      return {
        endereco: dados.display_name ?? null,
        cidade: null,
        estado: null,
      }
    }

    const cidade =
      endereco.city ??
      endereco.town ??
      endereco.village ??
      endereco.municipality ??
      null

    const estado = endereco.state ?? null

    const rua = endereco.road
    const numero = endereco.house_number
    const bairro = endereco.suburb ?? endereco.neighbourhood

    const partes = [
      rua ? `${rua}${numero ? `, ${numero}` : ''}` : null,
      bairro,
      cidade,
      estado,
    ].filter(Boolean)

    return {
      endereco:
        partes.length > 0
          ? partes.join(' - ')
          : dados.display_name ?? null,
      cidade,
      estado,
    }
  } catch (erro) {
    console.error('Erro ao buscar endereço:', erro)
    return null
  }
}
