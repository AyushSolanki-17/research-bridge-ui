# Next steps

The runtime and local seed-entry/scope-review screen are implemented. Backend research interactions remain unimplemented.

## Next assignment

### Deliver the citation explorer journey

**Owner:** `research-explorer`, `evidence-viewer`, generated API client and route
composition.
**Status:** local seed-entry and direction/depth draft review are implemented. Research integration awaits a supplied backend schema or approved
schema-conforming fixture. Neither artifact is checked in. Live contract integration
requires an immutable Research Bridge AI schema release.

The runtime shell, health endpoint, lint/type checks, production build configuration,
browser smoke tests and Conventional Commit checks are present. Business features
remain incomplete. The entry screen validates nonblank input and reviews a local draft without resolving a paper or fetching citations. Obtain the contract input before introducing transport models or
fixture-backed interactions; do not infer the schema from the journey description.

**Outcome:** a user can find or enter a seed paper, explicitly choose the intended
work, explore a bounded citation neighborhood and inspect the source evidence for
every displayed paper and citation. This is the only business journey to build
before collecting user feedback.

Implement the work in the following order.

1. **Pin the backend contract and generate the client.** Record the backend release
   identifier, schema SHA-256 and generator version in `contracts/README.md`.
   Generate `src/infrastructure/api-client` reproducibly and keep generated models
   behind feature adapters. Until the immutable artifact is available, use a checked-in
   fixture that is explicitly marked as temporary and conforms to the current schema;
   do not import sibling source files or hand-write a competing client model.
2. **Build one vertical research flow.** Support title search with candidate review,
   direct DOI/OpenAlex identifier entry, explicit selection, outgoing/incoming/both
   modes, depth 1–3 and the documented year, author, venue, citation-count and topic
   filters. Default to conservative bounds and show the applied scope.
3. **Present the result accessibly.** Provide a compact graph plus a keyboard-accessible
   list or table using the same selected-paper state. Selecting a paper or edge opens
   its canonical metadata, evidence identity, provider record, observation time,
   inference status and inspectable source link. Never describe a citation as proven
   influence.
4. **Make incomplete work visible.** Cover loading, empty, invalid-input, missing-paper,
   provider-error, cancelled, truncated and partial-result states. Display stop reasons,
   unresolved references, incomplete metadata and unread incoming-page diagnostics
   when supplied; do not turn a partial response into an apparently complete graph.
5. **Verify the real journey.** Add deterministic interaction tests for search →
   selection → exploration → evidence inspection, keyboard navigation and stale-request
   cancellation. Add one production Playwright journey against a controlled API fixture,
   then run `npm run check` and the governance check.

**Acceptance:**

- A user can complete the full journey without editing a URL or reading raw JSON.
- Candidate ambiguity requires explicit selection; arbitrary valid identifiers work.
- Graph and list views agree on direction, selection, filters and completion status.
- Every visible relationship exposes its source evidence, and all external source
  links are clearly identified.
- The generated client is reproducible from the recorded immutable schema, and no
  backend business rule is reimplemented in the browser.
- The production build and browser journey pass with no backend secret or server-only
  configuration in the client bundle.

**Non-goals:** accounts, saved projects, collaboration, billing, LLM answers,
ranking, scoring, graph editing, persistence, an additional provider, design-system
extraction or generalized visualization infrastructure. Use the simplest graph and
list presentation that makes direction, selection and evidence understandable.

Read coding-style.md for repository design and coding conventions.
