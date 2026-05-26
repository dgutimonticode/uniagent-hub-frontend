# UniAgent Hub — Frontend

Frontend React estilo Notion de UniAgent Hub.
**Materia:** COM610 | USFX

## Stack
Vite · React 18 · TypeScript · TailwindCSS · shadcn/ui · TipTap

## Setup local

```bash
npm install
cp .env.example .env
npm run dev   # http://localhost:5173
```

## Variables de entorno

Definidas en `.env` (no se commitea). `.env.example` es el template:

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api/v1` | Base URL del backend Flask (incluye el prefijo `/api/v1`). |

El cliente axios la lee en `src/api/client.ts`. Si no está definida, cae al default para desarrollo local contra el backend en docker.

## Scripts

```bash
npm run dev      # dev server con HMR
npm run build    # tsc + vite build (producción)
npm run lint     # ESLint flat config
npm run preview  # servir el build local
```
