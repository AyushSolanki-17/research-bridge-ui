import { SeedEntry } from "@/features/research-explorer/interfaces/SeedEntry";

/** Composes the research entry screen while transport integration is pending. */
export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-teal-700">Research, connected</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Research Bridge</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
        Explore citation relationships and inspect the source evidence behind them.
      </p>
      <SeedEntry />
    </main>
  );
}
