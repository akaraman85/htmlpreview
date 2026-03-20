import { Buffer } from "node:buffer";
import { expect, test } from "@playwright/test";

/**
 * Requires real storage + a write token (same as production API).
 * Local: .env.local with BLOB_READ_WRITE_TOKEN + API_WRITE_TOKEN (or E2E_WRITE_TOKEN).
 * CI: set secrets and pass as env vars.
 */
const writeToken =
  process.env.E2E_WRITE_TOKEN?.trim() || process.env.API_WRITE_TOKEN?.trim();
const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

test.describe("Preview page + Open Graph (full stack)", () => {
  test("create snippet → meta matches host → og image PNG, no cookies", async ({
    page,
    request,
    baseURL,
  }) => {
    test.skip(
      !writeToken || !hasBlob,
      "Set E2E_WRITE_TOKEN (or API_WRITE_TOKEN) and BLOB_READ_WRITE_TOKEN",
    );
    const origin = new URL(baseURL!).origin;

    const createRes = await request.post(`${origin}/api/snippets`, {
      headers: {
        Authorization: `Bearer ${writeToken}`,
        "Content-Type": "application/json",
      },
      data: {
        title: "E2E OG pipeline",
        html: "<!DOCTYPE html><html><head><title>Inner</title></head><body><h1>Hello from E2E</h1><p>Plain text for excerpt.</p></body></html>",
      },
    });
    expect(
      createRes.ok(),
      `POST /api/snippets failed: ${createRes.status()} ${await createRes.text()}`,
    ).toBeTruthy();

    const body = (await createRes.json()) as { id: string };
    expect(body.id).toBeTruthy();

    await page.goto(`/p/${body.id}`);

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage, "og:image present").toBeTruthy();
    expect(
      ogImage!.startsWith(origin),
      `og:image should use request host.\nGot: ${ogImage}\nExpected prefix: ${origin}`,
    ).toBeTruthy();

    const ogUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content");
    expect(ogUrl).toBe(`${origin}/p/${body.id}`);

    const imgRes = await request.get(ogImage!, {
      headers: {
        "User-Agent": "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
      },
    });
    expect(imgRes.status(), "opengraph-image should return 200").toBe(200);
    expect(imgRes.headers()["content-type"] ?? "").toContain("image/png");
    expect(
      imgRes.headers()["set-cookie"],
      "og:image must not Set-Cookie (Slack unfurl)",
    ).toBeUndefined();

    const buf = await imgRes.body();
    expect(buf.byteLength).toBeGreaterThan(800);
    const sig = Buffer.from(buf).subarray(0, 8);
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(sig.equals(png), "response body should be a PNG").toBeTruthy();
  });
});
