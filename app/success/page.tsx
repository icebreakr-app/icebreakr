import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-cyan/30 bg-panel/80 p-8 shadow-glow">
        <h1 className="text-3xl font-bold text-cyan">Payment successful</h1>
        <p className="mt-3 text-slate-200">
          Your Pro subscription is active. Return to the app and verify your billing email to unlock unlimited generations.
        </p>
        <Link
          href="/app"
          className="mt-6 inline-block rounded-lg bg-cyan px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
        >
          Go to App
        </Link>
      </div>
    </main>
  );
}
