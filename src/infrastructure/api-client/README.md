# API client

`schema.d.ts` contains generated operation and model types from the pinned temporary
OpenAPI snapshot in `contracts/`. Run `npm run generate:client`; never hand-edit it.
`npm run check:contract` verifies deterministic output and schema provenance.

`openapi-fetch` binds these generated operations at the research explorer adapter.
Only feature infrastructure consumes transport DTOs; components use feature-owned
presentation types. No published backend compatibility baseline exists yet.
