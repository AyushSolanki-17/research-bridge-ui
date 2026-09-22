import type { PaperView } from "../domain/exploration";

/** Show missing values explicitly and retain provider-classified topic uncertainty. */
export function PaperDetails({ paper }: { paper: PaperView }) {
  return <section aria-label="Paper metadata" className="space-y-3 rounded-xl border border-slate-300 bg-white p-5">
    <h3 className="text-xl font-semibold">{paper.title}</h3>
    <dl className="space-y-2">
      <div><dt className="font-semibold">Canonical identifier</dt><dd>{paper.id}</dd></div>
      <div><dt className="font-semibold">DOI</dt><dd>{paper.doi ?? "Unavailable"}</dd></div>
      <div><dt className="font-semibold">Publication date</dt><dd>{paper.date ?? "Unavailable"}</dd></div>
      <div><dt className="font-semibold">Authors</dt><dd>{paper.authors.join(", ") || "Unavailable"}</dd></div>
      <div><dt className="font-semibold">Venue</dt><dd>{paper.venue ?? "Unavailable"}</dd></div>
      <div><dt className="font-semibold">Reported citation count</dt><dd>{paper.citations ?? "Unknown"}</dd></div>
      <div><dt className="font-semibold">Reference metadata</dt><dd>{paper.referencesComplete ? "Reference list supplied" : "Reference list incomplete or unavailable"}</dd></div>
      <div><dt className="font-semibold">Abstract</dt><dd>{paper.abstract ?? "Unavailable"}</dd></div>
      <div><dt className="font-semibold">Topics</dt><dd>{paper.topics.length ? <ul>{paper.topics.map((topic, index) => <li key={index}>{topic.name} — {topic.inference}; provider score: {topic.score ?? "Unknown"}</li>)}</ul> : "Unavailable"}</dd></div>
    </dl>
  </section>;
}
