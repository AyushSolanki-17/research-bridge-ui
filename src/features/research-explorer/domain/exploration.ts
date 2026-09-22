import type { EvidenceRecord } from "@/features/evidence-viewer/domain/evidence";

/** Canonical metadata projected for candidate review and paper inspection. */
export interface PaperView {
  id: string;
  doi: string | null;
  title: string;
  date: string | null;
  authors: string[];
  venue: string | null;
  abstract: string | null;
  citations: number | null;
  referencesComplete: boolean;
  topics: { name: string; score: number | null; inference: string }[];
  evidence: EvidenceRecord;
}

/** User-selected scope; matching and traversal remain backend-owned. */
export interface ExplorationScope {
  direction: "outgoing" | "incoming" | "both";
  depth: number;
  yearFrom?: number;
  yearTo?: number;
  minCitations?: number;
  maxCitations?: number;
  author?: string;
  venue?: string;
  topic?: string;
}

/** A reported citation, including the originally asserted target identity. */
export interface CitationView {
  id: string;
  source: string;
  target: string;
  referencedId: string;
  evidence: EvidenceRecord;
}

/** Candidate page including incomplete acquisition and continuation information. */
export interface CandidatePage {
  papers: PaperView[];
  page: number;
  nextPage: number | null;
  status: string;
  reasons: string[];
}

/** Acquired graph and backend-supplied completeness diagnostics for display. */
export interface Neighborhood {
  papers: PaperView[];
  citations: CitationView[];
  seed: string | null;
  status: string;
  reasons: string[];
  scope: ExplorationScope;
  bounds: { nodes: number; edges: number; requests: number; seconds: number };
  diagnostics: string[];
  acquiredNodes: number;
  acquiredEdges: number;
}
