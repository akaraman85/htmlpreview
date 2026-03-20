import { expect, test } from "@playwright/test";

test.describe("Public routes", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/HTMLPreview/i);
  });

  test("robots.txt references sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toMatch(/Sitemap:\s*https?:\/\//i);
    const setCookie = res.headers()["set-cookie"];
    expect(setCookie, "robots should not set auth cookies").toBeUndefined();
  });

  test("sitemap.xml is valid XML", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("</urlset>");
    const setCookie = res.headers()["set-cookie"];
    expect(setCookie, "sitemap should not set auth cookies").toBeUndefined();
  });
});
