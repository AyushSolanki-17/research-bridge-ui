/** Display attribution, preserving the provider's identity and explicit inference status. */
export interface EvidenceRecord {
  id: string;
  provider: string;
  recordId: string;
  sourceUrl: string;
  observedAt: string;
  inference: string;
}
