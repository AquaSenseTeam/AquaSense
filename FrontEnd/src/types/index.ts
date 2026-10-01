export type TipoOcorrencia = 'VAZAMENTO' | 'FALTA_DE_AGUA' | 'AUMENTO_DE_CONSUMO' | 'OUTROS'
export type StatusOcorrencia = 'EM_ANALISE' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'RECUSADA'
export type TipoNotificacao = 'OCORRENCIA' | 'SISTEMA' | 'DICA' | 'ALERTA_CONSUMO'

export interface Usuario {
  id: number
  nomeCompleto: string
  cpf: string
  email: string
  telefone?: string
  senha?: string // apenas no mock; no back real use senhaHash e nunca exponha
}

export interface Endereco {
  id: number
  usuarioId: number
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  cidade: string
  estado: string
}

export interface Ocorrencia {
  id: number
  usuarioId: number
  enderecoId: number
  tipo: TipoOcorrencia
  descricao?: string
  status: StatusOcorrencia
  dataRegistro: string
  dataResolucao?: string
}

export interface Consumo {
  id: number
  usuarioId: number
  mesReferencia: string // "2025-06"
  volumeM3: number
}

export interface Notificacao {
  id: number
  usuarioId: number
  ocorrenciaId?: number
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  dataHora: string
  lida: boolean
}
