import { Router } from 'express'
import type { RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { camelAll, idDoUsuario } from '../utils'

const router = Router()

router.get('/', async (req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, usuario_id, DATE_FORMAT(mes_referencia, '%Y-%m') AS mes_referencia, volume_m3
     FROM consumos WHERE usuario_id = ? ORDER BY mes_referencia ASC`, [idDoUsuario(req)])
  res.json(camelAll(rows))
})

export default router
