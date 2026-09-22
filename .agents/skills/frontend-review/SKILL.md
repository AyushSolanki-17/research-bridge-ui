---
name: frontend-review
description: Review frontend capability boundaries, accessibility, evidence rendering and production behavior.
---

# Frontend Review

Read `docs/architecture.md`. Trace route → feature → adapter → client dependencies and detect deep imports or cycles. Verify server-only code cannot enter browser exports. Inspect keyboard access, focus recovery, graph alternatives, evidence visibility and partial results. Check cancellation and stale-response handling. Test the production bundle and important user journeys when code exists. Report concrete findings with location, consequence and correction; distinguish verified behavior from planned checks.

## Source convention

Use `src/features/<capability>/`. Components and rendering hooks belong in interfaces; framework-independent actions and ports in application; pure state invariants in domain; transport mapping in infrastructure. App/composition code wires them. Create only layers required by behavior.


## Ownership and reuse

Follow `CONTRIBUTING.md` for commit conventions and DRY review. Reuse the owning capability or released library before adding equivalent behavior. Keep generated contracts reproducible and maintain repository guidance locally.
