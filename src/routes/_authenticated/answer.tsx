import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  getCurrentQuestion,
  saveMemory,
  attachRecording,
  attachPhoto,
  uploadMemoryPhoto,
  setMemoryVersion,
  saveFollowUp,
} from "@/lib/story.functions";
import { transcribeRecording, enrichSavedMemory } from "@/lib/ai.functions";
import { AppShell } from "@/components/app-shell";
import { VoiceRecorder } from "@/components/voice-recorder";
import { blobToBase64 } from "@/lib/media";
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
      { name: "description", content: "Tell this memory by voice, in writing, or from a photo." },
      { property: "og:title", content: `Answer — ${brand.name}` },
      {
        property: "og:description",
        content: "Tell this memory by voice, in writing, or from a photo.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnswerPage,
});

type Enrichment = {
  polished: string;
  title: string | null;
  people: string[];
  places: string[];
  followUp: string | null;
};

function AnswerPage() {
  const { mode = "write" } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchQuestion = useServerFn(getCurrentQuestion);
  const save = useServerFn(saveMemory);
  const transcribe = useServerFn(transcribeRecording);
  const enrich = useServerFn(enrichSavedMemory);
  const linkRecording = useServerFn(attachRecording);
  const linkPhoto = useServerFn(attachPhoto);
  const uploadPhoto = useServerFn(uploadMemoryPhoto);
  const chooseVersion = useServerFn(setMemoryVersion);
  const keepFollowUp = useServerFn(saveFollowUp);

  const { data: question, isLoading } = useQuery({
    queryKey: ["current-question"],
    queryFn: () => fetchQuestion(),
  });

  const [text, setText] = useState("");
  const [year, setYear] = useState("");
  const [people, setPeople] = useState("");
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [savedMemoryId, setSavedMemoryId] = useState<string | null>(null);
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [polishedDraft, setPolishedDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const transcribeMutation = useMutation({
    mutationFn: async (payload: { blob: Blob; mimeType: string; duration: number }) => {
      const audioBase64 = await blobToBase64(payload.blob);
      return transcribe({
        data: {
          audioBase64,
          mimeType: payload.mimeType,
          durationSeconds: payload.duration,
        },
      });
    },
    onSuccess: (result) => {
      setRecordingId(result.recordingId);
      if (result.transcript) {
        setText((current) => (current ? `${current}\n\n${result.transcript}` : result.transcript));
        toast.success("Transcribed. Edit anything that came out wrong.");
      } else {
        toast.error(
          result.transcriptionError ??
            "We kept your recording, but couldn't transcribe it. You can type it instead.",
        );
      }
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "We couldn't upload that recording."),
  });

  const photoMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileBase64 = await blobToBase64(file);
      return uploadPhoto({ data: { fileBase64, mimeType: file.type || "image/jpeg" } });
    },
    onSuccess: (result) => {
      setPhotoId(result.photoId);
      toast.success("Photo kept. Now tell us about it.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "We couldn't upload that photo."),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const result = await save({
        data: {
          userQuestionId: question?.userQuestionId ?? null,
          questionId: question?.questionId ?? null,
          questionText: question?.text ?? null,
          text: text.trim(),
          source: mode,
          memoryDateType: year ? "approximate_year" : "unknown",
          approximateYear: year ? Number(year) : null,
          topics: question?.category ? [question.category] : [],
          peopleNames: people
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean),
        },
      });
      if (recordingId) {
        await linkRecording({ data: { recordingId, memoryId: result.memoryId } });
      }
      if (photoId) {
        await linkPhoto({ data: { photoId, memoryId: result.memoryId } });
      }
      return result;
    },
    onSuccess: async (result) => {
      setSavedMemoryId(result.memoryId);
      await queryClient.invalidateQueries();
      toast.success(
        `Memory preserved. You now have ${result.memoryCount} ${
          result.memoryCount === 1 ? "memory" : "memories"
        }.`,
      );
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save that."),
  });

  const enrichMutation = useMutation({
    mutationFn: () => enrich({ data: { memoryId: savedMemoryId! } }),
    onSuccess: (result) => {
      setEnrichment(result as Enrichment);
      setPolishedDraft(result.polished);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "The AI pass didn't work — your words are safe."),
  });

  const versionMutation = useMutation({
    mutationFn: (usePolished: boolean) =>
      chooseVersion({
        data: {
          memoryId: savedMemoryId!,
          usePolished,
          editedPolishedText: usePolished ? polishedDraft : null,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success("Saved the version you chose.");
    },
  });

  const followUpMutation = useMutation({
    mutationFn: (answerNow: boolean) =>
      keepFollowUp({ data: { text: enrichment!.followUp!, answerNow } }),
    onSuccess: async (_result, answerNow) => {
      await queryClient.invalidateQueries();
      if (answerNow) {
        setSavedMemoryId(null);
        setEnrichment(null);
        setText("");
        setYear("");
        setPeople("");
        setRecordingId(null);
        setPhotoId(null);
        setPhotoPreview(null);
        navigate({ to: "/answer", search: { mode: "write" } });
      } else {
        toast("Saved for another day.");
        navigate({ to: "/story" });
      }
    },
  });

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  if (savedMemoryId) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl leading-snug">Memory preserved.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your original words — and your recording, if you made one — are kept exactly as they are.
        </p>

        {!enrichment ? (
          <div className="mt-8 space-y-3">
            <Button
              className="w-full"
              disabled={enrichMutation.isPending}
              onClick={() => enrichMutation.mutate()}
            >
              {enrichMutation.isPending ? "Reading it back…" : "Tidy up the punctuation for me"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/story" })}>
              Keep it exactly as I said it
            </Button>
            <p className="text-xs text-muted-foreground">
              Tidying only fixes punctuation and filler words. Nothing is added, invented or
              reworded away from your voice.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="polished">Tidied version</Label>
              <Textarea
                id="polished"
                value={polishedDraft}
                onChange={(e) => setPolishedDraft(e.target.value)}
                className="min-h-[220px] bg-paper text-lg leading-relaxed"
              />
            </div>

            {(enrichment.people.length > 0 || enrichment.places.length > 0) && (
              <p className="text-sm text-muted-foreground">
                Noted:{" "}
                {[...enrichment.people, ...enrichment.places].join(", ")} — you can correct these
                later.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                disabled={versionMutation.isPending}
                onClick={() => versionMutation.mutate(true)}
              >
                Use the tidied version
              </Button>
              <Button
                variant="outline"
                disabled={versionMutation.isPending}
                onClick={() => versionMutation.mutate(false)}
              >
                Keep my original
              </Button>
            </div>

            {enrichment.followUp ? (
              <div className="rounded-lg border border-border bg-paper p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-ember">
                  There's another story here
                </p>
                <p className="mt-3 font-display text-xl leading-snug">{enrichment.followUp}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    disabled={followUpMutation.isPending}
                    onClick={() => followUpMutation.mutate(true)}
                  >
                    Answer now
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={followUpMutation.isPending}
                    onClick={() => followUpMutation.mutate(false)}
                  >
                    Save for later
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" onClick={() => navigate({ to: "/story" })}>
                Read your story
              </Button>
            )}
          </div>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell>
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div>
          <h1 className="font-display text-2xl leading-snug">
            {question?.text ?? "Tell a memory"}
          </h1>

          <div className="mt-6 flex gap-2">
            {(["write", "voice", "photo"] as const).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mode === m ? "default" : "outline"}
                onClick={() => navigate({ to: "/answer", search: { mode: m } })}
              >
                {m === "write" ? "Write" : m === "voice" ? "Speak" : "Photo"}
              </Button>
            ))}
          </div>

          {mode === "voice" && (
            <div className="mt-6 space-y-3">
              <VoiceRecorder
                disabled={transcribeMutation.isPending}
                onReset={() => setRecordingId(null)}
                onRecorded={(blob, mimeType, duration) =>
                  transcribeMutation.mutate({ blob, mimeType, duration })
                }
              />
              {transcribeMutation.isPending && (
                <p className="text-sm text-muted-foreground">
                  Keeping the recording and writing it down…
                </p>
              )}
            </div>
          )}

          {mode === "photo" && (
            <div className="mt-6 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPhotoPreview(URL.createObjectURL(file));
                  photoMutation.mutate(file);
                }}
              />
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="The photo you're telling us about"
                  className="w-full rounded-lg border border-border object-cover"
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={photoMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoMutation.isPending ? "Uploading…" : "Choose a photo"}
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                Who is in it? Where was it taken? What happened just before or just after?
              </p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <Label htmlFor="memory" className="sr-only">
              Your memory
            </Label>
            <Textarea
              id="memory"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "voice"
                  ? "Your transcript will appear here — edit anything that came out wrong."
                  : "Start anywhere. A smell, a sound, who was in the room…"
              }
              className="min-h-[280px] resize-y bg-paper text-lg leading-relaxed"
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
              disabled={!text.trim() || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Saving…" : "Keep this memory"}
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
