import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMemories } from "@/lib/story.functions";
import { AppShell } from "@/components/app-shell";
import { brand } from "@/lib/brand";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/story")({
  head: () => ({
    meta: [
      { title: `My story — ${brand.name}` },
      { name: "description", content: "Every memory you've preserved, in one place." },
      { property: "og:title", content: `My story — ${brand.name}` },
      { property: "og:description", content: "Every memory you've preserved, in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StoryPage,
});

function whenLabel(m: { approximate_year: number | null; life_period: string | null }) {
  if (m.approximate_year) return `around ${m.approximate_year}`;
  if (m.life_period) return m.life_period;
  return "date unknown";
}

function StoryPage() {
  const fetchMemories = useServerFn(listMemories);
  const { data, isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: () => fetchMemories(),
  });

  return (
    <AppShell>
      <h1 className="font-display text-3xl">My story</h1>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-paper p-6">
          <p className="text-muted-foreground">
            Nothing here yet. Your story starts with one memory.
          </p>
          <Link
            to="/today"
            className="mt-5 inline-flex rounded-md bg-ember px-5 py-2.5 text-sm font-medium text-ember-foreground hover:bg-ember/90"
          >
            Answer this week's question
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? "memory" : "memories"} preserved.
          </p>
          {data.map((m) => (
            <article key={m.id} className="rounded-xl border border-border bg-paper p-6">
              {m.question_text && (
                <p className="font-display text-lg text-muted-foreground">{m.question_text}</p>
              )}
              <p className="mt-3 whitespace-pre-wrap prose-memory">
                {m.use_polished && m.polished_text ? m.polished_text : m.original_text}
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                {whenLabel(m)}
              </p>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
