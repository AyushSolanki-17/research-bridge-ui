import type { EvidenceRecord } from "../domain/evidence";

/** Render inspectable attribution while refusing executable or malformed source URLs. */
export function EvidencePanel({ evidence }: { evidence: EvidenceRecord | null }) {
  let sourceUrl: string | null = null;
  if (evidence) {
    try {
      const url = new URL(evidence.sourceUrl);
      if (["https:", "http:"].includes(url.protocol)) sourceUrl = url.href;
    } catch { /* Keep malformed source references visible as unavailable links. */ }
  }
  return (
    <section aria-labelledby="evidence-heading" className="rounded-xl border border-slate-300 bg-white p-5">
      <h2 id="evidence-heading" className="text-xl font-semibold">Source evidence</h2>
      {!evidence ? <p className="mt-3">Inspect a paper or citation to view its source record.</p> : (
        <dl className="mt-4 space-y-3 break-words">
          <div><dt className="font-semibold">Evidence identity</dt><dd>{evidence.id}</dd></div>
          <div><dt className="font-semibold">Provider</dt><dd>{evidence.provider}</dd></div>
          <div><dt className="font-semibold">Provider record</dt><dd>{evidence.recordId}</dd></div>
          <div><dt className="font-semibold">Observed at</dt><dd>{evidence.observedAt}</dd></div>
          <div><dt className="font-semibold">Inference status</dt><dd>{evidence.inference}</dd></div>
          <div><dt className="font-semibold">Source</dt><dd>{sourceUrl
            ? <a href={sourceUrl} target="_blank" rel="noreferrer noopener" className="text-teal-800 underline">Open source record (external, new tab)</a>
            : "Source link unavailable or unsupported"}</dd></div>
        </dl>
      )}
    </section>
  );
}
