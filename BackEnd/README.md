# AquaSense: Backend (Spring Boot + MySQL)

## 1. Banco de dados

O projeto utiliza **MySQL 8.0 ou superior**.

Não é necessário executar manualmente o arquivo `schema.sql`. O Spring Boot pode criar o banco de dados e atualizar as tabelas automaticamente.

Configure o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/aquasense_db?createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:SUA_SENHA}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

aquasense.jwt.secret=${JWT_SECRET}
aquasense.jwt.expiration-ms=3600000
```

**Importante:** o usuário do MySQL precisa ter permissão para criar bancos de dados. O Hibernate será responsável por criar e atualizar as tabelas.

## 2. Backend

### Requisitos

- Java 17 ou superior (compatível com a versão configurada no projeto).
- Maven (ou Maven Wrapper).
- MySQL 8.0 ou superior.

### Executando o projeto

Abra o terminal na pasta do backend:

```powershell
cd AquaSense-Backend
```

Compile e instale as dependências:

```powershell
.\mvnw.cmd clean install -DskipTests
```

Execute o projeto:

```powershell
.\mvnw.cmd spring-boot:run
```

O backend estará disponível em:

`http://localhost:8080`

A API utiliza o prefixo:

`http://localhost:8080/api`

Também é possível executar o JAR gerado:

```powershell
java -jar target/AquaSense-BackEnd-0.0.1-SNAPSHOT.jar
```

## 3. Configuração do frontend

O frontend utiliza React + Vite + TypeScript.

No arquivo `.env` da aplicação React, configure:

```env
VITE_API_URL=http://localhost:8080/api
```

O frontend deve utilizar os serviços responsáveis pela comunicação com a API:

- `services/api`
- `services/usuarioService`
- `services/ocorrenciaService`
- `services/consumoService`
- `services/notificacaoService`

A autenticação utiliza JWT, armazenando o token para as requisições autenticadas.

Não é mais necessário utilizar:
- json-server;
- `db.json`;
- Express;
- Node.js como backend.

## 4. Rotas da API

As rotas são disponibilizadas pelo Spring Boot sob o prefixo `/api`.

| Método | Rota | Autenticação | Funcionalidade |
|---|---|---|---|
| POST | `/api/auth/register` | Não | Cadastro de usuário e endereço |
| POST | `/api/auth/login` | Não | Autenticação e geração de token |
| GET | `/api/usuarios/me` | Sim | Consulta do perfil |
| PATCH | `/api/usuarios/me` | Sim | Atualização do perfil |
| GET | `/api/enderecos` | Sim | Lista endereços |
| POST | `/api/enderecos` | Sim | Cadastra endereço |
| GET | `/api/ocorrencias` | Sim | Lista ocorrências |
| POST | `/api/ocorrencias` | Sim | Registra ocorrência e gera notificação |
| GET | `/api/consumos` | Sim | Consulta consumo mensal |
| GET | `/api/notificacoes` | Sim | Lista notificações |
| PATCH | `/api/notificacoes/{id}` | Sim | Marca notificação como lida |
| GET | `/api/dicas` | Não | Consulta dicas de economia de água |

*Observação: os caminhos devem corresponder aos mappings efetivamente implementados nos controllers.*

## 5. Autenticação

As rotas protegidas utilizam JWT.

O token deve ser enviado no cabeçalho HTTP:

```http
Authorization: Bearer <token>
```

O backend identifica o usuário autenticado pelo token, garantindo que cada pessoa acesse somente seus próprios dados.

## 6. Estrutura do backend

O projeto utiliza Java com Spring Boot, seguindo uma organização em camadas:

```text
AquaSense-Backend/
├── src/
│   └── main/
│       ├── java/com/nathaliaay/aquasense/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── entities/
│       │   ├── repositories/
│       │   ├── services/
│       │   └── ...
│       └── resources/
│           └── application.properties
├── pom.xml
└── mvnw.cmd
```

### Tecnologias utilizadas

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- JWT
- Maven

## 7. Banco de dados e funcionalidades

O banco `aquasense_db` contém as principais entidades:

- `usuarios`: dados cadastrais e autenticação.
- `enderecos`: endereços associados aos usuários.
- `consumos`: histórico de consumo mensal.
- `empresas_saneamento`: empresas responsáveis pelo saneamento.
- `ocorrencias`: registros de vazamentos, falta de água, aumento de consumo e outros problemas.
- `notificacoes`: notificações relacionadas às ocorrências.
- `dicas`: orientações para economia de água.

As tabelas são gerenciadas pelo Spring Data JPA e Hibernate.

---

**AquaSense — Sistema de monitoramento e gestão de ocorrências relacionadas ao abastecimento e saneamento de água.**