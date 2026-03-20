import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getSnippet } from "@/lib/store";

export const runtime = "nodejs";

export const alt = "HTMLPreview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function truncateTitle(title: string, max = 72): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function loadInterFonts(): Promise<{
  bold: ArrayBuffer;
  regular: ArrayBuffer;
}> {
  const [bold, regular] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-700-normal.woff2",
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to load Inter 700");
      return res.arrayBuffer();
    }),
    fetch(
      "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff2",
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to load Inter 400");
      return res.arrayBuffer();
    }),
  ]);
  return { bold, regular };
}

const interFontOptions = (fonts: { bold: ArrayBuffer; regular: ArrayBuffer }) =>
  [
    {
      name: "Inter",
      data: fonts.bold,
      style: "normal" as const,
      weight: 700 as const,
    },
    {
      name: "Inter",
      data: fonts.regular,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let snippet: Awaited<ReturnType<typeof getSnippet>> = null;
  try {
    snippet = await getSnippet(id);
  } catch {
    notFound();
  }
  if (!snippet) {
    notFound();
  }

  const fonts = await loadInterFonts();
  const fontOpts = interFontOptions(fonts);

  if (snippet.passphraseHash) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            fontFamily: '"Inter", system-ui, sans-serif',
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
              }}
            >
              HTMLPreview
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: "#94a3b8",
              }}
            >
              Protected HTML snippet
            </div>
          </div>
        </div>
      ),
      {
        width: size.width,
        height: size.height,
        fonts: fontOpts,
      },
    );
  }

  const title = truncateTitle(snippet.title?.trim() || "Shared HTML snippet");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: '"Inter", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "32px 48px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, color: "#60a5fa" }}>
            HTMLPreview
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 64px",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, fontWeight: 400, color: "#94a3b8" }}>
            Open this preview on HTMLPreview
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      fonts: fontOpts,
    },
  );
}
