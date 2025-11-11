# Front-end (Vite + React + TypeScript)

This package renders the Bask IT Up! storefront and admin dashboard using Vite, React, TypeScript, Tailwind CSS, and shadcn-ui.

## Getting Started

```sh
cd front-end
npm install
npm run dev
```

By default the app expects the backend to run at http://localhost:8080. Override the API target by creating a `.env` file and setting `VITE_API_URL`.

## Production Build

```sh
npm run build
npm run preview
```

The Dockerfile in the repo root compiles these assets and serves them through Nginx for deployments.

## Linting

```sh
npm run lint
```

## Environment Variables

| Variable        | Description                               | Default                       |
|-----------------|-------------------------------------------|-------------------------------|
| `VITE_API_URL`  | Base URL for the Spring Boot API          | `http://localhost:8080/api`   |

## Updating the 3D Hero Basket

The home hero loads a glTF model via the [`<model-viewer>`](https://modelviewer.dev/) web component. Drop your `.glb` file in `front-end/public/models/basket.glb` (or adjust the path inside `HeroVisual.tsx`). The poster fallback lives in `public/fallbacks/basket-poster.png`.

## Project Structure (excerpt)

```
src/
  components/      # shared UI pieces (cards, header, footer)
  hooks/           # React Query hooks for API access
  lib/             # utilities (auth context, fetch helpers)
  pages/           # route-level screens (catalog, admin, etc.)
  types/           # TypeScript domain models
```

All product data now flows from the backend; there are no local mocks. Use the Admin dashboard (`/admin`) to create or edit gift baskets once authenticated. Content managers can paste full HTML descriptions, which render directly on product detail pages.
