import { createFileRoute, Link } from "@tanstack/react-router";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${brand.name} — ${brand.tagline}` },
      { name: "description", content: brand.description },
      { property: "og:title", content: `${brand.name} — ${brand.tagline}` },
      { property: "og:description", content: brand.description },
      { property: "og:url", content: "https://back-then.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://back-then.lovable.app/" }],
  }),
  component: Landing,
});

const sampleQuestions = [
  "What did your childhood bedroom look like?",
  "What did your mother's handwriting look like?",
  "What was the first meal you learned to cook?",
  "Who taught you to drive, and what did they say?",
  "What did your street sound like on a summer evening?",
];

const steps = [
  {
    title: "One question a week",
    body: "Not a blank page. A specific question, chosen for you, that pulls a real memory loose.",
  },
  {
    title: "Answer however you like",
    body: "Talk for two minutes, type a few lines, or start from a photo. Two minutes is enough.",
  },
  {
    title: "It becomes a book",
    body: "Your answers gather into chapters, people and places — the story of your life, in your words.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
        <span className="font-display text-lg tracking-tight">{brand.name}</span>
        <Link
          to="/auth"
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Sign in
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:pt-16">
          <p className="font-sans text-sm uppercase tracking-[0.18em] text-ember">
            {brand.subhead}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.1] sm:text-6xl">
            You'll forget more than you think.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {brand.name} asks you one good question every week. You answer in your own voice. Over
            time, it becomes the story of your life — the small things nobody else will remember to
            write down.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 text-base font-medium text-ember-foreground transition-colors hover:bg-ember/90"
            >
              {brand.cta}
            </Link>
            <span className="text-sm text-muted-foreground">
              {brand.priceMonthly} · {brand.priceAnnualNote}
            </span>
          </div>
        </section>

        <section className="border-y border-border bg-paper">
          <div className="mx-auto max-w-3xl px-5 py-14">
            <h2 className="font-display text-2xl">Questions like these</h2>
            <ul className="mt-6 space-y-4">
              {sampleQuestions.map((q) => (
                <li
                  key={q}
                  className="rounded-lg border border-border bg-background px-5 py-4 font-display text-xl leading-snug"
                >
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Specific on purpose. "Describe your childhood" gets you nothing. A bedroom door, a
              radio, a smell — that gets you the whole afternoon back.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="font-display text-2xl">How it works</h2>
          <ol className="mt-8 space-y-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5">
                <span className="mt-1 font-display text-xl text-ember">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border bg-paper">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <h2 className="font-display text-2xl">Your memories stay yours</h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Private by default. We never invent details, dialogue, or feelings you didn't say — if
              you weren't sure, your memory stays unsure. You can export everything, any time, and
              delete it all in one step.
            </p>
            <div className="mt-10 rounded-xl border border-border bg-background p-6">
              <p className="font-display text-3xl">{brand.priceMonthly}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {brand.priceAnnualNote}. Cancel whenever — your stories remain readable and
                exportable.
              </p>
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-ember px-6 py-3 text-base font-medium text-ember-foreground transition-colors hover:bg-ember/90"
              >
                {brand.cta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-3xl px-5 py-10 text-sm text-muted-foreground">
        <p>
          {brand.name} — {brand.subhead}
        </p>
      </footer>
    </div>
  );
}
