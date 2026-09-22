import { expect, test, type Page } from "@playwright/test";
import fixtures from "../fixtures/research.json";

/** Use the real browser proxy and controlled backend to select a candidate. */
async function selectSeed(page: Page) {
  await page.goto("/");
  await page.getByLabel("Paper title", { exact: true }).fill("Synthetic");
  await page.getByRole("button", { name: "Search papers" }).click();
  await page.getByRole("button", { name: "Select Synthetic seed paper", exact: true }).click();
}

test("production journey preserves explicit selection, applied scope and evidence", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Lookup by")).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.type("Synthetic");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Research results", exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Explore citations" })).toBeDisabled();
  await page.getByRole("button", { name: "Select Synthetic seed paper", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Direction", { exact: true }).selectOption("both");
  await page.getByLabel("Depth", { exact: true }).selectOption("2");
  await page.getByText("Metadata filters (optional)", { exact: true }).click();
  await page.getByLabel("Publication year from", { exact: true }).fill("2020");
  await page.getByLabel("Publication year to", { exact: true }).fill("2025");
  await page.getByLabel("Minimum citation count", { exact: true }).fill("0");
  await page.getByLabel("Maximum citation count", { exact: true }).fill("10");
  await page.getByLabel("Author", { exact: true }).fill("Alex Researcher");
  await page.getByLabel("Venue", { exact: true }).fill("Synthetic Journal");
  await page.getByLabel("Topic", { exact: true }).fill("Synthetic topic");
  const requestPromise = page.waitForRequest((request) => request.url().endsWith("/v1/graphs/explore"));
  await page.getByRole("button", { name: "Explore citations" }).click();
  expect((await requestPromise).postDataJSON()).toEqual({
    identifier: "W1001", mode: "both",
    limits: { depth: 2, max_nodes: 50, max_edges: 200, max_requests: 100, max_seconds: 30 },
    filters: { year_from: 2020, year_to: 2025, min_citations: 0, max_citations: 10, author: "Alex Researcher", venue: "Synthetic Journal", topic: "Synthetic topic" },
  });
  const results = page.getByRole("region", { name: "Exploration results" });
  await expect(results).toContainText("Applied scope: both, depth 2");
  await expect(results).toContainText("Acquisition status: complete");
  await expect(results).toContainText("Author: Alex Researcher");
  const graphPaper = page.getByRole("button", { name: "Inspect paper Synthetic seed paper", exact: true });
  await graphPaper.focus();
  await page.keyboard.press("Enter");
  await expect(graphPaper).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("list", { name: "Papers in neighborhood" }).getByRole("button", { name: "Synthetic seed paper (W1001)" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Selected record", exact: true })).toBeFocused();
  await expect(page.getByRole("region", { name: "Paper metadata" })).toContainText("Reported citation count0");
  await expect(page.getByRole("region", { name: "Paper metadata" })).toContainText("inferred_provider; provider score: Unknown");
  await page.getByRole("list", { name: "Citations in neighborhood" }).getByRole("button").click();
  await expect(page.getByRole("button", { name: "Inspect citation W1001 cites W1002" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("region", { name: "Selected record" })).toContainText("Original referenced identifier: W1002");
  const evidence = page.getByRole("region", { name: "Source evidence" });
  await expect(evidence).toContainText("openalex:work:W1001");
  await expect(evidence).toContainText("2026-09-01T12:00:00Z");
  await expect(evidence).toContainText("reported");
  await expect(evidence.getByRole("link", { name: "Open source record (external, new tab)" })).toHaveAttribute("href", "https://example.org/synthetic/W1001");
  await page.screenshot({ path: "test-results/research-journey.png", fullPage: true });
  await page.getByLabel("Depth", { exact: true }).selectOption("3");
  await expect(results).toHaveCount(0);
  await expect(evidence).toContainText("Inspect a paper or citation");
});

for (const fixtureName of ["partial", "failedGraph", "missingGraph"] as const) {
  test(`preserves ${fixtureName} acquisition diagnostics`, async ({ page }) => {
    await selectSeed(page);
    const fixture = fixtures[fixtureName];
    await page.route("**/v1/graphs/explore", (route) => route.fulfill({ status: fixture.status, json: fixture.body }));
    await page.getByRole("button", { name: "Explore citations" }).click();
    const results = page.getByRole("region", { name: "Exploration results" });
    await expect(results).toContainText(`Acquisition status: ${fixture.body.status}`);
    await expect(results).toContainText(fixture.body.stop_reasons[0]);
    if (fixtureName === "missingGraph") {
      await expect(results).toContainText("The seed could not be acquired");
    } else {
      await expect(results).toContainText("Unresolved reference: W1001 → W9999");
      await expect(results).toContainText("Unread incoming page: W1001, cursor synthetic-cursor");
      await expect(results).toContainText("Incomplete metadata: W1002: cited_by_count");
      await page.getByRole("list", { name: "Papers in neighborhood" }).getByRole("button", { name: "Synthetic related paper (W1002)" }).click();
      await expect(page.getByRole("region", { name: "Paper metadata" })).toContainText("Reported citation countUnknown");
    }
  });
}

for (const fixtureName of ["invalid", "missing", "providerError"] as const) {
  test(`displays ${fixtureName} without invented results`, async ({ page }) => {
    const fixture = fixtures[fixtureName];
    await page.route(`**${fixture.path}`, (route) => route.fulfill({ status: fixture.status, json: fixture.body }));
    await page.goto("/");
    if (fixtureName !== "providerError") await page.getByLabel("Lookup by").selectOption("identifier");
    await page.getByRole("textbox").first().fill("input");
    await page.getByRole("button", { name: fixtureName === "providerError" ? "Search papers" : "Resolve identifier" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(fixture.body.error.message);
    await expect(page.getByRole("region", { name: "Candidate papers" })).toHaveCount(0);
  });
}

test("handles empty search and partial candidate pagination", async ({ page }) => {
  let calls = 0;
  await page.route("**/v1/papers/search", (route) => {
    calls += 1;
    return route.fulfill({ status: calls === 2 ? 502 : 200, json: {
      ...fixtures.search.body, page: calls, candidates: calls === 1 ? [] : fixtures.search.body.candidates,
      status: calls === 2 ? "failed" : "more", stop_reasons: calls === 2 ? ["provider_error"] : [], next_page: calls === 1 ? 2 : null,
    } });
  });
  await page.goto("/");
  await page.getByLabel("Paper title", { exact: true }).fill("Synthetic");
  await page.getByRole("button", { name: "Search papers" }).click();
  await expect(page.getByRole("region", { name: "Candidate papers" })).toContainText("No candidate papers returned");
  await page.getByRole("button", { name: "Next candidates" }).click();
  await expect(page.getByRole("region", { name: "Candidate papers" })).toContainText("Search stop reasons: provider_error");
  await expect(page.getByRole("button", { name: "Select Synthetic seed paper", exact: true })).toBeVisible();
});

test("cancels loading and discards an older response after input changes", async ({ page }) => {
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => { release = resolve; });
  let started: () => void = () => {};
  const seen = new Promise<void>((resolve) => { started = resolve; });
  let finished: () => void = () => {};
  const oldFinished = new Promise<void>((resolve) => { finished = resolve; });
  await page.route("**/v1/papers/search", async (route) => {
    const old = route.request().postDataJSON().query === "Old title";
    if (old) { started(); await held; }
    const body = structuredClone(fixtures.search.body);
    if (old) body.candidates[0].paper.title = "Stale candidate";
    try { await route.fulfill({ json: body }); } catch { /* The cancelled route can already be closed. */ }
    if (old) finished();
  });
  await page.goto("/");
  const input = page.getByLabel("Paper title", { exact: true });
  await input.fill("Old title");
  await page.getByRole("button", { name: "Search papers" }).click();
  await seen;
  await expect(page.getByRole("status")).toContainText("Searching");
  await page.getByRole("button", { name: "Cancel request" }).click();
  await expect(page.getByRole("status")).toContainText("Cancelled");
  await input.fill("New title");
  await page.getByRole("button", { name: "Search papers" }).click();
  await expect(page.getByRole("button", { name: "Select Synthetic seed paper", exact: true })).toBeVisible();
  release();
  await oldFinished;
  await expect(page.getByRole("button", { name: "Select Stale candidate", exact: true })).toHaveCount(0);
  await expect(input).toHaveValue("New title");
  await input.fill("Changed again");
  await expect(page.getByRole("region", { name: "Candidate papers" })).toHaveCount(0);
});

test("rejects unsupported external source URLs", async ({ page }) => {
  const result = structuredClone(fixtures.search.body);
  result.candidates[0].evidence.source_url = "javascript:alert(1)";
  await page.route("**/v1/papers/search", (route) => route.fulfill({ json: result }));
  await selectSeed(page);
  await page.getByRole("button", { name: "Inspect Synthetic seed paper", exact: true }).click();
  const evidence = page.getByRole("region", { name: "Source evidence" });
  await expect(evidence).toContainText("Source link unavailable or unsupported");
  await expect(evidence.getByRole("link")).toHaveCount(0);
});
