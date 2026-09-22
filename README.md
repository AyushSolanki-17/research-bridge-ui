# Research Bridge UI

Next.js App Router application using TypeScript, Tailwind CSS and ESLint. Application code lives under `src/`; substantial features follow domain/application/infrastructure/interfaces boundaries.

## Local development

Use Node 24 (`nvm use`) and npm 11.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The app serves a seed-entry screen with local citation-scope review and `GET /health`. Paper lookup, graph exploration and evidence inspection await the backend contract; draft review sends no research request. No environment variables or backend connection are required for development. Dependencies are pinned in `package-lock.json`.

## Checks

```sh
npx playwright install chromium
npm run check
```

`check` runs ESLint, generated Next.js route types and TypeScript, a production build, then Chromium smoke tests against the production server. Tests start and stop their own server on port 3000; keep that port free. In Linux CI, install Chromium with `npx playwright install --with-deps chromium`.

Individual commands: `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` (requires a build). ESLint guards inward feature-layer imports; deeper cross-feature API rules remain a review concern.

## Production runtime

```sh
npm run build
npm start
```

The build prepares standalone static assets; `npm start` runs that server directly. It defaults to loopback; set `RB_HOST=0.0.0.0` to listen on all interfaces and `PORT` to override the port.

Or build the standalone container from this repository root:

```sh
docker build -t research-bridge-ui:local .
docker run --rm -p 3000:3000 research-bridge-ui:local
```

The container runs as an unprivileged user. `/health` reports process availability, not backend or research-data readiness. GitHub CI validates the app and builds its image; it does not deploy or publish anything.

## Project guide

- [Product context](docs/product.md)
- [Architecture](docs/architecture.md)
- [Agent instructions](AGENTS.md)
- [Contract policy](contracts/README.md)
- [Source layout decision](docs/decisions/0001-capability-modules.md)

## Contribution setup

After cloning, enable Conventional Commit hooks with `python3 scripts/install_hooks.py` (Python 3.10+). See [CONTRIBUTING.md](CONTRIBUTING.md) for commit format, DRY ownership review, and governance checks. CI validates proposed commits and PR titles even when local hooks are bypassed; branch protection is needed to require that check before merge.
