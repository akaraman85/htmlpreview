"use client";

import Link from "next/link";

export function HeaderLink() {
  return (
    <Link
      href="/"
      className="header-link text-xs font-medium transition-colors hover:underline"
      style={{ color: "#3A506B" }}
    >
      Built By HTMLPreview
    </Link>
  );
}
