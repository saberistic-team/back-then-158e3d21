import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { toast } from "sonner";
import { getMe, getCurrentQuestion, skipQuestion } from "@/lib/story.functions";
import { AppShell } from "@/components/app-shell";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/today")({
  head: () => ({
    meta: [
      { title: `This week's question — ${brand.name}` },
      { name: "description", content: "Answer this week's question in your own words." },
      { property: "og:title", content: `This week's question — ${brand.name}` },
      {
        property: "og:description",
        content: "Answer this week's question in your own words.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Today,
});

function Today() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchMe = useServerFn(getMe);
  const fetchQuestion = useServerFn(getCurrentQuestion);
  const skip = useServerFn(skipQuestion);

  const { data: me, isLoading: meLoading } = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });
  const onboarded = Boolean(me?.profile?.onboarded_at);

  useEffect(() => {
    if (me && !onboarded) navigate({ to: "/onboarding" });
  }, [me, onboarded, navigate]);

  const { data: question, isLoading: qLoading } = useQuery({
    queryKey: ["current-question"],
    queryFn: () => fetchQuestion(),
    enabled: onboarded,
  });

  const skipMutation = useMutation({
    mutationFn: (reason: "not_applicable" | "dont_remember" | "later") =>
      skip({ data: { userQuestionId: question!.userQuestionId, reason } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-question"] });
      toast("Alright — here's another one.");
    },
    onError: () => toast.error("Couldn't skip that question."),
  });

  return (
    <AppShell>
      {meLoading || qLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : question ? (
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ember">
            {me?.profile?.first_name ? `${me.profile.first_name}, this week` : "This week"}
          </p>

          <div className="mt-6 rounded-xl border border-border bg-paper px-6 py-10 shadow-[0_1px_0_0_var(--color-border)]">
            <h1 className="font-display text-3xl leading-snug sm:text-4xl">{question.text}</h1>
            {question.category && (
              <p className="mt-4 text-sm text-muted-foreground">{question.category}</p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <Link
              to="/answer"
              search={{ mode: "write" }}
              className="flex w-full items-center justify-center rounded-md bg-ember px-5 py-3 text-base font-medium text-ember-foreground transition-colors hover:bg-ember/90"
            >
              Write it
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" disabled title="Coming soon">
                Speak it
              </Button>
              <Button variant="outline" disabled title="Coming soon">
                Start from a photo
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Voice and photos arrive in the next update.
            </p>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">Not the right question today?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={skipMutation.isPending}
                onClick={() => skipMutation.mutate("later")}
              >
                Save for later
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={skipMutation.isPending}
                onClick={() => skipMutation.mutate("dont_remember")}
              >
                I don't remember
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={skipMutation.isPending}
                onClick={() => skipMutation.mutate("not_applicable")}
              >
                Doesn't apply to me
              </Button>
            </div>
          </div>

          {typeof me?.memoryCount === "number" && me.memoryCount > 0 && (
            <p className="mt-10 text-sm text-muted-foreground">
              {me.memoryCount} {me.memoryCount === 1 ? "memory" : "memories"} preserved so far.{" "}
              <Link to="/story" className="underline underline-offset-4">
                Read your story
              </Link>
              .
            </p>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">
          You've answered everything we have for now. New questions are on their way.
        </p>
      )}
    </AppShell>
  );
}
