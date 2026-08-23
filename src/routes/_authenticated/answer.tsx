import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { getCurrentQuestion, saveMemory } from "@/lib/story.functions";
import { AppShell } from "@/components/app-shell";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/answer")({
  validateSearch: z.object({ mode: z.enum(["write", "voice", "photo"]).optional() }),
  head: () => ({
    meta: [
      { title: `Answer — ${brand.name}` },
      { name: "description", content: "Write down the memory in your own words." },
      { property: "og:title", content: `Answer — ${brand.name}` },
      { property: "og:description", content: "Write down the memory in your own words." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnswerPage,
});

function AnswerPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchQuestion = useServerFn(getCurrentQuestion);
  const save = useServerFn(saveMemory);

  const { data: question, isLoading } = useQuery({
    queryKey: ["current-question"],
    queryFn: () => fetchQuestion(),
  });

  const [text, setText] = useState("");
  const [year, setYear] = useState("");
  const [people, setPeople] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          userQuestionId: question?.userQuestionId ?? null,
          questionId: question?.questionId ?? null,
          questionText: question?.text ?? null,
          text: text.trim(),
          source: "write",
          memoryDateType: year ? "approximate_year" : "unknown",
          approximateYear: year ? Number(year) : null,
          topics: question?.category ? [question.category] : [],
          peopleNames: people
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Saved. That one's kept.");
      navigate({ to: "/story" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save that."),
  });

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <AppShell>
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div>
          <h1 className="font-display text-2xl leading-snug">
            {question?.text ?? "Tell a memory"}
          </h1>

          <div className="mt-6 space-y-2">
            <Label htmlFor="memory" className="sr-only">
              Your memory
            </Label>
            <Textarea
              id="memory"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start anywhere. A smell, a sound, who was in the room…"
              className="min-h-[280px] resize-y bg-paper text-lg leading-relaxed"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              {words === 0 ? "Two or three sentences is plenty." : `${words} words`}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Roughly what year?</Label>
              <Input
                id="year"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="Not sure is fine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="people">Who was there?</Label>
              <Input
                id="people"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="Mum, Dad, Aunt Rose"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={() => navigate({ to: "/today" })}>
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!text.trim() || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Saving…" : "Keep this memory"}
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            We keep your words as you wrote them. Nothing is invented or added.
          </p>
        </div>
      )}
    </AppShell>
  );
}
