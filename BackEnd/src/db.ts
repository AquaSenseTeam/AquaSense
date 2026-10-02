import 'dotenv/config'
import { createPool } from 'mysql2/promise'

export const pool = createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'Natzada1102@',
  database: process.env.DB_NAME ?? 'aquasense_db',
  connectionLimit: 10,
  dateStrings: true,     // datas chegam como texto, sem problema de fuso
  decimalNumbers: true,  // DECIMAL chega como number (e não string)
})
