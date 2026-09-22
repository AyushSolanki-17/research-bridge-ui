import { expect, test } from "@playwright/test";

test("serves the application shell and health endpoint", async ({ page, request }) => {
  const health = await request.get("/health");
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ status: "ok" });
  await page.goto("/");
  await expect(page).toHaveTitle("Research Bridge");
  await expect(page.getByRole("heading", { level: 1, name: "Research Bridge", exact: true })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 250, 249)");
});

test("unknown routes return 404", async ({ request }) => {
  expect((await request.get("/not-a-route")).status()).toBe(404);
});
