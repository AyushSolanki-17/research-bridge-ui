import { forwardResearchRequest } from "@/composition/research-proxy";

/** Forward supported research reads through server-owned backend configuration. */
export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return forwardResearchRequest(request, path.join("/"));
}
