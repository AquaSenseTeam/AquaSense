import type { Request } from 'express'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

export const idDoUsuario = (req: Request): number => req.userId as number

const paraCamel = (s: string) => s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
const ehTimestamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/

// snake_case -> camelCase e "2025-06-12 14:32:00" -> "2025-06-12T14:32:00"
export function camel<T = Record<string, unknown>>(row: Record<string, unknown>): T {
  const saida: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) {
    saida[paraCamel(k)] = typeof v === 'string' && ehTimestamp.test(v) ? v.replace(' ', 'T') : v
  }
  return saida as T
}
export const camelAll = <T = Record<string, unknown>>(rows: unknown[]): T[] =>
  (rows as Record<string, unknown>[]).map((r) => camel<T>(r))

export function exigir(corpo: Record<string, unknown> | undefined, campos: string[]) {
  const faltando = campos.filter((c) => corpo?.[c] === undefined || corpo?.[c] === '')
  if (faltando.length) throw new HttpError(400, `Campos obrigatórios: ${faltando.join(', ')}`)
}

export const soDigitos = (v: unknown) => String(v ?? '').replace(/\D/g, '')
