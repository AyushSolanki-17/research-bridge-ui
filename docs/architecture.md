# Architecture

Status: configured Next.js application with a local seed-entry/scope-review screen, process health route, npm lockfile, production build, ESLint/TypeScript checks and browser smoke tests. Paper lookup, citation traversal and evidence inspection await the backend contract. See [runtime commands](../README.md).

```text
src/
  app/                         routes, layouts, loading/error boundaries
  composition/                 server configuration and dependency assembly
  features/
    research-explorer/
    evidence-viewer/
      domain/                  pure presentation concepts and state invariants
      application/             user actions, state transitions and transport ports
      infrastructure/          backend-client adapters and DTO translation
      interfaces/              React components, hooks and user interactions
  infrastructure/api-client/   generated transport client
  ui/                          accessible primitives and design tokens
tests/                         feature tests and cross-feature browser journeys
contracts/                     pinned schema provenance and generation policy
docs/                          product, architecture and decisions
ops/                           frontend deployment ownership
```

The four layers shown beneath a feature are the optional pattern for each substantial feature. Create a layer only when used; a simple view may need only `interfaces/`. These are application modules, not separately published packages. Use the root frontend manifest and npm lockfile; no workspace is required.

## Boundaries

Feature interfaces depend on their application/domain and `src/ui`. Application depends on pure domain concepts and local ports. Feature infrastructure implements those ports using `src/infrastructure/api-client`. Route/composition code wires dependencies and joins features through intentional exported contracts. Keep feature-to-feature imports acyclic; use route composition to share selected identifiers rather than reciprocal imports.

Generated transport models do not become canonical view state. The generated client cannot import features/UI; UI primitives cannot import features, clients or app sessions. Keep server-only configuration and session modules out of browser export graphs. React hooks that drive rendering live in interfaces; framework-independent state transitions belong in application. Domain contains frontend state concepts, not copies of backend scientific rules or authorization decisions.

Preserve edge types, evidence identifiers, explicit inference, unknown confidence and truncation notices. Provide keyboard navigation and a list/table alternative to the graph, with loading, empty, error, partial and cancelled states. The backend remains authoritative for permissions and conclusions.

## Implementation and verification

Start with seed → graph → evidence against the Research Bridge AI API. Pin the backend schema and generate the client reproducibly. The bootstrap includes type/lint checks, a production build and browser smoke tests. Add feature interaction tests, contract verification, keyboard/accessibility checks and the critical research journey with those features. Keep secrets out of browser bundles, serialized props, source maps and public environment variables.

Reserve `packages/` for a demonstrably independently reusable library with its own exports, build and consumers. Keep ordinary feature code, visual primitives and the generated client in `src/` until that extraction is justified.

## Toolchain compatibility

The project uses the Next.js 16.3.4 generator baseline with Node 24. ESLint is pinned to 9.39.5 because the bundled React plugin declares support through ESLint 9 and fails under 10. ESLint 9 is marked deprecated upstream; revisit this pin when the Next/React lint configuration supports ESLint 10. Do not bypass peer dependencies or disable React rules to force an upgrade.
