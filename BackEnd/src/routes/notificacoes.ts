import { Router } from 'express'
import type { RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { HttpError, camel, idDoUsuario } from '../utils'

const router = Router()
const COLUNAS = 'id, usuario_id, ocorrencia_id, tipo, titulo, mensagem, data_hora, lida'
const formatar = (r: RowDataPacket) => ({ ...camel(r), lida: Boolean(r.lida) })

router.get('/', async (req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ${COLUNAS} FROM notificacoes WHERE usuario_id = ? ORDER BY data_hora DESC`, [idDoUsuario(req)])
  res.json(rows.map(formatar))
})

// marca como lida (o front envia PATCH /notificacoes/:id com { lida: true })
router.patch('/:id', async (req, res) => {
  const usuarioId = idDoUsuario(req)
  const [r] = await pool.execute<import('mysql2').ResultSetHeader>(
    'UPDATE notificacoes SET lida = TRUE WHERE id = ? AND usuario_id = ?', [req.params.id, usuarioId])
  if (r.affectedRows === 0) throw new HttpError(404, 'Notificação não encontrada.')
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${COLUNAS} FROM notificacoes WHERE id = ?`, [req.params.id])
  res.json(formatar(rows[0]))
})

export default router
