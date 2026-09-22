# Research explorer

Owns title search, identifier lookup, explicit candidate selection, bounded citation
scope, graph/list selection and completeness diagnostics.

- `domain/exploration.ts`: presentation projections, not backend business models.
- `application/research-gateway.ts`: cancellable research-operation port.
- `infrastructure/research-api.ts`: generated-client calls and DTO translation,
  including partial search/graph payloads returned with HTTP errors.
- `interfaces/`: forms, request lifecycle, graph/list rendering and paper inspection.

`SeedEntry` accepts a gateway and an evidence callback. Composition supplies the
adapter and joins the independent evidence viewer. The only cross-feature domain
contract is `EvidenceRecord`, owned by the evidence viewer. No reciprocal import exists.
Input changes invalidate dependent results; one active AbortController prevents
cancelled or superseded responses from replacing current state.

The backend owns identifier normalization, title search, filter matching and traversal.
The browser forwards arbitrary input, shows explicit candidate selection, and displays
the returned scope, stop reasons, unresolved references and metadata/page gaps.
