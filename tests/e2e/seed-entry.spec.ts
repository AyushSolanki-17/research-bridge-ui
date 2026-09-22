import { expect, test } from "@playwright/test";

test("reviews a keyboard-entered draft without claiming resolved research", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const seed = page.getByLabel("Paper title, DOI or OpenAlex identifier", { exact: true });
  await expect(seed).toBeFocused();
  await seed.fill("10.1234/arbitrary-paper");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Direction", { exact: true })).toBeFocused();
  await page.getByLabel("Direction", { exact: true }).selectOption("Incoming citations");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Depth", { exact: true })).toBeFocused();
  await page.getByLabel("Depth", { exact: true }).selectOption("3");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("10.1234/arbitrary-paper · Incoming citations · Depth 3");
  await expect(page.getByRole("status")).toContainText("No paper has been resolved");
  await seed.fill("A different title");
  await expect(page.getByRole("status")).toBeEmpty();
});

test("rejects whitespace and defaults to a conservative scope", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Direction", { exact: true })).toHaveValue("Outgoing citations");
  await expect(page.getByLabel("Depth", { exact: true })).toHaveValue("1");
  const seed = page.getByLabel("Paper title, DOI or OpenAlex identifier", { exact: true });
  await seed.fill("   ");
  await page.getByRole("button", { name: "Review draft scope" }).click();
  await expect(page.getByRole("alert")).toHaveText("Enter a paper title, DOI or OpenAlex identifier.");
  await expect(seed).toBeFocused();
  await expect(seed).toHaveAttribute("aria-invalid", "true");
  await seed.fill("A research title");
  await page.getByRole("button", { name: "Review draft scope" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("A research title · Outgoing citations · Depth 1");
});
