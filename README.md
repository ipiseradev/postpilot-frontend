# PostPilot

AI copilot que analiza una publicación de LinkedIn **antes** de publicarla y devuelve feedback accionable: fuerza del hook, legibilidad, estructura narrativa, tecnologías detectadas, hashtags sugeridos y consejos de mejora.

**Demo en vivo:** https://postpilot-frontend-six.vercel.app

## Cómo funciona

1. Pegás el texto de tu post de LinkedIn en el editor.
2. El frontend lo envía a la [API de análisis](https://github.com/ipiseradev/linkedin-post-analyzer-api) (FastAPI).
3. La API devuelve un score por categoría (viral, hook, legibilidad, historia), tecnologías detectadas, hashtags sugeridos y tips de mejora, que se muestran en tarjetas con el detalle.

## Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) (flat config)

## Correr el proyecto en local

```bash
git clone https://github.com/ipiseradev/postpilot-frontend.git
cd postpilot-frontend
npm install
cp .env.example .env   # opcional: apunta a tu propia instancia de la API
npm run dev
```

| Variable       | Descripción                                   | Default                                    |
| -------------- | ---------------------------------------------- | ------------------------------------------- |
| `VITE_API_URL` | Base URL de la API de análisis de posts        | `https://postpilot-api-v2.onrender.com`     |

### Scripts disponibles

- `npm run dev` — servidor de desarrollo con HMR
- `npm run build` — build de producción
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — corre ESLint

## Proyecto relacionado

- [`linkedin-post-analyzer-api`](https://github.com/ipiseradev/linkedin-post-analyzer-api) — API en FastAPI que hace el análisis del post.

## Licencia

MIT — ver [LICENSE](./LICENSE).
