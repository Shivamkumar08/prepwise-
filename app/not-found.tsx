import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-signal font-medium mb-4">
          404
        </p>
        <h1 className="font-display font-extrabold text-3xl text-ink">
          This page doesn&apos;t exist.
        </h1>
        <p className="text-ink/60 mt-3">
          It might have been moved, unpublished, or the link was mistyped.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-signal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
