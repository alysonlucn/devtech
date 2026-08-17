# DevPath Backend

API da plataforma de mentoria de carreira para trilhas de aprendizagem personalizadas, acompanhamento de progresso e mentoria com IA.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL + TypeORM
- Autenticação JWT
- Validação com Zod
- Swagger/OpenAPI
- Docker
- Vitest

## Início rápido com Docker

```bash
docker compose up --build
```

API: `http://localhost:3001/api/v1`  
Swagger: `http://localhost:3001/api/docs`

> Se a porta 3000 estiver livre na sua máquina, altere `3001:3000` para `3000:3000` no `docker-compose.yml`.

### Usuários padrão do seed

| Papel | E-mail             | Senha          |
|-------|--------------------|----------------|
| Admin | admin@devpath.com  | Admin@123456   |
| User  | user@devpath.com   | User@123456    |

## Desenvolvimento local

```bash
cp .env.example .env
npm install
docker compose up postgres -d
npm run migration:run
npm run seed
npm run dev
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot reload |
| `npm run build` | Compila o TypeScript |
| `npm run start` | Executa o build de produção |
| `npm run test` | Executa os testes |
| `npm run lint` | Executa o ESLint |
| `npm run migration:run` | Executa as migrations |
| `npm run seed` | Popula o banco de dados |

## Visão geral da API

### Autenticação
- `POST /api/v1/auth/register` — Cadastro
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Atualizar token
- `GET /api/v1/auth/me` — Perfil

### Base de conhecimento (GET público, mutações ADMIN)
- `/api/v1/learning-paths`
- `/api/v1/technologies`
- Aninhados: recursos, projetos, competências, dependências

### Usuário (autenticado)
- `GET /api/v1/dashboard`
- `GET /api/v1/recommendations`
- `POST /api/v1/job-analysis`
- `POST /api/v1/assessment/:technologyId`
- `/api/v1/progress/*`
- `/api/v1/projects/*`

## Arquitetura

Arquitetura em camadas: Controllers → Services → Repositories → Entidades TypeORM.

A integração com LLM é desacoplada via interface `LLMProvider`.

| Provedor | Variáveis de ambiente |
|----------|----------------------|
| **Groq** (padrão) | `LLM_PROVIDER=groq`, `GROQ_API_KEY`, `GROQ_MODEL` (`openai/gpt-oss-120b`) |
| **OpenAI** | `LLM_PROVIDER=openai`, `OPENAI_API_KEY`, `OPENAI_MODEL` |
| **Mock** | `LLM_PROVIDER=mock` (sem chave necessária) |

## Variáveis de ambiente

Consulte `.env.example` para todas as opções de configuração disponíveis.
