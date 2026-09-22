import { useId } from "react";
import type { Neighborhood } from "../domain/exploration";

/** Render a bounded diagram whose selections are shared with the accessible lists. */
export function CitationGraph({ graph, selected, onPaper, onCitation }: {
  graph: Neighborhood; selected: string | null; onPaper: (id: string) => void; onCitation: (id: string) => void;
}) {
  const arrow = useId().replaceAll(":", "");
  const ids = [...new Set([...graph.papers.map((paper) => paper.id), ...graph.citations.flatMap((edge) => [edge.source, edge.target])])];
  const positions = new Map(ids.map((id, index) => [id, { x: 110 + (index % 4) * 240, y: 70 + Math.floor(index / 4) * 140 }]));
  return <div className="overflow-auto rounded-xl border border-slate-300 bg-white">
    <svg viewBox={`0 0 960 ${Math.max(180, Math.ceil(ids.length / 4) * 140)}`} className="min-w-[640px] w-full" aria-label="Citation graph; arrows point from citing to cited paper" role="group">
      <defs><marker id={arrow} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
      {graph.citations.map((edge) => {
        const from = positions.get(edge.source)!;
        const to = positions.get(edge.target)!;
        const path = `M ${from.x} ${from.y + 22} Q ${(from.x + to.x) / 2} ${Math.max(from.y, to.y) + 80} ${to.x} ${to.y + 22}`;
        return <g key={edge.id} role="button" tabIndex={0} aria-label={`Inspect citation ${edge.source} cites ${edge.target}`} aria-pressed={selected === `edge:${edge.id}`}
          className="cursor-pointer text-teal-800 focus:outline-2" onClick={() => onCitation(edge.id)} onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onCitation(edge.id); }
          }}>
          <path d={path} fill="none" stroke="transparent" strokeWidth="16" />
          <path d={path} fill="none" stroke="currentColor" strokeWidth={selected === `edge:${edge.id}` ? 4 : 1.5} markerEnd={`url(#${arrow})`} />
        </g>;
      })}
      {ids.map((id) => {
        const paper = graph.papers.find((item) => item.id === id);
        const { x, y } = positions.get(id)!;
        return <g key={id} transform={`translate(${x},${y})`} role={paper ? "button" : undefined} tabIndex={paper ? 0 : undefined}
          aria-label={paper ? `Inspect paper ${paper.title}` : `${id}: unresolved endpoint`} aria-pressed={paper ? selected === `paper:${id}` : undefined}
          className={paper ? "cursor-pointer focus:outline-2" : ""}
          onClick={() => { if (paper) onPaper(id); }} onKeyDown={(event) => {
            if (paper && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onPaper(id); }
          }}>
          <rect x="-96" y="-22" width="192" height="44" rx="8" fill={selected === `paper:${id}` ? "#ccfbf1" : "#f8fafc"} stroke={paper ? "#0f766e" : "#64748b"} strokeWidth={selected === `paper:${id}` ? 3 : 1} />
          <text textAnchor="middle" y="5" fontSize="14">{id}{paper ? "" : " (unresolved)"}</text>
          <title>{paper?.title ?? "Unresolved reference; inspect the citation for its evidence"}</title>
        </g>;
      })}
    </svg>
  </div>;
}
