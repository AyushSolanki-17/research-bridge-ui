# Operations

The root Dockerfile builds a standalone Next.js runtime under an unprivileged user. Its explicit copy list and `.dockerignore` keep repository planning files out of the build context. Container port is 3000; override `PORT` and its published mapping together if needed.

`GET /health` reports this process is responding. It does not assert API, identity or research-data readiness. GitHub CI builds the image without publishing or deploying it. Environment-specific deployment and recovery policies remain to be implemented.

Research operations require server-only `RESEARCH_BRIDGE_API_URL` pointing to a compatible API base URL. The same-origin proxy appends supported `/v1/` paths. The backend owns provider credentials; do not put credentials in frontend public environment variables. `/health` remains process liveness only.
