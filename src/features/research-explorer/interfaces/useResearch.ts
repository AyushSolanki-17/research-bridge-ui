"use client";

import { useEffect, useRef, useState } from "react";
import type { ResearchGateway } from "../application/research-gateway";
import type { CandidatePage, ExplorationScope, Neighborhood, PaperView } from "../domain/exploration";

/** Coordinate one active operation so cancelled or superseded responses cannot replace current data. */
export function useResearch(gateway: ResearchGateway, clearEvidence: () => void) {
  const active = useRef<AbortController | null>(null);
  const [candidates, setCandidates] = useState<CandidatePage | null>(null);
  const [selected, setSelected] = useState<PaperView | null>(null);
  const [graph, setGraph] = useState<Neighborhood | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => active.current?.abort(), []);

  function interrupt() {
    active.current?.abort();
    active.current = null;
    setBusy(false);
    setError("");
    clearEvidence();
  }

  /** Clear results immediately when their input changes, even before another request starts. */
  function invalidate(lookup = true) {
    interrupt();
    setStatus("");
    setGraph(null);
    if (lookup) { setCandidates(null); setSelected(null); }
  }

  async function run<T>(message: string, operation: (signal: AbortSignal) => Promise<T>, accept: (value: T) => void) {
    interrupt();
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setStatus(message);
    try {
      const value = await operation(controller.signal);
      if (active.current !== controller) return;
      accept(value);
      setStatus("Request finished. Review the result status and diagnostics below.");
    } catch (failure) {
      if (active.current !== controller) return;
      setStatus("");
      setError(failure instanceof Error ? failure.message : "Research request failed. Try again.");
    } finally {
      if (active.current === controller) { active.current = null; setBusy(false); }
    }
  }

  return {
    candidates, selected, graph, busy, status, error,
    invalidate,
    cancel() { interrupt(); setStatus("Cancelled. No result from the cancelled request will be applied."); },
    lookup(query: string, kind: string, page = 1) {
      invalidate();
      if (kind === "title") {
        return run("Searching for candidate papers…", (signal) => gateway.search(query, page, signal), setCandidates);
      }
      return run("Resolving the identifier…", (signal) => gateway.resolve(query, signal), (paper) => {
        setCandidates({ papers: [paper], page: 1, nextPage: null, status: "complete", reasons: [] });
      });
    },
    select(paper: PaperView) {
      invalidate(false);
      setSelected(paper);
      setStatus(`Selected ${paper.title}. Choose a scope and explore citations.`);
    },
    explore(scope: ExplorationScope) {
      if (!selected) return;
      invalidate(false);
      return run("Exploring the bounded citation neighborhood…", (signal) => gateway.explore(selected.id, scope, signal), setGraph);
    },
  };
}
