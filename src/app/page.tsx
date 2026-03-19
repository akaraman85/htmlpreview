"use client";

import { useState } from "react";
import Link from "next/link";
import { AgenticFriendlyModal } from "./AgenticFriendlyModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  
  // Use the production URL, fallback to localhost for development
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://htmlpreview-phi.vercel.app"
      : "http://localhost:3000";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12 md:px-8">
      {/* Admin Link */}
      <div className="flex justify-end">
        <Link
          href="/admin"
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
          🔐 Admin Dashboard
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center">
        <div 
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{ 
            backgroundColor: 'rgba(91, 192, 190, 0.1)',
            color: '#3A506B'
          }}
        >
          <span className="text-lg">🚀</span>
          <span>HTML Snippet Hosting</span>
        </div>
        <h1 
          className="mb-4 bg-clip-text text-5xl font-bold tracking-tight text-transparent"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #3A506B, #5BC0BE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          HTMLPreview
        </h1>
        <p 
          className="mx-auto max-w-2xl text-lg"
          style={{ color: '#6C7A89' }}
        >
          Store your HTML snippets via API and share them instantly with a
          public URL. Perfect for demos, prototypes, and quick previews.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div 
          className="group relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          style={{ 
            borderColor: '#E3EAF2',
            backgroundColor: '#F7F9FB'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#5BC0BE';
            e.currentTarget.style.backgroundColor = '#CDEFEF';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(91, 192, 190, 0.2), 0 10px 10px -5px rgba(91, 192, 190, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E3EAF2';
            e.currentTarget.style.backgroundColor = '#F7F9FB';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🔐</div>
          <h3 
            className="mb-2 font-semibold transition-colors duration-300"
            style={{ color: '#1C2541' }}
          >
            Secure API
          </h3>
          <p 
            className="text-sm transition-colors duration-300"
            style={{ color: '#6C7A89' }}
          >
            Authenticated write access with optional passphrase protection
          </p>
        </div>
        <div 
          className="group relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          style={{ 
            borderColor: '#E3EAF2',
            backgroundColor: '#F7F9FB'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#5BC0BE';
            e.currentTarget.style.backgroundColor = '#CDEFEF';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(91, 192, 190, 0.2), 0 10px 10px -5px rgba(91, 192, 190, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E3EAF2';
            e.currentTarget.style.backgroundColor = '#F7F9FB';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">⚡</div>
          <h3 
            className="mb-2 font-semibold transition-colors duration-300"
            style={{ color: '#1C2541' }}
          >
            Instant Sharing
          </h3>
          <p 
            className="text-sm transition-colors duration-300"
            style={{ color: '#6C7A89' }}
          >
            Get a public URL immediately after uploading your HTML
          </p>
        </div>
        <div 
          className="group relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
          style={{ 
            borderColor: '#E3EAF2',
            backgroundColor: '#F7F9FB'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#5BC0BE';
            e.currentTarget.style.backgroundColor = '#CDEFEF';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(91, 192, 190, 0.2), 0 10px 10px -5px rgba(91, 192, 190, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E3EAF2';
            e.currentTarget.style.backgroundColor = '#F7F9FB';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <div className="mb-3 text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">🎨</div>
          <h3 
            className="mb-2 font-semibold transition-colors duration-300"
            style={{ color: '#1C2541' }}
          >
            Sandboxed Rendering
          </h3>
          <p 
            className="text-sm transition-colors duration-300"
            style={{ color: '#6C7A89' }}
          >
            Safe HTML preview in isolated iframes for security
          </p>
        </div>
      </div>

      {/* API Examples */}
      <section 
        className="rounded-xl border p-6 shadow-lg"
        style={{ 
          borderColor: '#E3EAF2',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💻</span>
            <h2 
              className="text-xl font-semibold"
              style={{ color: '#1C2541' }}
            >
              API Usage
            </h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-95"
            style={{ 
              backgroundColor: '#3A506B'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a3d52'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3A506B'}
          >
            🤖 Agentic Friendly
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: '#1C2541' }}
              >
                Basic snippet:
              </span>
              <span 
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ 
                  backgroundColor: '#CDEFEF',
                  color: '#3A506B'
                }}
              >
                Public
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Sample","html":"<h1>Hello</h1><p>From HTMLPreview</p>"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: '#1C2541' }}
              >
                Protected snippet:
              </span>
              <span 
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ 
                  backgroundColor: '#CDEFEF',
                  color: '#5BC0BE'
                }}
              >
                Passphrase
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Protected","html":"<h1>Secret</h1>","passphrase":"my-secret"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: '#1C2541' }}
              >
                Update existing snippet:
              </span>
              <span 
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ 
                  backgroundColor: '#CDEFEF',
                  color: '#3A506B'
                }}
              >
                Update
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X POST "${baseUrl}/api/snippets" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"id":"existing-id","title":"Updated","html":"<h1>New Content</h1>"}'`}
            </pre>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span 
                className="text-sm font-medium"
                style={{ color: '#1C2541' }}
              >
                Delete snippet:
              </span>
              <span 
                className="rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ 
                  backgroundColor: '#FF7F7F',
                  color: '#FFFFFF'
                }}
              >
                Delete
              </span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gradient-to-br from-zinc-950 to-zinc-900 p-4 text-sm text-zinc-100 shadow-inner">
              {`curl -X DELETE "${baseUrl}/api/snippets/<id>" \\
  -H "Authorization: Bearer $API_WRITE_TOKEN"`}
            </pre>
          </div>
        </div>
      </section>

      {/* Response Info */}
      <section 
        className="group relative cursor-pointer rounded-xl border p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
        style={{ 
          borderColor: '#E3EAF2',
          backgroundColor: '#F7F9FB'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#5BC0BE';
          e.currentTarget.style.backgroundColor = '#CDEFEF';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(91, 192, 190, 0.2), 0 10px 10px -5px rgba(91, 192, 190, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E3EAF2';
          e.currentTarget.style.backgroundColor = '#F7F9FB';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">✨</span>
          <h2 
            className="text-lg font-semibold transition-colors duration-300"
            style={{ color: '#1C2541' }}
          >
            What You Get
          </h2>
        </div>
        <p 
          className="transition-colors duration-300"
          style={{ color: '#6C7A89' }}
        >
          You'll receive a URL to access your stored HTML instantly. For
          protected snippets, the passphrase is automatically included in the URL.
          Update existing snippets by providing the same ID, or delete them when
          no longer needed. Simple, secure, and fast! 🎉
        </p>
      </section>

      {/* Agentic Friendly Modal */}
      {showModal && (
        <AgenticFriendlyModal
          baseUrl={baseUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
