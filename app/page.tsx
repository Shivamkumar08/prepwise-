export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-signal mb-4">
        Setup check &middot; 00:01 elapsed
      </p>
      <h1 className="font-display font-extrabold text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
        PrepWise is live on the internet.
      </h1>
      <p className="mt-5 text-ink/70 max-w-xl text-lg">
        This is Phase 1 — the plumbing is connected. The real homepage,
        exam pages, and mock-test engine get built in the phases after this.
      </p>
      <div className="mt-10 flex gap-3 flex-wrap justify-center">
        <span className="px-4 py-2 rounded-full border border-line bg-white text-sm font-medium text-ink/80">
          Next.js ✓
        </span>
        <span className="px-4 py-2 rounded-full border border-line bg-white text-sm font-medium text-ink/80">
          Tailwind ✓
        </span>
        <span className="px-4 py-2 rounded-full border border-line bg-white text-sm font-medium text-ink/80">
          Vercel deploy ✓
        </span>
      </div>
    </main>
  );
}
