import 'dotenv/config'
import bcrypt from 'bcryptjs'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { pool } from '../src/db'

async function main() {
  const [existe] = await pool.execute<RowDataPacket[]>('SELECT id FROM usuarios WHERE email = ?', ['pedro@gmail.com'])
  if (existe.length) return console.log('Dados de exemplo já existem. Nada a fazer.')

  const hash = await bcrypt.hash('12345678', 10)
  const [u] = await pool.execute<ResultSetHeader>(
    'INSERT INTO usuarios (nome_completo, cpf, email, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)',
    ['Pedro de Barros', '00000000000', 'pedro@gmail.com', '11999999999', hash],
  )
  const uid = u.insertId
  await pool.execute('INSERT INTO preferencias_notificacoes (usuario_id) VALUES (?)', [uid])
  const [emp] = await pool.execute<ResultSetHeader>('INSERT INTO empresas_saneamento (nome, email) VALUES (?, ?)', [
    'Companhia de Saneamento (exemplo)', 'contato@saneamento.exemplo',
  ])

  const [e1] = await pool.execute<ResultSetHeader>(
    'INSERT INTO enderecos (usuario_id, cep, logradouro, numero, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)',
    [uid, '18000000', 'Rua das Flores', '113', 'Sorocaba', 'SP'])
  const [e2] = await pool.execute<ResultSetHeader>(
    'INSERT INTO enderecos (usuario_id, cep, logradouro, numero, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)',
    [uid, '18000001', 'Av. São Paulo', '456', 'Sorocaba', 'SP'])

  await pool.query(
    'INSERT INTO ocorrencias (usuario_id, endereco_id, empresa_id, tipo, status, data_registro, data_resolucao) VALUES ?',
    [[
      [uid, e1.insertId, emp.insertId, 'VAZAMENTO', 'EM_ANDAMENTO', '2025-06-12 14:32:00', null],
      [uid, e2.insertId, emp.insertId, 'FALTA_DE_AGUA', 'RECUSADA', '2025-06-10 08:15:00', null],
      [uid, e1.insertId, emp.insertId, 'AUMENTO_DE_CONSUMO', 'EM_ANALISE', '2025-05-28 16:20:00', null],
      [uid, e2.insertId, emp.insertId, 'FALTA_DE_AGUA', 'RESOLVIDA', '2025-05-25 19:08:00', '2025-05-27 10:00:00'],
      [uid, e1.insertId, emp.insertId, 'VAZAMENTO', 'RESOLVIDA', '2025-05-10 11:12:00', '2025-05-13 09:00:00'],
    ]],
  )
  await pool.query('INSERT INTO consumos (usuario_id, endereco_id, mes_referencia, volume_m3) VALUES ?', [[
    [uid, e1.insertId, '2025-01-01', 10], [uid, e1.insertId, '2025-02-01', 12], [uid, e1.insertId, '2025-03-01', 18],
    [uid, e1.insertId, '2025-04-01', 15], [uid, e1.insertId, '2025-05-01', 13], [uid, e1.insertId, '2025-06-01', 12],
  ]])
  await pool.query('INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem, data_hora, lida) VALUES ?', [[
    [uid, 'OCORRENCIA', 'Sua ocorrência foi registrada.', 'Vazamento - Rua das Flores, 113', '2025-06-12 14:32:00', false],
    [uid, 'SISTEMA', 'Atualização da ocorrência', 'Sua solicitação está sendo analisada pela equipe técnica.', '2025-06-12 16:20:00', false],
    [uid, 'ALERTA_CONSUMO', 'Alerta de consumo', 'Seu consumo aumentou 20% em relação ao mês anterior.', '2025-06-05 09:00:00', true],
    [uid, 'DICA', 'Dica de economia', 'Evite banhos demorados e feche a torneira ao escovar os dentes.', '2025-06-04 06:30:00', true],
  ]])
  await pool.query('INSERT INTO dicas (titulo, descricao) VALUES ?', [[
    ['Verifique vazamentos', 'Teste torneiras e encanamentos regularmente.'],
    ['Banhos mais curtos', 'Reduzir 2 minutos de banho já economiza bastante.'],
    ['Uso consciente', 'Feche a torneira enquanto escova os dentes.'],
  ]])
  console.log('Pronto! Login de teste: pedro@gmail.com / 12345678')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => pool.end())
