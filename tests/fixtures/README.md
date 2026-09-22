# Synthetic research API

`research.json` contains temporary, authored test responses validated against the
pinned unreleased contract in `contracts/`. Titles, people, identifiers and evidence
are synthetic; `example.org` source links are illustrative, not scholarly records.
They are never loaded by the product. Replace or review them when upgrading the contract.

`server.mjs` supplies a controlled API only for Playwright's production-server journey.
It validates request shapes and echoes scope in the graph response; it does not implement
traversal or metadata matching. Browser tests also intercept responses to exercise
failure, partial-result, pagination and cancellation behavior deterministically.
