import Link from "next/link";

const features = [
  "Analyze prospect website or LinkedIn URL in seconds",
  "Generate 5 personalized email openers instantly",
  "Copy-ready lines built for real outbound workflows",
  "Upgrade to Pro for unlimited generations",
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 md:px-10">
      <header className="mb-14 flex items-center justify-between rounded-2xl border border-cyan/20 bg-panel/70 px-5 py-4 backdrop-blur">
        <div className="text-lg font-semibold tracking-wide text-cyan">Icebreakr</div>
        <Link
          href="/app"
          className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Open App
        </Link>
      </header>

      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan">
            AI Cold Email Personalization
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-50 md:text-6xl">
            Write better first lines in under 10 seconds.
          </h1>
          <p className="max-w-xl text-slate-300 md:text-lg">
            Paste a prospect website or LinkedIn URL and get 5 tailored icebreakers designed to start high-response cold emails.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded-xl bg-cyan px-6 py-3 font-semibold text-slate-950 shadow-glow hover:bg-cyan-300"
            >
              Try Free
            </Link>
            <a
              href="#pricing"
              className="rounded-xl border border-cyan/30 bg-slate-900/40 px-6 py-3 font-semibold text-cyan hover:border-cyan"
            >
              View Pricing
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan/20 bg-panel/80 p-6 shadow-glow">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">What Icebreakr does</h2>
          <ul className="space-y-3 text-sm text-slate-300 md:text-base">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-cyan" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pricing" className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-6">
          <h3 className="text-xl font-semibold text-slate-50">Free</h3>
          <p className="mt-2 text-3xl font-bold text-cyan">$0</p>
          <p className="mt-1 text-slate-400">5 generations per day</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            <li>5 personalized openers per run</li>
            <li>Website + LinkedIn URL support</li>
            <li>Copy-to-clipboard built in</li>
          </ul>
          <Link
            href="/app"
            className="mt-6 inline-block rounded-lg border border-cyan/30 px-4 py-2 text-cyan hover:border-cyan"
          >
            Start Free
          </Link>
        </div>

        <div className="rounded-2xl border border-cyan/40 bg-cyan/5 p-6 shadow-glow">
          <h3 className="text-xl font-semibold text-slate-50">Pro</h3>
          <p className="mt-2 text-3xl font-bold text-cyan">$19/mo</p>
          <p className="mt-1 text-slate-300">Unlimited generations</p>
          <ul className="mt-5 space-y-2 text-sm text-slate-200">
            <li>Unlimited usage</li>
            <li>Priority access to future models</li>
            <li>Subscription managed via Stripe</li>
          </ul>
          <Link
            href="/app"
            className="mt-6 inline-block rounded-lg bg-cyan px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Upgrade to Pro
          </Link>
        </div>
      </section>
    </main>
  );
}
