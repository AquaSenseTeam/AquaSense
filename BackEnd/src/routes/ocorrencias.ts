import { Router } from 'express'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { HttpError, camel, camelAll, exigir, idDoUsuario } from '../utils'

const router = Router()
const TIPOS = ['VAZAMENTO', 'FALTA_DE_AGUA', 'AUMENTO_DE_CONSUMO', 'OUTROS']
const COLUNAS = 'id, usuario_id, endereco_id, tipo, descricao, status, data_registro, data_resolucao'

router.get('/', async (req, res) => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT ${COLUNAS} FROM ocorrencias WHERE usuario_id = ? ORDER BY data_registro DESC`, [idDoUsuario(req)])
  res.json(camelAll(rows))
})

router.post('/', async (req, res) => {
  const usuarioId = idDoUsuario(req)
  const { enderecoId, tipo, descricao } = req.body ?? {}
  exigir(req.body, ['enderecoId', 'tipo'])
  if (!TIPOS.includes(tipo)) throw new HttpError(400, 'Tipo de ocorrência inválido.')

  // o endereço precisa ser do próprio usuário
  const [end] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM enderecos WHERE id = ? AND usuario_id = ?', [enderecoId, usuarioId])
  if (!end[0]) throw new HttpError(400, 'Endereço inválido.')

  const [r] = await pool.execute<ResultSetHeader>(
    `INSERT INTO ocorrencias (usuario_id, endereco_id, empresa_id, tipo, descricao, status)
     VALUES (?, ?, (SELECT id FROM empresas_saneamento ORDER BY id LIMIT 1), ?, ?, 'EM_ANALISE')`,
    [usuarioId, enderecoId, tipo, descricao ?? null],
  )
  await pool.execute(
    `INSERT INTO notificacoes (usuario_id, ocorrencia_id, tipo, titulo, mensagem)
     VALUES (?, ?, 'OCORRENCIA', 'Sua ocorrência foi registrada.', 'Sua solicitação está em análise pela equipe técnica.')`,
    [usuarioId, r.insertId],
  )
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${COLUNAS} FROM ocorrencias WHERE id = ?`, [r.insertId])
  res.status(201).json(camel(rows[0]))
})

export default router
