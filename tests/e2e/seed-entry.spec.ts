import { expect, test } from "@playwright/test";

test("rejects blank input and requires explicit selection after identifier resolution", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Paper title", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Search papers" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("Enter a paper title or identifier.");
  await page.getByLabel("Lookup by").selectOption("identifier");
  await page.getByLabel("DOI or OpenAlex identifier", { exact: true }).fill("10.1234/arbitrary-input");
  await page.getByRole("button", { name: "Resolve identifier" }).click();
  await expect(page.getByRole("button", { name: "Explore citations" })).toBeDisabled();
  await page.getByRole("button", { name: "Select Synthetic seed paper", exact: true }).click();
  await expect(page.getByLabel("Direction", { exact: true })).toHaveValue("outgoing");
  await expect(page.getByLabel("Depth", { exact: true })).toHaveValue("1");
  await expect(page.getByRole("button", { name: "Explore citations" })).toBeEnabled();
});
