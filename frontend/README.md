# DevTech Frontend

Frontend React da plataforma **DevTech** — mentoria de carreira para desenvolvedores com trilhas de aprendizado, progresso gamificado e recursos de IA.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- TanStack Query
- Axios + JWT
- React Hook Form + Zod

## Pré-requisitos

O backend DevTech deve estar rodando:

```bash
cd ../devtech-backend
docker compose up --build
```

API: `http://localhost:3001/api/v1`  
Swagger: `http://localhost:3001/api/docs`

## Instalação

```bash
cp .env.example .env
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## Credenciais de teste

| Papel | E-mail | Senha |
|-------|--------|-------|
| Admin | admin@devpath.com | Admin@123456 |
| Usuário | user@devpath.com | User@123456 |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

## Estrutura

- `/` — Landing page
- `/trilhas`, `/tecnologias` — Catálogo público
- `/app/*` — Área autenticada (dashboard, roadmap, avaliações, IA)
- `/admin/*` — Painel administrativo (CRUD)

## Variáveis de ambiente

```
VITE_API_URL=http://localhost:3001/api/v1
```
