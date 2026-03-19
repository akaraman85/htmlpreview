"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import type { UserToken } from "@/lib/types";

type AdminDashboardProps = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [newToken, setNewToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/tokens");
      if (!response.ok) {
        throw new Error("Failed to load tokens");
      }
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    if (!user.id) {
      setError("User ID not available");
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      const response = await fetch("/api/admin/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tokenName || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate token");
      }

      const data = await response.json();
      setNewToken(data.token);
      setTokenName("");
      await loadTokens();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate token");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteToken = async (token: string) => {
    if (!confirm("Are you sure you want to delete this token? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/tokens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete token");
      }

      await loadTokens();
      if (newToken === token) {
        setNewToken(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete token");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-12 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "#1C2541" }}
          >
            Admin Dashboard
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "#6C7A89" }}
          >
            Welcome, {user.name || user.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-95"
          style={{
            backgroundColor: "#E3EAF2",
            color: "#1C2541",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#CDEFEF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#E3EAF2";
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "#FF7F7F",
            backgroundColor: "#FFF5F5",
            color: "#1C2541",
          }}
        >
          {error}
        </div>
      )}

      {/* New Token Display */}
      {newToken && (
        <div
          className="rounded-xl border p-6 shadow-lg"
          style={{
            borderColor: "#5BC0BE",
            backgroundColor: "#CDEFEF",
          }}
        >
          <h2
            className="mb-2 text-lg font-semibold"
            style={{ color: "#1C2541" }}
          >
            🎉 New Token Generated!
          </h2>
          <p
            className="mb-4 text-sm"
            style={{ color: "#6C7A89" }}
          >
            Copy this token now. You won't be able to see it again.
          </p>
          <div className="flex items-center gap-2">
            <code
              className="flex-1 rounded-lg bg-white p-3 text-sm font-mono"
              style={{ color: "#1C2541" }}
            >
              {newToken}
            </code>
            <button
              onClick={() => copyToClipboard(newToken)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-95"
              style={{
                backgroundColor: "#3A506B",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2a3d52";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3A506B";
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Generate Token Section */}
      <section
        className="rounded-xl border p-6 shadow-lg"
        style={{
          borderColor: "#E3EAF2",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h2
          className="mb-4 text-xl font-semibold"
          style={{ color: "#1C2541" }}
        >
          Generate API Token
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Token name (optional)"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-2"
            style={{
              borderColor: "#E3EAF2",
              color: "#1C2541",
            }}
          />
          <button
            onClick={handleGenerateToken}
            disabled={generating}
            className="rounded-lg px-6 py-2 font-medium text-white transition-all active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: "#3A506B",
            }}
            onMouseEnter={(e) => {
              if (!generating) {
                e.currentTarget.style.backgroundColor = "#2a3d52";
              }
            }}
            onMouseLeave={(e) => {
              if (!generating) {
                e.currentTarget.style.backgroundColor = "#3A506B";
              }
            }}
          >
            {generating ? "Generating..." : "Generate Token"}
          </button>
        </div>
      </section>

      {/* Existing Tokens */}
      <section
        className="rounded-xl border p-6 shadow-lg"
        style={{
          borderColor: "#E3EAF2",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h2
          className="mb-4 text-xl font-semibold"
          style={{ color: "#1C2541" }}
        >
          Your API Tokens
        </h2>
        {loading ? (
          <p style={{ color: "#6C7A89" }}>Loading tokens...</p>
        ) : tokens.length === 0 ? (
          <p style={{ color: "#6C7A89" }}>
            No tokens yet. Generate one above to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
                style={{
                  borderColor: "#E3EAF2",
                  backgroundColor: "#F7F9FB",
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-medium"
                      style={{ color: "#1C2541" }}
                    >
                      {token.name}
                    </span>
                    {newToken === token.token && (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: "#5BC0BE",
                          color: "#FFFFFF",
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "#6C7A89" }}
                  >
                    Created: {new Date(token.createdAt).toLocaleString()}
                  </p>
                  <code
                    className="mt-2 block text-xs font-mono"
                    style={{ color: "#6C7A89" }}
                  >
                    {token.token.slice(0, 20)}...
                  </code>
                </div>
                <button
                  onClick={() => handleDeleteToken(token.token)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition-all active:scale-95"
                  style={{
                    backgroundColor: "#FF7F7F",
                    color: "#FFFFFF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF6B6B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF7F7F";
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
