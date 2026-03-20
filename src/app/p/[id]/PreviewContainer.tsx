"use client";

import { useState, type ReactNode } from "react";
import { ViewportSelector } from "./ViewportSelector";

type PreviewContainerProps = {
  html: string;
  title: string;
  /** When true, viewport toolbar is hidden (header already collapsed) — iframe gets more room */
  compactChrome?: boolean;
  /** Rendered on the right side of the viewport toolbar (e.g. collapse chrome) */
  viewportToolbarEnd?: ReactNode;
};

export function PreviewContainer({
  html,
  title,
  compactChrome = false,
  viewportToolbarEnd,
}: PreviewContainerProps) {
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const handleSizeChange = (width: number, height: number) => {
    setViewportWidth(width);
    setViewportHeight(height);
  };

  // If width/height are 0, use full viewport
  const chromeReserve = compactChrome ? 48 : 200;

  const iframeStyle =
    viewportWidth > 0 && viewportHeight > 0
      ? {
          width: `${viewportWidth}px`,
          height: `${viewportHeight}px`,
          maxWidth: "100%",
          maxHeight: `calc(100vh - ${chromeReserve}px)`,
          margin: "auto",
          display: "block",
        }
      : {
          width: "100%",
          height: "100%",
        };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {!compactChrome && (
        <ViewportSelector
          onSizeChange={handleSizeChange}
          trailingActions={viewportToolbarEnd}
        />
      )}
      <section
        className="flex-1 overflow-auto"
        style={{
          backgroundColor: viewportWidth > 0 ? "#E3EAF2" : "transparent",
          display: "flex",
          alignItems: viewportWidth > 0 ? "center" : "stretch",
          justifyContent: viewportWidth > 0 ? "center" : "stretch",
          padding: viewportWidth > 0 ? "20px" : "0",
        }}
      >
        <iframe
          title={title}
          srcDoc={html}
          style={iframeStyle}
          sandbox="allow-scripts allow-same-origin"
        />
      </section>
    </div>
  );
}
