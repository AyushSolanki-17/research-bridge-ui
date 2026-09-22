import type { ExplorationScope } from "../domain/exploration";

const numberFilters = [
  { name: "yearFrom", label: "Publication year from", min: 1, max: 9999 },
  { name: "yearTo", label: "Publication year to", min: 1, max: 9999 },
  { name: "minCitations", label: "Minimum citation count", min: 0 },
  { name: "maxCitations", label: "Maximum citation count", min: 0 },
] as const;
const textFilters = ["author", "venue", "topic"] as const;

/** Collect requested bounds without performing provider matching or filtering in the browser. */
export function ScopeForm({ enabled, busy, onChange, onExplore }: {
  enabled: boolean; busy: boolean; onChange: () => void; onExplore: (scope: ExplorationScope) => void;
}) {
  return (
    <form className="space-y-5" onChange={onChange} onSubmit={(event) => {
      event.preventDefault();
      const fields = new FormData(event.currentTarget);
      const direction = fields.get("direction");
      const scope: ExplorationScope = {
        direction: direction === "incoming" || direction === "both" ? direction : "outgoing",
        depth: Number(fields.get("depth")),
      };
      for (const { name } of numberFilters) {
        const value = fields.get(name);
        if (typeof value === "string" && value !== "") scope[name] = Number(value);
      }
      for (const name of textFilters) {
        const value = fields.get(name);
        if (typeof value === "string" && value.trim()) scope[name] = value.trim();
      }
      onExplore(scope);
    }}>
      <fieldset disabled={!enabled} className="space-y-4">
        <legend className="text-xl font-semibold">Citation scope</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="scope-direction">Direction</label><select id="scope-direction" name="direction" defaultValue="outgoing" className="research-field">
            <option value="outgoing">Outgoing citations</option><option value="incoming">Incoming citations</option><option value="both">Both directions</option>
          </select></div>
          <div><label htmlFor="scope-depth">Depth</label><select id="scope-depth" name="depth" defaultValue="1" className="research-field">
            <option value="1">1 hop</option><option value="2">2 hops</option><option value="3">3 hops</option>
          </select></div>
        </div>
        <p className="text-sm text-slate-600">Outgoing follows references; incoming follows citing papers. Edges always point from citing to cited paper.</p>
        <details>
          <summary className="cursor-pointer font-medium">Metadata filters (optional)</summary>
          <p className="mt-3 text-sm text-slate-600">Filters apply to returned papers after bounded traversal, always retaining the seed. Names match exact display names ignoring case and repeated whitespace; missing metadata fails an enabled filter.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {numberFilters.map((field) => <label key={field.name}>{field.label}<input name={field.name} type="number" min={field.min} max={"max" in field ? field.max : undefined} step="1" className="research-field" /></label>)}
            {textFilters.map((name) => <label key={name} className="capitalize">{name.charAt(0).toUpperCase() + name.slice(1)}<input name={name} maxLength={300} className="research-field" /></label>)}
          </div>
        </details>
        <p className="text-sm text-slate-600">Requested bounds: 50 papers, 200 citations, 100 provider requests, 30 seconds. The backend reports the applied scope and any truncation.</p>
        <button className="research-button" disabled={busy} type="submit">Explore citations</button>
      </fieldset>
      {!enabled && <p className="text-sm text-slate-600">Select the intended paper before exploring.</p>}
    </form>
  );
}
