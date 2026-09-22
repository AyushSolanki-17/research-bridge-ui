---
name: frontend-feature
description: Implement a research UI feature with feature ownership, accessible interactions and evidence semantics.
---

# Frontend Feature

Read `docs/product.md` and `docs/architecture.md`. Locate the owning business capability; routes compose features. Keep view state in the feature and transport translation in its adapter. Preserve evidence references, relation types, unknown confidence and inference status. Handle loading, empty, error, partial and cancellation states. Include keyboard navigation and a list alternative for graph interactions. Test meaningful user actions and the affected journey. Do not introduce new contracts in client-only types.

## Source convention

Use `src/features/<capability>/`. Components and rendering hooks belong in interfaces; framework-independent actions and ports in application; pure state invariants in domain; transport mapping in infrastructure. App/composition code wires them. Create only layers required by behavior.


## Ownership and reuse

Follow `CONTRIBUTING.md` for commit conventions and DRY review. Reuse the owning capability or released library before adding equivalent behavior. Keep generated contracts reproducible and maintain repository guidance locally.
