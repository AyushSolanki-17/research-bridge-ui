# Contract consumption

Consume a pinned released OpenAPI schema from Research Bridge AI. Record release identifier, checksum and generator version here when the first contract exists. Generate `src/infrastructure/api-client` from that artifact and verify reproducible output in CI.

Do not guess backend models or scrape a development server for release builds. Propose changes in the owning backend, then upgrade the client. Test error codes, pagination, bounds and partial evidence as well as happy responses. No generated client exists yet.
