# DevTech

Plataforma de mentoria de carreira para desenvolvedores — trilhas de aprendizagem personalizadas, acompanhamento de progresso, avaliações e recursos com IA.

## Estrutura

```
devtech/
├── backend/    # API Node.js + Express + TypeORM
└── frontend/   # App React + Vite + Tailwind
```

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Node.js, TypeScript, Express, PostgreSQL, TypeORM, JWT, Zod, Swagger, Vitest, Docker |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router, TanStack Query, Axios |

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose (para o PostgreSQL / stack completa)

## Início rápido

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
docker compose up --build
```

- API: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)

## Credenciais de teste

| Papel | E-mail | Senha |
|-------|--------|-------|
| Admin | admin@devpath.com | Admin@123456 |
| Usuário | user@devpath.com | User@123456 |

## Desenvolvimento local (backend sem API no Docker)

```bash
cd backend
cp .env.example .env
npm install
docker compose up postgres -d
npm run migration:run
npm run seed
npm run dev
```

Ajuste `DB_HOST=localhost` no `.env` se o Postgres estiver via Docker Compose e a API rodar na máquina host.

## Funcionalidades

- Cadastro, login e autenticação JWT
- Catálogo público de trilhas e tecnologias
- Dashboard e roadmap personalizados
- Progresso, projetos e avaliações
- Recomendações e análise de vagas com IA
- Painel admin para gestão do conteúdo

## Deploy gratuito (Render)

O arquivo `render.yaml` sobe **API + Postgres + frontend** no plano free (sem cartão para o free tier).

1. Envie o código para o GitHub
2. Abra: [Deploy no Render (Blueprint)](https://dashboard.render.com/select-repo?type=blueprint)
3. Conecte o repositório e confirme o Blueprint

Após o deploy:
- Frontend: `https://devpath-alysonlucn-web.onrender.com`
- API: `https://devpath-alysonlucn-api.onrender.com/api/v1`
- Swagger: `https://devpath-alysonlucn-api.onrender.com/api/docs`

**Limitações do free:** a API “dorme” após ~15 min sem uso (primeiro acesso pode demorar ~1 min). O Postgres free expira em 30 dias — suficiente para apresentação em aula.

Antes da demo, abra a URL da API uma vez para acordar o serviço.

## Documentação

Detalhes de cada parte do projeto:

- [backend/README.md](./backend/README.md) — API, scripts, arquitetura e provedores LLM
- [frontend/README.md](./frontend/README.md) — rotas, scripts e variáveis do Vite
