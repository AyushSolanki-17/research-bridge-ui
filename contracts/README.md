# Contract consumption

`openapi.json` is a **temporary, unreleased schema snapshot** from Research Bridge AI.
It enables contract-backed interaction work; it is not a published compatibility baseline.

- Source repository: https://github.com/AyushSolanki-17/research-bridge-ai
- Source commit: `b7bed499f21b51190b6a99f21237a9c20159cae3`
- Source artifact: `contracts/openapi.json`; API info version: `0.1.0`
- SHA-256: `9361b9d168112f7a10597d4449e700d296979a4512d28be472f007942dff3ee6`
- Generator: `openapi-typescript` `7.13.0`, with `defaultNonNullable: false`
- Runtime transport: `openapi-fetch` `0.17.0`
- Published release identifier: **not available**

Machine-readable provenance lives in `provenance.json`. The checked-in artifact is
self-contained; generation and builds never read another checkout or a running backend.
Optional response properties stay optional in generated types; adapters apply only
schema-declared defaults and preserve missing metadata, zero counts and unknown scores.

```sh
npm run generate:client
npm run check:contract
```

The check verifies the checksum, generator version, byte-for-byte generated output,
and synthetic test responses against the operation/status schemas. `npm run check`
runs it in CI. `schema.d.ts` is generated transport output; do not edit it by hand.
Feature adapters own translation into view state. No backend traversal, normalization,
filter matching or inference rule is reproduced in the browser.

Before production compatibility is claimed, obtain an immutable published schema
release, record its release identifier and checksum, review breaking changes, regenerate,
and rerun contract and browser checks. Do not scrape a development endpoint for releases.
