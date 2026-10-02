import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../db'
import { HttpError, camel, exigir, soDigitos } from '../utils'

const router = Router()

const COLUNAS_PUBLICAS = 'id, nome_completo, cpf, email, telefone'

async function respostaAuth(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(`SELECT ${COLUNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id])
  const token = jwt.sign({}, process.env.JWT_SECRET as string, { subject: String(id), expiresIn: '7d' })
  return { token, usuario: camel(rows[0]) }
}

router.post('/register', async (req, res) => {
  const b = req.body ?? {}
  exigir(b, ['nomeCompleto', 'cpf', 'email', 'senha'])
  exigir(b.endereco, ['cep', 'logradouro', 'numero', 'cidade', 'estado'])

  const cpf = soDigitos(b.cpf)
  const cep = soDigitos(b.endereco.cep)
  if (cpf.length !== 11) throw new HttpError(400, 'CPF inválido.')
  if (cep.length !== 8) throw new HttpError(400, 'CEP inválido.')
  if (!String(b.email).includes('@')) throw new HttpError(400, 'E-mail inválido.')
  if (String(b.senha).length < 8) throw new HttpError(400, 'A senha precisa ter 8 caracteres ou mais.')
  if (String(b.endereco.estado).length !== 2) throw new HttpError(400, 'Use a sigla do estado (ex.: SP).')

  const senhaHash = await bcrypt.hash(String(b.senha), 10)
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [u] = await conn.execute<ResultSetHeader>(
      'INSERT INTO usuarios (nome_completo, cpf, email, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)',
      [b.nomeCompleto, cpf, String(b.email).toLowerCase(), b.telefone ?? null, senhaHash],
    )
    const e = b.endereco
    await conn.execute(
      'INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.insertId, cep, e.logradouro, e.numero, e.complemento ?? null, e.cidade, String(e.estado).toUpperCase()],
    )
    await conn.execute('INSERT INTO preferencias_notificacoes (usuario_id) VALUES (?)', [u.insertId])
    await conn.commit()
    res.status(201).json(await respostaAuth(u.insertId))
  } catch (err) {
    await conn.rollback()
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') throw new HttpError(409, 'E-mail ou CPF já cadastrado.')
    throw err
  } finally {
    conn.release()
  }
})

router.post('/login', async (req, res) => {
  const { email, senha } = req.body ?? {}
  exigir(req.body, ['email', 'senha'])
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT id, senha_hash FROM usuarios WHERE email = ?', [
    String(email).toLowerCase(),
  ])
  const u = rows[0]
  const ok = u?.senha_hash ? await bcrypt.compare(String(senha), u.senha_hash) : false
  if (!ok) throw new HttpError(401, 'E-mail ou senha incorretos.')
  res.json(await respostaAuth(u.id))
})

export default router
