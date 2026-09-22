import type { Neighborhood } from "../domain/exploration";
import { CitationGraph } from "./CitationGraph";

/** Keep graph/list presentation, applied scope, and completion diagnostics on one result. */
export function GraphResults({ graph, selected, onPaper, onCitation }: {
  graph: Neighborhood; selected: string | null; onPaper: (id: string) => void; onCitation: (id: string) => void;
}) {
  const filterLabels: Record<string, string> = {
    yearFrom: "Year from", yearTo: "Year to", minCitations: "Minimum citations",
    maxCitations: "Maximum citations", author: "Author", venue: "Venue", topic: "Topic",
  };
  const filters = Object.entries(graph.scope).filter(([key, value]) => !["direction", "depth"].includes(key) && value !== undefined);
  return <section aria-label="Exploration results" className="space-y-5">
    <h2 className="text-2xl font-semibold">Citation neighborhood</h2>
    <p><strong>Acquisition status: {graph.status}</strong>. Complete means complete within the applied bounds, not all citations in the literature.</p>
    <p>Applied scope: {graph.scope.direction}, depth {graph.scope.depth}. Limits: {graph.bounds.nodes} papers, {graph.bounds.edges} citations, {graph.bounds.requests} requests, {graph.bounds.seconds} seconds.</p>
    <p>Filters on returned results: {filters.length ? filters.map(([key, value]) => `${filterLabels[key]}: ${value}`).join("; ") : "none"}. Seed retained. Acquired before filtering: {graph.acquiredNodes} papers, {graph.acquiredEdges} citations.</p>
    {(graph.reasons.length > 0 || graph.diagnostics.length > 0) && <aside aria-label="Completeness diagnostics" className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <h3 className="font-semibold">Incomplete or limited evidence</h3>
      <ul className="list-disc pl-5">{[...graph.reasons.map((reason) => `Stop reason: ${reason}`), ...graph.diagnostics].map((item, index) => <li key={index}>{item}</li>)}</ul>
    </aside>}
    {!graph.papers.length && <p>No papers returned. {graph.seed === null ? "The seed could not be acquired." : "Review the result diagnostics."}</p>}
    {!graph.citations.length && <p>No citations returned within this scope. This does not establish that no citations exist.</p>}
    <p className="text-sm text-slate-600">A citation is a reported reference, not proven influence. Select a node or arrow, or use the equivalent lists below.</p>
    {graph.papers.length > 0 && <CitationGraph graph={graph} selected={selected} onPaper={onPaper} onCitation={onCitation} />}
    <h3 className="text-xl font-semibold">Papers</h3>
    <ul aria-label="Papers in neighborhood" className="space-y-2">{graph.papers.map((paper) => <li key={paper.id}>
      <button className="research-link" aria-pressed={selected === `paper:${paper.id}`} onClick={() => onPaper(paper.id)}>{paper.title} ({paper.id})</button>
    </li>)}</ul>
    <h3 className="text-xl font-semibold">Reported citations</h3>
    <ul aria-label="Citations in neighborhood" className="space-y-2">{graph.citations.map((edge) => <li key={edge.id}>
      <button className="research-link" aria-pressed={selected === `edge:${edge.id}`} onClick={() => onCitation(edge.id)}>{edge.source} cites {edge.target}</button>
    </li>)}</ul>
  </section>;
}
