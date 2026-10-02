# AquaSense: backend (Express + MySQL)

## 1. Banco de dados
1. Abra o MySQL (8.0.16 ou mais novo) e execute o arquivo `backend/schema.sql` (cria o banco `aquasense` e as tabelas).

## 2. Backend
```bash
cd backend
npm install express cors mysql2 bcryptjs jsonwebtoken dotenv
npm install -D typescript tsx @types/node @types/express @types/cors @types/jsonwebtoken
cp .env.example .env      # edite DB_PASSWORD e JWT_SECRET
npm run seed              # dados de exemplo (opcional)
npm run dev               # http://localhost:3001
```
Teste rápido: abra http://localhost:3001/saude (deve responder `{"ok":true}`).
Login de teste (se rodou o seed): pedro@gmail.com / 12345678

## 3. Atualizar o front
Copie a pasta `front-atualizado/src` por cima do `src` do seu projeto React (substitui 7 arquivos:
services/api, usuarioService, ocorrenciaService, consumoService, notificacaoService,
contexts/AuthContext e pages/Cadastro). O `.env` do front continua `VITE_API_URL=http://localhost:3001`.
Não precisa mais do json-server nem do `db.json`.

## Rotas
| Método | Rota | Auth | O que faz |
|---|---|---|---|
| POST | /auth/register | não | cria usuário + endereço, devolve token |
| POST | /auth/login | não | devolve token e usuário |
| GET/PATCH | /usuarios/me | sim | perfil do usuário logado |
| GET/POST | /enderecos | sim | endereços do usuário |
| GET/POST | /ocorrencias | sim | lista / registra (gera notificação) |
| GET | /consumos | sim | consumo mensal |
| GET | /notificacoes | sim | lista |
| PATCH | /notificacoes/:id | sim | marca como lida |
| GET | /dicas | não | dicas de economia |

O token vai no cabeçalho `Authorization: Bearer <token>`. O usuário é sempre o do token, então ninguém acessa dados de outro.
