"use client";

import { useState } from "react";

type ViewportSize = {
  name: string;
  width: number;
  height: number;
};

const viewportSizes: ViewportSize[] = [
  { name: "Mobile", width: 375, height: 667 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1920, height: 1080 },
  { name: "Wide Desktop", width: 2560, height: 1440 },
];

type ViewportSelectorProps = {
  onSizeChange: (width: number, height: number) => void;
};

export function ViewportSelector({ onSizeChange }: ViewportSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<ViewportSize | null>(null);

  const handleSizeSelect = (size: ViewportSize) => {
    setSelectedSize(size);
    onSizeChange(size.width, size.height);
  };

  const handleFullscreen = () => {
    setSelectedSize(null);
    onSizeChange(0, 0); // 0 means full viewport
  };

  return (
    <div
      className="flex items-center gap-2 border-b px-4 py-2"
      style={{
        borderColor: "#E3EAF2",
        backgroundColor: "#F7F9FB",
      }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: "#6C7A89" }}
      >
        Viewport:
      </span>
      <div className="flex gap-2">
        {viewportSizes.map((size) => (
          <button
            key={size.name}
            onClick={() => handleSizeSelect(size)}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              backgroundColor:
                selectedSize?.name === size.name ? "#3A506B" : "transparent",
              color:
                selectedSize?.name === size.name ? "#FFFFFF" : "#1C2541",
              border: "1px solid",
              borderColor:
                selectedSize?.name === size.name ? "#3A506B" : "#E3EAF2",
            }}
            onMouseEnter={(e) => {
              if (selectedSize?.name !== size.name) {
                e.currentTarget.style.backgroundColor = "#CDEFEF";
                e.currentTarget.style.borderColor = "#5BC0BE";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSize?.name !== size.name) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#E3EAF2";
              }
            }}
          >
            {size.name}
          </button>
        ))}
        <button
          onClick={handleFullscreen}
          className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
          style={{
            backgroundColor: selectedSize === null ? "#3A506B" : "transparent",
            color: selectedSize === null ? "#FFFFFF" : "#1C2541",
            border: "1px solid",
            borderColor: selectedSize === null ? "#3A506B" : "#E3EAF2",
          }}
          onMouseEnter={(e) => {
            if (selectedSize !== null) {
              e.currentTarget.style.backgroundColor = "#CDEFEF";
              e.currentTarget.style.borderColor = "#5BC0BE";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedSize !== null) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#E3EAF2";
            }
          }}
        >
          Fullscreen
        </button>
      </div>
      {selectedSize && (
        <span
          className="ml-auto text-xs"
          style={{ color: "#6C7A89" }}
        >
          {selectedSize.width} × {selectedSize.height}
        </span>
      )}
    </div>
  );
}
