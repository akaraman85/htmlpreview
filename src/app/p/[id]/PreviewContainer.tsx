"use client";

import { useState } from "react";
import { ViewportSelector } from "./ViewportSelector";

type PreviewContainerProps = {
  html: string;
  title: string;
};

export function PreviewContainer({ html, title }: PreviewContainerProps) {
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const handleSizeChange = (width: number, height: number) => {
    setViewportWidth(width);
    setViewportHeight(height);
  };

  // If width/height are 0, use full viewport
  const iframeStyle =
    viewportWidth > 0 && viewportHeight > 0
      ? {
          width: `${viewportWidth}px`,
          height: `${viewportHeight}px`,
          maxWidth: "100%",
          maxHeight: "calc(100vh - 200px)",
          margin: "auto",
          display: "block",
        }
      : {
          width: "100%",
          height: "100%",
        };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ViewportSelector onSizeChange={handleSizeChange} />
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
