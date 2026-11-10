
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
