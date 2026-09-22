# research-explorer

Seed lookup, selected research work and bounded graph navigation.

Use `domain/`, `application/`, `infrastructure/`, and `interfaces/` when needed. Components/hooks belong in interfaces; API mapping belongs in infrastructure. Add intentional `index.ts` exports with implementation. See [architecture](../../../docs/architecture.md).

`interfaces/SeedEntry.tsx` collects a paper title or identifier and reviews a local
direction/depth draft. It performs no lookup, identifier validation, candidate
selection or traversal. Backend interactions require the contract described in
`contracts/README.md`; no transport models or synthetic research results are supplied.
