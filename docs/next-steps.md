# Next steps

The citation explorer journey is implemented against a pinned temporary backend
schema snapshot. It supports title search and pagination, identifier resolution,
explicit paper selection, bounded direction/depth and metadata filters, synchronized
graph/list selection, paper metadata and source-evidence inspection.

## Current assignment

### Validate the citation explorer against a published backend contract

**Owner:** `research-explorer`, `evidence-viewer`, generated API client and composition.
**Status:** the controlled production-browser journey is implemented. Published
contract compatibility and live provider verification remain outstanding.

1. Obtain the immutable Research Bridge AI schema release. Replace the temporary
   snapshot documented in `contracts/README.md`, record its release identifier,
   checksum and generator version, and review compatibility before regeneration.
2. Configure `RESEARCH_BRIDGE_API_URL` for the deployed backend and verify arbitrary
   title/DOI/OpenAlex inputs, incoming/outgoing/both directions and metadata filters
   against real responses. Keep provider credentials server-side in the backend.
3. Collect user feedback on the single seed → citations → evidence journey before
   adding capabilities. Verify keyboard and assistive-technology behavior with users.

## Implemented behavior and verification

- Candidate ambiguity requires explicit selection, including identifier lookup.
- Graph/list selection shares one state. Arrows always mean citing → cited, never
  proven influence. Paper and edge inspection preserve evidence and original reference identity.
- Loading, cancellation, input errors, empty results, provider errors, missing seeds,
  truncated/failed graphs and partial candidates remain visible. Stop reasons,
  unresolved references, metadata gaps and unread incoming pages are preserved.
- Filters are applied by the backend after bounded traversal, retain the seed, and
  are displayed from the returned scope. The browser does not reimplement matching.
- Contract checks verify the snapshot checksum, generator and generated output;
  fixture validation and production-browser tests run in `npm run check`.
- The proxy reads backend configuration only on the server. Product code never
  serves the synthetic test fixtures.

The runtime defaults to an explicit service-unconfigured error until a backend URL
is supplied. An unreleased snapshot is not a production compatibility guarantee.

**Non-goals:** accounts, saved projects, collaboration, billing, LLM answers,
ranking, scoring, graph editing, persistence, additional providers, design-system
extraction or generalized visualization infrastructure.
