import type { CandidatePage, ExplorationScope, Neighborhood, PaperView } from "../domain/exploration";

/** Transport port supporting cancellation without exposing backend DTOs to views. */
export interface ResearchGateway {
  search(query: string, page: number, signal: AbortSignal): Promise<CandidatePage>;
  resolve(identifier: string, signal: AbortSignal): Promise<PaperView>;
  explore(identifier: string, scope: ExplorationScope, signal: AbortSignal): Promise<Neighborhood>;
}
