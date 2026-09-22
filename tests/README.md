# Verification

`npm run check` verifies schema provenance and generated output, validates synthetic
response fixtures, runs lint/type checks, builds production assets and runs Chromium
against the production server and a controlled API on ports 3000 and 4010.

Browser coverage includes title search, identifier resolution, explicit selection,
all scope/filter fields, graph/list selection, evidence inspection, keyboard focus,
empty results, candidate pagination, partial/error responses, missing papers,
cancellation, stale responses and invalid external source URLs. Synthetic fixtures
are described in `fixtures/README.md` and are never served as product data.

Run `npm run check:governance` for handwritten duplication and
`python3 scripts/check_commit.py --history` for Conventional Commits. The existing
remote initialization commit is not conventional; new commits must still conform.
Live provider access, exhaustive accessibility auditing and published-contract
compatibility are not established by the controlled test suite.
