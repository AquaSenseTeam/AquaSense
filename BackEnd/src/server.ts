import 'dotenv/config'
import app from './app'

if (!process.env.JWT_SECRET) {
  console.error('Defina JWT_SECRET no arquivo .env')
  process.exit(1)
}

const porta = Number(process.env.PORT ?? 3001)
app.listen(porta, () => console.log(`API do AquaSense rodando em http://localhost:${porta}`))
