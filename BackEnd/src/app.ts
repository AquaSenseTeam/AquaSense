import express from 'express'
import cors from 'cors'
import type { ErrorRequestHandler } from 'express'
import { pool } from './db'
import { autenticar } from './middleware/auth'
import { HttpError, camelAll } from './utils'
import authRoutes from './routes/auth'
import usuariosRoutes from './routes/usuarios'
import enderecosRoutes from './routes/enderecos'
import ocorrenciasRoutes from './routes/ocorrencias'
import consumosRoutes from './routes/consumos'
import notificacoesRoutes from './routes/notificacoes'

const app = express()
app.use(cors({ origin: process.env.FRONT_URL ?? 'http://localhost:5173' }))
app.use(express.json())

// públicas
app.get('/saude', (_req, res) => res.json({ ok: true }))
app.use('/auth', authRoutes)
app.get('/dicas', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, titulo, descricao FROM dicas')
  res.json(camelAll(rows as unknown[]))
})

app.use('/usuarios', autenticar, usuariosRoutes)
app.use('/enderecos', autenticar, enderecosRoutes)
app.use('/ocorrencias', autenticar, ocorrenciasRoutes)
app.use('/consumos', autenticar, consumosRoutes)
app.use('/notificacoes', autenticar, notificacoesRoutes)

app.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))

const tratarErros: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ erro: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ erro: 'Erro interno do servidor.' })
}
app.use(tratarErros)

export default app
