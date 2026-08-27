import Link from "next/link";

const exams = [
  { code: "EX-01", name: "JEE Main", tag: "Engineering", href: "/exams/jee-main" },
  { code: "EX-02", name: "JEE Advanced", tag: "Engineering", href: "/exams/jee-advanced" },
  { code: "EX-03", name: "NEET", tag: "Medical", href: "/exams/neet" },
  { code: "EX-04", name: "CUET", tag: "University Entrance", href: "/exams/cuet" },
  { code: "EX-05", name: "Class 11", tag: "Board + Foundation", href: "/exams/class-11" },
  { code: "EX-06", name: "Class 12", tag: "Board + Foundation", href: "/exams/class-12" },
];

const freeItems = [
  { title: "Short Notes", desc: "Chapter-wise summaries you can revise in minutes." },
  { title: "Formula Notes", desc: "Every formula, one page per chapter." },
  { title: "PYQs", desc: "Real questions from past year exams." },
  { title: "PYP", desc: "Full past year papers, solved." },
  { title: "Free Mock Tests", desc: "One full timed test per exam, always free." },
];

const premiumItems = [
  "Full mock test series (100+ tests per exam)",
  "Premium notes & PDF downloads",
  "Large, categorised question banks",
  "Detailed performance analysis after every test",
];

const whyItems = [
  { title: "Exam-condition timing", desc: "Every mock test runs on the real exam's clock, not a shortened version." },
  { title: "New content, most days", desc: "Notes, PYQs and tests are added continuously — this isn't a static PDF dump." },
  { title: "Free tier that's actually useful", desc: "You can seriously prepare on the free plan alone, before ever paying anything." },
  { title: "Built for one thing", desc: "No unrelated courses, no clutter — just JEE, NEET, CUET, and Class 11/12 prep." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      {/* NAV */}
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-extrabold text-lg text-ink tracking-tight">
            PrepWise
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
            <Link href="/exams" className="hover:text-ink">Exams</Link>
            <Link href="/resources" className="hover:text-ink">Resources</Link>
            <Link href="/mock-tests" className="hover:text-ink">Mock Tests</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/login" className="text-ink/70 hover:text-ink hidden sm:inline">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-ink text-paper px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
            >
              Get free access
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-signal font-medium mb-5">
            No signup needed for free content
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-ink leading-[1.1]">
            Prepare smarter.
            <br />
            Practice better.
          </h1>
          <p className="mt-5 text-ink/70 text-lg max-w-md">
            Notes, formula sheets, PYQs and full timed mock tests for JEE Main,
            JEE Advanced, NEET, CUET, and Class 11 &amp; 12 — built by one person,
            updated almost every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/mock-tests"
              className="bg-signal text-white px-6 py-3 rounded-lg font-medium hover:bg-signalDark transition-colors"
            >
              Start preparing
            </Link>
            <Link
              href="/resources"
              className="border border-line bg-white text-ink px-6 py-3 rounded-lg font-medium hover:border-ink/30 transition-colors"
            >
              Explore free resources
            </Link>
          </div>
        </div>

        {/* Mock test preview card — the signature element */}
        <div className="relative">
          <div className="absolute -inset-4 bg-signal/5 rounded-2xl -rotate-2" aria-hidden="true" />
          <div className="relative bg-ink text-paper rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between text-xs font-body text-paper/60">
              <span>JEE MAIN &middot; PHYSICS</span>
              <span>QUESTION 12 / 90</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-body text-paper/60 tracking-widest uppercase">
                Time left
              </span>
              <span className="font-body text-2xl font-medium tracking-wide">
                02:17:42
              </span>
            </div>
            <div className="mt-6 h-px bg-paper/10" />
            <p className="mt-6 text-sm text-paper/90 leading-relaxed">
              A charged particle moves in a uniform magnetic field along a
              circular path of radius R. If its speed is doubled, the new
              radius is&hellip;
            </p>
            <div className="mt-6 space-y-3">
              {["2R", "R", "4R", "R / 2"].map((opt, i) => (
                <div
                  key={opt}
                  className={`flex items-center gap-3 text-sm rounded-lg px-3 py-2 ${
                    i === 0 ? "bg-paper/10" : ""
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                      i === 0 ? "bg-correct border-correct" : "border-paper/40"
                    }`}
                  />
                  <span className="text-paper/80">{opt}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between text-xs font-body text-paper/50">
              <span>&larr; Previous</span>
              <span>Next &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMS */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <h2 className="font-display font-bold text-2xl text-ink">Choose your exam</h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <Link
              key={exam.code}
              href={exam.href}
              className="group border border-line bg-white rounded-xl p-5 hover:border-signal/40 hover:shadow-sm transition-all"
            >
              <span className="font-body text-xs text-ink/40 tracking-widest">
                {exam.code}
              </span>
              <h3 className="font-display font-bold text-lg text-ink mt-2">
                {exam.name}
              </h3>
              <p className="text-sm text-ink/60 mt-1">{exam.tag}</p>
              <span className="inline-block mt-4 text-sm font-medium text-signal group-hover:translate-x-0.5 transition-transform">
                Browse resources &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-correct" />
          <h2 className="font-display font-bold text-2xl text-ink">
            Free, no login required
          </h2>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {freeItems.map((item) => (
            <div key={item.title} className="border border-line bg-white rounded-xl p-5">
              <h3 className="font-display font-bold text-ink">{item.title}</h3>
              <p className="text-sm text-ink/60 mt-2">{item.desc}</p>
              <span className="inline-block mt-4 text-sm font-medium text-correct">
                Open &rarr;
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PREMIUM */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <div className="bg-ink rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-pen" />
              <span className="font-body text-xs tracking-[0.3em] uppercase text-pen font-medium">
                Premium
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-paper mt-3">
              For students who want the full picture
            </h2>
            <p className="text-paper/60 mt-3 text-sm">
              Premium isn't live for payments yet — this section shows what's
              coming as we build it out.
            </p>
          </div>
          <ul className="space-y-3">
            {premiumItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-paper/90 text-sm">
                <span className="text-pen mt-0.5">&#128274;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <h2 className="font-display font-bold text-2xl text-ink">Why PrepWise</h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-8">
          {whyItems.map((item) => (
            <div key={item.title}>
              <h3 className="font-display font-bold text-ink">{item.title}</h3>
              <p className="text-sm text-ink/60 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST RESOURCES (placeholder) */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
        <h2 className="font-display font-bold text-2xl text-ink">Latest resources</h2>
        <p className="text-sm text-ink/50 mt-2">
          Sample preview — real content will appear here automatically once
          you start publishing from the admin dashboard.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-dashed border-line rounded-xl p-5 text-ink/30">
              <p className="text-xs font-body tracking-widest">PLACEHOLDER</p>
              <p className="text-sm mt-2">Nothing published yet</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-line text-center">
        <h2 className="font-display font-extrabold text-3xl text-ink">
          Your next mock test is one click away.
        </h2>
        <Link
          href="/mock-tests"
          className="inline-block mt-6 bg-signal text-white px-7 py-3 rounded-lg font-medium hover:bg-signalDark transition-colors"
        >
          Start preparing &rarr;
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ink/50">
          <span>&copy; {new Date().getFullYear()} PrepWise</span>
          <span>Built for JEE Main, JEE Advanced, NEET, CUET, Class 11 &amp; 12</span>
        </div>
      </footer>
    </main>
  );
}
