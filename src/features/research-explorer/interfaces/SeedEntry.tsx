"use client";

import { useRef, useState } from "react";

/** Collects a local exploration draft without claiming backend resolution. */
export function SeedEntry() {
  const [seed, setSeed] = useState("");
  const [direction, setDirection] = useState("Outgoing citations");
  const [depth, setDepth] = useState("1");
  const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const seedInput = useRef<HTMLInputElement>(null);
  const fieldClass = "mt-2 block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700";

  return (
    <section aria-labelledby="seed-heading" className="mt-10">
      <h2 id="seed-heading" className="text-2xl font-semibold">Prepare a citation exploration</h2>
      <p id="connection-status" className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-slate-800">
        Backend connection pending. You can prepare and review a scope here, but paper search,
        candidate selection and citation exploration are not available yet. No research request is sent.
      </p>
      <form
        className="mt-6 space-y-6"
        aria-describedby="connection-status"
        onChange={() => { setReview(null); setError(""); }}
        onSubmit={(event) => {
          event.preventDefault();
          if (!seed.trim()) {
            setError("Enter a paper title, DOI or OpenAlex identifier.");
            seedInput.current?.focus();
            return;
          }
          setError("");
          setReview(`${seed.trim()} · ${direction} · Depth ${depth}`);
        }}
      >
        <div>
          <label htmlFor="seed" className="font-medium">Paper title, DOI or OpenAlex identifier</label>
          <input
            ref={seedInput}
            id="seed"
            name="seed"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "seed-help seed-error" : "seed-help"}
            className={fieldClass}
          />
          <p id="seed-help" className="mt-2 text-sm text-slate-600">
            A draft does not identify a paper. Candidate review and explicit paper selection will be required after lookup.
          </p>
          {error && <p id="seed-error" role="alert" className="mt-2 text-sm text-red-800">{error}</p>}
        </div>
        <fieldset className="space-y-4">
          <legend className="font-medium">Requested citation scope</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="direction">Direction
              <select id="direction" value={direction} onChange={(event) => setDirection(event.target.value)} className={fieldClass}>
                <option>Outgoing citations</option>
                <option>Incoming citations</option>
                <option>Both directions</option>
              </select>
            </label>
            <label htmlFor="depth">Depth
              <select id="depth" value={depth} onChange={(event) => setDepth(event.target.value)} className={fieldClass}>
                <option value="1">1 hop</option>
                <option value="2">2 hops</option>
                <option value="3">3 hops</option>
              </select>
            </label>
          </div>
          <p className="text-sm text-slate-600">
            Outgoing follows papers the seed cites; incoming follows papers citing the seed.
            A citation records a reference, not proven influence. Filters will be available when the backend contract is connected.
          </p>
        </fieldset>
        <button type="submit" className="rounded-md bg-teal-800 px-5 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
          Review draft scope
        </button>
      </form>
      <div role="status" aria-live="polite" aria-atomic="true" className="mt-6">
        {review && <p className="rounded-md border border-slate-300 p-4"><strong>Draft scope:</strong> {review}. No paper has been resolved and no citations have been retrieved.</p>}
      </div>
    </section>
  );
}
