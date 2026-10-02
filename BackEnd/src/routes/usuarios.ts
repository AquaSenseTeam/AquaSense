import { Router } from 'express'
import type { RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { HttpError, camel, idDoUsuario } from '../utils'

const router = Router()

async function buscar(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, nome_completo, cpf, email, telefone FROM usuarios WHERE id = ?', [id])
  if (!rows[0]) throw new HttpError(404, 'Usuário não encontrado.')
  return camel(rows[0])
}

router.get('/me', async (req, res) => {
  res.json(await buscar(idDoUsuario(req)))
})

router.patch('/me', async (req, res) => {
  const id = idDoUsuario(req)
  const { nomeCompleto, telefone } = req.body ?? {}
  await pool.execute(
    'UPDATE usuarios SET nome_completo = COALESCE(?, nome_completo), telefone = COALESCE(?, telefone) WHERE id = ?',
    [nomeCompleto ?? null, telefone ?? null, id],
  )
  res.json(await buscar(id))
})

export default router
