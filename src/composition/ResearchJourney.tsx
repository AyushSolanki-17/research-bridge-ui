"use client";

import { useState } from "react";
import type { EvidenceRecord } from "@/features/evidence-viewer/domain/evidence";
import { EvidencePanel } from "@/features/evidence-viewer/interfaces/EvidencePanel";
import { SeedEntry } from "@/features/research-explorer/interfaces/SeedEntry";
import { createResearchGateway } from "@/features/research-explorer/infrastructure/research-api";

/** Assemble the browser adapter and one evidence selection without coupling feature interfaces. */
export function ResearchJourney() {
  const [gateway] = useState(createResearchGateway);
  const [evidence, setEvidence] = useState<EvidenceRecord | null>(null);
  return <div className="mt-10 space-y-8">
    <SeedEntry gateway={gateway} onEvidence={setEvidence} />
    <EvidencePanel evidence={evidence} />
  </div>;
}
