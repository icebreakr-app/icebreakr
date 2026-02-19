"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type GenerateResponse = {
  lines: string[];
  metadata: {
    title: string;
    description: string;
  };
  isPro: boolean;
  remaining?: number;
};

const DAILY_FREE_LIMIT = 5;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function AppPage() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [isPro, setIsPro] = useState(false);

  const [usage, setUsage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingPro, setCheckingPro] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => {
    const savedDay = localStorage.getItem("icebreakr-day");
    const today = getTodayKey();

    if (savedDay !== today) {
      localStorage.setItem("icebreakr-day", today);
      localStorage.setItem("icebreakr-usage", "0");
      setUsage(0);
      return;
    }

    const savedUsage = Number(localStorage.getItem("icebreakr-usage") || "0");
    setUsage(savedUsage);
  }, []);

  const remaining = useMemo(() => {
    if (isPro) {
      return Infinity;
    }
    return Math.max(0, DAILY_FREE_LIMIT - usage);
  }, [isPro, usage]);

  async function verifyPro() {
    if (!email) {
      setError("Enter your billing email to check Pro status.");
      return;
    }

    setCheckingPro(true);
    setError("");

    try {
      const response = await fetch("/api/verify-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to verify subscription.");
      }

      setIsPro(Boolean(data.isPro));
      if (!data.isPro) {
        setError("No active Pro subscription found for this email.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify Pro status.");
    } finally {
      setCheckingPro(false);
    }
  }

  async function startCheckout() {
    if (!email) {
      setError("Enter your email before starting checkout.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session.");
      }

      if (!data.url) {
        throw new Error("Checkout URL missing.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onGenerate(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!url) {
      setError("Please enter a prospect URL.");
      return;
    }

    if (!isPro && usage >= DAILY_FREE_LIMIT) {
      setError("Free limit reached (5/day). Upgrade to Pro for unlimited generations.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name, company, email }),
      });

      const data = (await response.json()) as GenerateResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate icebreakers.");
      }

      setResults(data.lines);
      setMetadata(data.metadata);
      setIsPro(Boolean(data.isPro));

      if (!data.isPro) {
        const todayUsage = usage + 1;
        setUsage(todayUsage);
        localStorage.setItem("icebreakr-usage", String(todayUsage));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 md:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="text-cyan">
          ← Back to Home
        </Link>
        <div className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1 text-sm text-cyan">
          {isPro ? "Pro: Unlimited" : `Free plan: ${Number.isFinite(remaining) ? remaining : "∞"} left today`}
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <form onSubmit={onGenerate} className="rounded-2xl border border-cyan/20 bg-panel/80 p-6 shadow-glow">
          <h1 className="text-2xl font-semibold text-slate-50">Generate Cold Email Icebreakers</h1>
          <p className="mt-2 text-sm text-slate-300">
            Paste a website or LinkedIn URL to generate 5 personalized opening lines.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="url" className="mb-1 block text-sm text-slate-300">
                Prospect URL
              </label>
              <input
                id="url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com or https://linkedin.com/in/..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-cyan placeholder:text-slate-500 focus:ring-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm text-slate-300">
                  Prospect Name (optional)
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-cyan placeholder:text-slate-500 focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="company" className="mb-1 block text-sm text-slate-300">
                  Company (optional)
                </label>
                <input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-cyan placeholder:text-slate-500 focus:ring-2"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-lg bg-cyan px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate 5 Icebreakers"}
          </button>

          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </form>

        <aside className="rounded-2xl border border-cyan/20 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold text-slate-100">Upgrade to Pro</h2>
          <p className="mt-2 text-sm text-slate-300">$19/month for unlimited generations.</p>

          <label htmlFor="email" className="mt-4 block text-sm text-slate-300">
            Billing Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-cyan placeholder:text-slate-500 focus:ring-2"
          />

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={verifyPro}
              disabled={checkingPro}
              className="rounded-lg border border-cyan/30 px-4 py-2 text-sm text-cyan hover:border-cyan disabled:opacity-60"
            >
              {checkingPro ? "Checking..." : "Check Pro Status"}
            </button>
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
            >
              Upgrade with Stripe
            </button>
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-2xl border border-cyan/20 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-slate-100">Results</h2>
        {metadata ? (
          <p className="mt-2 text-sm text-slate-300">
            Based on: <span className="font-medium text-slate-100">{metadata.title}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No results yet.</p>
        )}

        <div className="mt-4 space-y-3">
          {results.map((line, idx) => (
            <div key={`${line}-${idx}`} className="rounded-lg border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-sm text-slate-100">{line}</p>
              <button
                type="button"
                className="mt-2 text-xs text-cyan"
                onClick={async () => {
                  await navigator.clipboard.writeText(line);
                }}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
