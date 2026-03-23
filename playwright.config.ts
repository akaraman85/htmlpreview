import { defineConfig, devices } from "@playwright/test";

/** Next.js `next start` listens here when Playwright spawns the local webServer. */
const localPort = process.env.PLAYWRIGHT_PORT ?? "3000";
const defaultLocalBase = `http://127.0.0.1:${localPort}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? defaultLocalBase;

/** When true, Playwright does not start `next start` (use for Vercel / any deployed URL). */
function shouldSkipLocalWebServer(): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1") return true;
  try {
    const host = new URL(baseURL).hostname;
    return host !== "localhost" && host !== "127.0.0.1";
  } catch {
    return false;
  }
}

const remote = shouldSkipLocalWebServer();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  ...(remote
    ? {}
    : {
        webServer: {
          command: "npm run build && npm run start",
          url: baseURL,
          // Avoid attaching to whatever is already on :3000 (e.g. another dev app).
          reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "1",
          timeout: 180_000,
          stdout: "pipe",
          stderr: "pipe",
          env: {
            ...process.env,
            PORT: localPort,
            // NextAuth / Auth.js rejects 127.0.0.1 as host without this in local E2E.
            AUTH_TRUST_HOST: "true",
            // Session checks hit /api/auth/session; avoid MissingSecret spam when .env.local is absent.
            AUTH_SECRET:
              process.env.AUTH_SECRET ??
              "playwright-e2e-only-secret-min-32chars!!",
          },
        },
      }),
});
