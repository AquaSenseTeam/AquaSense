import { Router } from 'express'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { camel, camelAll, exigir, idDoUsuario, soDigitos, HttpError } from '../utils'

const router = Router()
const COLUNAS = 'id, usuario_id, cep, logradouro, numero, complemento, cidade, estado'

router.get('/', async (req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${COLUNAS} FROM enderecos WHERE usuario_id = ?`, [idDoUsuario(req)])
  res.json(camelAll(rows))
})

router.post('/', async (req, res) => {
  const b = req.body ?? {}
  exigir(b, ['cep', 'logradouro', 'numero', 'cidade', 'estado'])
  const cep = soDigitos(b.cep)
  if (cep.length !== 8) throw new HttpError(400, 'CEP inválido.')
  const [r] = await pool.execute<ResultSetHeader>(
    'INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [idDoUsuario(req), cep, b.logradouro, b.numero, b.complemento ?? null, b.cidade, String(b.estado).toUpperCase()],
  )
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${COLUNAS} FROM enderecos WHERE id = ?`, [r.insertId])
  res.status(201).json(camel(rows[0]))
})

export default router
