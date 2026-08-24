import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { decodeBase64, MAX_UPLOAD_BYTES } from "@/lib/media";

/**
 * Stores the original recording (never overwritten) and returns a raw
 * transcript. Nothing is polished here — that is a separate, optional step.
 */
export const transcribeRecording = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        audioBase64: z.string().min(1),
        mimeType: z.string().max(80).default("audio/webm"),
        durationSeconds: z.number().int().min(0).max(7200).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const bytes = decodeBase64(data.audioBase64);
    if (bytes.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error("That recording is too long to upload. Try a shorter one.");
    }

    const ext = data.mimeType.includes("mp4") ? "m4a" : data.mimeType.includes("mpeg") ? "mp3" : "webm";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("memory-audio")
      .upload(path, bytes, { contentType: data.mimeType, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { transcribeAudio } = await import("@/lib/ai.server");
    let transcript = "";
    let transcriptionError: string | null = null;
    try {
      transcript = await transcribeAudio(bytes, data.mimeType);
    } catch (error) {
      transcriptionError = error instanceof Error ? error.message : "Transcription failed.";
    }

    const { data: recording, error } = await supabase
      .from("recordings")
      .insert({
        user_id: userId,
        storage_path: path,
        raw_transcript: transcript || null,
        duration_seconds: data.durationSeconds ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return { recordingId: recording.id, transcript, transcriptionError };
  });

/**
 * Optional AI pass over a saved memory: light polish, suggested title,
 * people/places extraction and at most one follow-up question. The original
 * text is never replaced.
 */
export const enrichSavedMemory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ memoryId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: memory, error } = await supabase
      .from("memories")
      .select("id,original_text,question_text,title,approximate_year,memory_date_type")
      .eq("id", data.memoryId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!memory?.original_text) throw new Error("That memory has no text yet.");

    const { enrichMemory } = await import("@/lib/ai.server");
    const result = await enrichMemory({
      question: memory.question_text,
      text: memory.original_text,
    });

    const patch: {
      polished_text: string;
      title?: string;
      approximate_year?: number;
      memory_date_type?: string;
    } = { polished_text: result.polished };
    if (!memory.title && result.title) patch.title = result.title;
    if (!memory.approximate_year && result.approximateYear) {
      patch.approximate_year = result.approximateYear;
      if (memory.memory_date_type === "unknown") patch.memory_date_type = "approximate_year";
    }
    await supabase.from("memories").update(patch).eq("id", memory.id).eq("user_id", userId);


    for (const name of result.people) {
      const { data: person } = await supabase
        .from("people")
        .upsert({ user_id: userId, name: name.trim(), confirmed: false }, { onConflict: "user_id,name" })
        .select("id")
        .single();
      if (person) {
        await supabase
          .from("memory_people")
          .upsert({ memory_id: memory.id, person_id: person.id, user_id: userId, confirmed: false });
      }
    }

    for (const place of result.places) {
      await supabase
        .from("places")
        .upsert({ user_id: userId, name: place.trim() }, { onConflict: "user_id,name" });
    }

    return {
      polished: result.polished,
      title: patch["title"] ?? memory.title ?? null,
      people: result.people,
      places: result.places,
      followUp: result.followUp,
    };
  });
