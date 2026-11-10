## AquaSense FrontEnd

## Executar

1. Configure as variáveis de ambiente do backend e inicie o Spring Boot na porta 8080.
2. Copie `.env.example` para `.env` se quiser explicitar a URL da API.
3. Na pasta do front-end, execute `npm install` e depois `npm run dev`.
4. Abra a URL mostrada pelo Vite (normalmente `http://localhost:5173`).

O front usa `http://localhost:8080/api` por padrão. O backend deve permitir CORS para a origem do Vite.

O cadastro envia CPF e CEP somente com dígitos; os demais campos permanecem como preenchidos no formulário. O login armazena o JWT e consulta `/usuarios/me` para carregar o perfil completo.
