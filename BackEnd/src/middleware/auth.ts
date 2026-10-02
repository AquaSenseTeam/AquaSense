import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { HttpError } from '../utils'

export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization
  if (!cabecalho?.startsWith('Bearer ')) throw new HttpError(401, 'Faça login para continuar.')
  try {
    const payload = jwt.verify(cabecalho.slice(7), process.env.JWT_SECRET as string)
    req.userId = Number(payload.sub)
    next()
  } catch {
    throw new HttpError(401, 'Sessão expirada. Faça login novamente.')
  }
}
