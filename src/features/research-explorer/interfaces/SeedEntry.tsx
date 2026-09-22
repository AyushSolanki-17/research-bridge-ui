"use client";

import { useEffect, useRef, useState } from "react";
import type { EvidenceRecord } from "@/features/evidence-viewer/domain/evidence";
import type { ResearchGateway } from "../application/research-gateway";
import type { CitationView, PaperView } from "../domain/exploration";
import { useResearch } from "./useResearch";
import { ScopeForm } from "./ScopeForm";
import { GraphResults } from "./GraphResults";
import { PaperDetails } from "./PaperDetails";

/** Drive explicit seed selection, bounded exploration and shared graph/list inspection. */
export function SeedEntry({ gateway, onEvidence }: {
  gateway: ResearchGateway; onEvidence: (evidence: EvidenceRecord | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("title");
  const [inputError, setInputError] = useState("");
  const [inspection, setInspection] = useState<{ paper?: PaperView; edge?: CitationView } | null>(null);
  const queryInput = useRef<HTMLInputElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null);
  const research = useResearch(gateway, () => { onEvidence(null); setInspection(null); });
  useEffect(() => {
    if (research.candidates || research.graph) resultHeading.current?.focus();
  }, [research.candidates, research.graph]);
  useEffect(() => { if (inspection) detailsHeading.current?.focus(); }, [inspection]);

  function inspectPaper(paper: PaperView) {
    setInspection({ paper });
    onEvidence(paper.evidence);
  }

  const selectedInspection = inspection?.paper ? `paper:${inspection.paper.id}` : inspection?.edge ? `edge:${inspection.edge.id}` : null;
  return <div className="space-y-8">
    <section aria-labelledby="lookup-heading">
      <h2 id="lookup-heading" className="text-2xl font-semibold">Find a seed paper</h2>
      <form className="mt-5 space-y-4" onSubmit={(event) => {
        event.preventDefault();
        if (!query.trim()) { setInputError("Enter a paper title or identifier."); queryInput.current?.focus(); return; }
        setInputError("");
        void research.lookup(query.trim(), kind);
      }}>
        <label>Lookup by<select className="research-field" value={kind} onChange={(event) => { setKind(event.target.value); research.invalidate(); setInputError(""); }}>
          <option value="title">Paper title</option><option value="identifier">DOI or OpenAlex identifier</option>
        </select></label>
        <label className="block">{kind === "title" ? "Paper title" : "DOI or OpenAlex identifier"}
          <input ref={queryInput} className="research-field" value={query} maxLength={kind === "title" ? 300 : 2048}
            aria-invalid={!!inputError} aria-describedby={inputError ? "query-error" : undefined}
            onChange={(event) => { setQuery(event.target.value); setInputError(""); research.invalidate(); }} />
        </label>
        {inputError && <p role="alert" id="query-error" className="text-red-800">{inputError}</p>}
        <button type="submit" className="research-button" disabled={research.busy}>{kind === "title" ? "Search papers" : "Resolve identifier"}</button>
      </form>
    </section>
    <div role="status" aria-live="polite" aria-atomic="true">{research.status}</div>
    {research.error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-4">{research.error}</p>}
    {research.busy && <button className="research-link" onClick={research.cancel}>Cancel request</button>}
    {(research.candidates || research.graph) && <h2 ref={resultHeading} tabIndex={-1} className="text-xl font-semibold">Research results</h2>}
    {research.candidates && <section aria-label="Candidate papers" className="space-y-4">
      <h3 className="text-xl font-semibold">Review candidates and choose the intended paper</h3>
      <p>Search status: {research.candidates.status}. Page {research.candidates.page}.</p>
      {research.candidates.reasons.length > 0 && <p>Search stop reasons: {research.candidates.reasons.join(", ")}</p>}
      {!research.candidates.papers.length && <p>No candidate papers returned. Try another title or an identifier.</p>}
      <ul className="space-y-3">{research.candidates.papers.map((paper) => <li key={paper.id} className="rounded-xl border border-slate-300 bg-white p-4">
        <h4 className="font-semibold">{paper.title}</h4>
        <p className="mt-1 text-sm">{paper.id} · {paper.date ?? "Date unavailable"} · {paper.venue ?? "Venue unavailable"}</p>
        <p className="text-sm">{paper.authors.join(", ") || "Authors unavailable"}</p>
        <div className="mt-3 flex flex-wrap gap-4">
          <button className="research-link" aria-pressed={research.selected?.id === paper.id} onClick={() => research.select(paper)}>Select {paper.title}</button>
          <button className="research-link" onClick={() => inspectPaper(paper)}>Inspect {paper.title}</button>
        </div>
      </li>)}</ul>
      <div className="flex gap-4">
        {research.candidates.page > 1 && <button className="research-link" onClick={() => void research.lookup(query.trim(), kind, research.candidates!.page - 1)}>Previous candidates</button>}
        {research.candidates.nextPage !== null && <button className="research-link" onClick={() => void research.lookup(query.trim(), kind, research.candidates!.nextPage!)}>Next candidates</button>}
      </div>
    </section>}
    {research.selected && <p className="rounded-md bg-teal-50 p-4"><strong>Selected seed:</strong> {research.selected.title} ({research.selected.id})</p>}
    <ScopeForm enabled={!!research.selected} busy={research.busy} onChange={() => research.invalidate(false)} onExplore={(scope) => void research.explore(scope)} />
    {research.graph && <GraphResults graph={research.graph} selected={selectedInspection}
      onPaper={(id) => { const paper = research.graph!.papers.find((item) => item.id === id); if (paper) inspectPaper(paper); }}
      onCitation={(id) => {
        const edge = research.graph!.citations.find((item) => item.id === id);
        if (edge) { setInspection({ edge }); onEvidence(edge.evidence); }
      }} />}
    {inspection && <section aria-label="Selected record" className="space-y-4">
      <h2 ref={detailsHeading} tabIndex={-1} className="text-xl font-semibold">Selected record</h2>
      {inspection.paper && <PaperDetails paper={inspection.paper} />}
      {inspection.edge && <div className="rounded-xl border border-slate-300 bg-white p-5">
        <h3 className="font-semibold">Reported citation: {inspection.edge.source} cites {inspection.edge.target}</h3>
        <p>Original referenced identifier: {inspection.edge.referencedId}</p>
        <p>This source reports a reference relationship, not proven influence.</p>
      </div>}
    </section>}
  </div>;
}
