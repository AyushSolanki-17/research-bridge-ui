import "server-only";

const supportedPaths = new Set(["v1/papers/search", "v1/papers/resolve", "v1/graphs/explore"]);

function failure(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

/** Proxy only known read operations; never serialize server configuration or upstream headers. */
export async function forwardResearchRequest(request: Request, path: string): Promise<Response> {
  if (!supportedPaths.has(path)) return failure(404, "not_found", "Research operation not found.");
  const base = process.env.RESEARCH_BRIDGE_API_URL;
  if (!base) return failure(503, "backend_unconfigured", "Research service is not configured.");
  try {
    const url = new URL(`${base.replace(/\/$/, "")}/${path}`);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid server configuration.");
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: await request.text(), cache: "no-store", redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(125_000)]),
    });
    if (!response.headers.get("content-type")?.includes("application/json")) {
      return failure(502, "invalid_response", "Research service returned an unreadable response.");
    }
    return new Response(response.body, {
      status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return failure(502, "backend_unavailable", "Research service is unavailable or the request was interrupted. Try again.");
  }
}
