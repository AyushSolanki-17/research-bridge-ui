# Composition

`ResearchJourney` connects the research gateway, explorer and evidence viewer using
one evidence selection. `research-proxy.ts` owns server-only backend configuration
and forwards only supported research operations through the same origin.

Set `RESEARCH_BRIDGE_API_URL` on the server. It is never a public environment variable
or serialized prop. Missing configuration produces an explicit unavailable response.
Provider credentials, if needed, belong to the backend, not the frontend bundle.
