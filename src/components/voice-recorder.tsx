import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/media";

type Props = {
  onRecorded: (blob: Blob, mimeType: string, durationSeconds: number) => void;
  onReset?: () => void;
  disabled?: boolean;
};

export function VoiceRecorder({ onRecorded, onReset, disabled }: Props) {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    };
  }, [playbackUrl]);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setPlaybackUrl(URL.createObjectURL(blob));
        setState("recorded");
        onRecorded(blob, mimeType, seconds);
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setState("recording");
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("We couldn't reach your microphone. You can write this one instead.");
    }
  }

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  function reset() {
    if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    setPlaybackUrl(null);
    setSeconds(0);
    setState("idle");
    setPlaying(false);
    onReset?.();
  }

  return (
    <div className="rounded-lg border border-border bg-paper p-6 text-center">
      {state === "idle" && (
        <>
          <Button
            size="lg"
            className="h-20 w-20 rounded-full"
            onClick={start}
            disabled={disabled}
            aria-label="Start recording"
          >
            <Mic className="size-7" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Talk as if you were telling a friend. Pauses are fine.
          </p>
        </>
      )}

      {state === "recording" && (
        <>
          <Button
            size="lg"
            variant="destructive"
            className="h-20 w-20 rounded-full"
            onClick={stop}
            aria-label="Stop recording"
          >
            <Square className="size-6" />
          </Button>
          <p className="mt-4 font-display text-2xl tabular-nums">{formatDuration(seconds)}</p>
          <p className="text-sm text-muted-foreground">Listening…</p>
        </>
      )}

      {state === "recorded" && (
        <>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label={playing ? "Pause playback" : "Play recording"}
              onClick={() => {
                if (!audioRef.current) return;
                if (playing) {
                  audioRef.current.pause();
                  setPlaying(false);
                } else {
                  void audioRef.current.play();
                  setPlaying(true);
                }
              }}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <span className="font-display text-xl tabular-nums">{formatDuration(seconds)}</span>
            <Button variant="ghost" size="icon" aria-label="Record again" onClick={reset}>
              <RotateCcw className="size-4" />
            </Button>
          </div>
          {playbackUrl && (
            <audio
              ref={audioRef}
              src={playbackUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            Your original recording is kept, always.
          </p>
        </>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}
