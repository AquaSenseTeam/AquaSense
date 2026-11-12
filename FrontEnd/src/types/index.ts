export type TipoOcorrencia = 'VAZAMENTO' | 'FALTA_DE_AGUA' | 'AUMENTO_DE_CONSUMO' | 'OUTROS'
export type StatusOcorrencia = 'PENDENTE' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'CANCELADA'
export type TipoNotificacao = 'OCORRENCIA' | 'SISTEMA' | 'DICA' | 'ALERTA_CONSUMO' | string
export type TipoUsuario = 'MORADOR' | 'EMPRESA' | 'ADMIN'

export interface Usuario {
  id: number
  nomeCompleto: string
  cpf: string
  email: string
  telefone?: string | null
  tipo: TipoUsuario
  dataCadastro?: string
}

export interface Endereco {
  id: number
  usuarioId?: number
  cep: string
  logradouro: string
  numero: string
  complemento?: string | null
  cidade: string
  estado: string
}


export interface Ocorrencia {
  id: number
  enderecoId?: number | null
  latitude?: number | null
  longitude?: number | null
  tipo: TipoOcorrencia
  descricao?: string | null
  status: StatusOcorrencia
  dataRegistro: string
  dataResolucao?: string | null
}


export interface Consumo {
  id: number
  enderecoId?: number | null
  mesReferencia: string
  volumeM3: number
}

export interface Notificacao {
  id: number
  usuarioId?: number
  ocorrenciaId?: number | null
  tipo: TipoNotificacao
  titulo: string
  mensagem?: string | null
  dataHora: string
  lida: boolean
}
