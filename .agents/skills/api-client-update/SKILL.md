---
name: api-client-update
description: Upgrade a generated frontend API client from a released backend contract.
---

# Api Client Update

Read `contracts/README.md`. Obtain the specific released schema; record its identifier, checksum and generator version. Review breaking changes before regeneration. Keep generated code separate from feature adapters. Update adapters and meaningful contract/interaction tests; run type checking and a production build when available. Report the supported backend release. Do not silently regenerate against an unversioned development endpoint.


## Ownership and reuse

Follow `CONTRIBUTING.md` for commit conventions and DRY review. Reuse the owning capability or released library before adding equivalent behavior. Keep generated contracts reproducible and maintain repository guidance locally.
