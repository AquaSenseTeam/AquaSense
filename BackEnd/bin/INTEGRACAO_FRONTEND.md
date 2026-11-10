# Integração React + Spring Boot

## Variáveis de ambiente do backend

O arquivo `application.properties` não contém mais senha do banco nem chave JWT fixa. Configure estas variáveis na configuração de execução do Eclipse (Run Configurations → Environment):

- `DB_USERNAME`: usuário do MySQL (por exemplo, `root`)
- `DB_PASSWORD`: senha local do MySQL
- `JWT_SECRET`: segredo hexadecimal de pelo menos 64 caracteres, sem aspas

Mantenha esses valores fora do Git.

## Endpoints adicionais para o frontend

- `GET /api/usuarios/me`
- `PATCH /api/usuarios/me`
- `PATCH /api/usuarios/me/senha`
- `GET /api/enderecos`
- `POST /api/enderecos`
- `PATCH /api/enderecos/{id}`
- `DELETE /api/enderecos/{id}`
- `GET /api/preferencias`
- `PATCH /api/preferencias`

Todas essas rotas exigem JWT. CORS está habilitado para o Vite em `localhost:5173`.
