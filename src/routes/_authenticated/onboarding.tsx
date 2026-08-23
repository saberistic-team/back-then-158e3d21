import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMe, saveOnboarding } from "@/lib/story.functions";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: `Get started — ${brand.name}` },
      { name: "description", content: "Tell us a little, then answer your first question." },
      { property: "og:title", content: `Get started — ${brand.name}` },
      {
        property: "og:description",
        content: "Tell us a little, then answer your first question.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

const TOPICS = [
  "Childhood",
  "Family",
  "Friends",
  "Relationships",
  "Adventures",
  "Career",
  "Parenthood",
  "Culture",
  "Lessons I've learned",
  "Everyday memories",
];

function Onboarding() {
  const navigate = useNavigate();
  const fetchMe = useServerFn(getMe);
  const save = useServerFn(saveOnboarding);

  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => fetchMe() });

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [location, setLocation] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    if (me?.profile?.onboarded_at) navigate({ to: "/today" });
  }, [me, navigate]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          firstName: firstName.trim(),
          birthYear: Number(birthYear),
          childhoodLocation: location.trim() || null,
          preserveTopics: topics,
        },
      }),
    onSuccess: () => navigate({ to: "/today" }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save that."),
  });

  const year = Number(birthYear);
  const canContinue =
    step === 0
      ? firstName.trim().length > 0 && year >= 1900 && year <= new Date().getFullYear()
      : true;

  return (
    <div className="mx-auto w-full max-w-md px-5 py-10">
      <p className="text-sm uppercase tracking-[0.18em] text-ember">Step {step + 1} of 2</p>

      {step === 0 && (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="font-display text-3xl">First, the basics</h1>
            <p className="mt-2 text-muted-foreground">
              Just enough to place your memories in time. Nothing is shared.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">What should we call you?</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthYear">What year were you born?</Label>
            <Input
              id="birthYear"
              inputMode="numeric"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1958"
            />
            <p className="text-xs text-muted-foreground">
              This helps us ask about the right decades.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Where did you grow up?</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Cork, Ireland"
            />
            <p className="text-xs text-muted-foreground">Optional.</p>
          </div>
          <Button className="w-full" disabled={!canContinue} onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div>
            <h1 className="font-display text-3xl">What do you most want to preserve?</h1>
            <p className="mt-2 text-muted-foreground">
              Pick a few, or none — we'll ask across your whole life either way.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = topics.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setTopics(on ? topics.filter((x) => x !== t) : [...topics, t])
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    on
                      ? "border-ember bg-ember text-ember-foreground"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? "Saving…" : "Get my first question"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
