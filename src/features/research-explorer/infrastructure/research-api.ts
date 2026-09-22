import createClient from "openapi-fetch";
import type { components, paths } from "@/infrastructure/api-client/schema";
import type { EvidenceRecord } from "@/features/evidence-viewer/domain/evidence";
import type { ResearchGateway } from "../application/research-gateway";
import type { Neighborhood, PaperView } from "../domain/exploration";

type Schemas = components["schemas"];

function evidenceView(record: Schemas["Evidence"]): EvidenceRecord {
  return {
    id: record.id, provider: record.provider, recordId: record.provider_record_id,
    sourceUrl: record.source_url, observedAt: record.observed_at,
    inference: record.inference_status ?? "reported",
  };
}

function paperView({ paper, evidence }: Schemas["ResolvedPaper"]): PaperView {
  return {
    id: paper.identifiers.openalex_id.value, doi: paper.identifiers.doi?.value ?? null,
    title: paper.title ?? "Title unavailable", date: paper.publication_date ?? null,
    authors: (paper.authors ?? []).map((author) => author.display_name),
    venue: paper.venue?.display_name ?? null, abstract: paper.abstract ?? null,
    citations: paper.cited_by_count ?? null, referencesComplete: paper.references_complete ?? false,
    topics: (paper.topics ?? []).map((topic) => ({
      name: topic.display_name ?? "Topic name unavailable", score: topic.score,
      inference: topic.inference_status ?? "inferred_provider",
    })),
    evidence: evidenceView(evidence),
  };
}

function neighborhoodView(result: Schemas["ExplorationResult"]): Neighborhood {
  return {
    papers: result.nodes.map(paperView), seed: result.seed?.value ?? null,
    citations: result.edges.map((edge) => ({
      id: `${edge.source.value}:${edge.target.value}`, source: edge.source.value,
      target: edge.target.value, referencedId: edge.referenced_id.value,
      evidence: evidenceView(edge.evidence),
    })),
    status: result.status, reasons: result.stop_reasons,
    scope: {
      direction: result.mode ?? "outgoing", depth: result.limits.depth ?? 1,
      yearFrom: result.filters?.year_from ?? undefined, yearTo: result.filters?.year_to ?? undefined,
      minCitations: result.filters?.min_citations ?? undefined, maxCitations: result.filters?.max_citations ?? undefined,
      author: result.filters?.author ?? undefined, venue: result.filters?.venue ?? undefined, topic: result.filters?.topic ?? undefined,
    },
    bounds: {
      nodes: result.limits.max_nodes ?? 50, edges: result.limits.max_edges ?? 200,
      requests: result.limits.max_requests ?? 100, seconds: result.limits.max_seconds ?? 30,
    },
    diagnostics: [
      ...result.unresolved.map((gap) => `Unresolved reference: ${gap.source?.value ?? "Seed"} → ${gap.target}: ${gap.reason}`),
      ...result.incomplete_metadata.map((gap) => `Incomplete metadata: ${gap.work_id.value}: ${gap.fields.join(", ")}`),
      ...(result.unread_incoming_pages ?? []).map((gap) => `Unread incoming page: ${gap.target.value}, cursor ${gap.cursor}: ${gap.reason}`),
    ],
    acquiredNodes: result.acquired_nodes ?? result.nodes.length,
    acquiredEdges: result.acquired_edges ?? result.edges.length,
  };
}

function responseError(error: Schemas["ErrorResponse"] | undefined, status: number): Error {
  return new Error(error ? `${error.error.message} (${error.error.code})` : `Research request failed (HTTP ${status}).`);
}

/** Bind the generated contract to same-origin research operations, retaining partial error bodies. */
export function createResearchGateway(): ResearchGateway {
  const client = createClient<paths>({ baseUrl: "/api/research" });
  return {
    async search(query, page, signal) {
      const { data, error, response } = await client.POST("/v1/papers/search", {
        body: { query, page, limits: { page_size: 10, max_results: 100, max_requests: 20, max_seconds: 30 } }, signal,
      });
      const result = data ?? (error && "candidates" in error ? error : undefined);
      if (!result) throw responseError(error && "error" in error ? error : undefined, response.status);
      return { papers: result.candidates.map(paperView), page: result.page, nextPage: result.next_page, status: result.status, reasons: result.stop_reasons };
    },
    async resolve(identifier, signal) {
      const { data, error, response } = await client.POST("/v1/papers/resolve", { body: { identifier }, signal });
      if (!data) throw responseError(error, response.status);
      return paperView(data);
    },
    async explore(identifier, scope, signal) {
      const { data, error, response } = await client.POST("/v1/graphs/explore", {
        body: {
          identifier, mode: scope.direction,
          limits: { depth: scope.depth, max_nodes: 50, max_edges: 200, max_requests: 100, max_seconds: 30 },
          filters: {
            year_from: scope.yearFrom, year_to: scope.yearTo, min_citations: scope.minCitations,
            max_citations: scope.maxCitations, author: scope.author, venue: scope.venue, topic: scope.topic,
          },
        }, signal,
      });
      const result = data ?? (error && "nodes" in error ? error : undefined);
      if (!result) throw responseError(error && "error" in error ? error : undefined, response.status);
      return neighborhoodView(result);
    },
  };
}
