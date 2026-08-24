import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { decodeBase64, MAX_UPLOAD_BYTES } from "@/lib/media";
import { LIFE_STAGE_BY_TOPIC, TOPIC_TO_CATEGORY } from "@/lib/question-topics";

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const { count: memoryCount } = await supabase
      .from("memories")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status,current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    return {
      profile,
      memoryCount: memoryCount ?? 0,
      subscription: subscription ?? null,
    };
  });

const onboardingSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  birthYear: z.number().int().min(1900).max(new Date().getFullYear()),
  birthDate: z.string().trim().min(1).max(10).nullable().optional(),
  childhoodLocation: z.string().trim().max(140).nullable().optional(),
  preserveTopics: z.array(z.string().max(60)).max(20),
});

export const saveOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => onboardingSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: userId,
        first_name: data.firstName,
        birth_year: data.birthYear,
        birth_date: data.birthDate || null,
        childhood_location: data.childhoodLocation || null,
        preserve_topics: data.preserveTopics,
        onboarded_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updatePreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        deliveryDay: z.enum(["sunday", "monday", "friday", "saturday"]).optional(),
        deliveryTime: z.enum(["morning", "afternoon", "evening"]).optional(),
        avoidTopics: z.array(z.string().max(40)).max(20).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: {
      delivery_day?: string;
      delivery_time?: string;
      avoid_topics?: string[];
    } = {};
    if (data.deliveryDay) patch.delivery_day = data.deliveryDay;
    if (data.deliveryTime) patch.delivery_time = data.deliveryTime;
    if (data.avoidTopics) patch.avoid_topics = data.avoidTopics;
    const { error } = await supabase.from("profiles").update(patch).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Returns the person's current open question, choosing a new one from the
 * curated library when none is open. Selection is a scored query over the
 * library — questions are never generated from nothing.
 */
export const getCurrentQuestion = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: open } = await supabase
      .from("user_questions")
      .select("id,question_id,custom_question_text,status,source,scheduled_for")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("scheduled_for", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (open) {
      const { data: q } = open.question_id
        ? await supabase.from("questions").select("*").eq("id", open.question_id).maybeSingle()
        : { data: null };
      return {
        userQuestionId: open.id,
        questionId: open.question_id,
        text: open.custom_question_text ?? q?.question_text ?? "",
        category: q?.category ?? null,
        goodForPhoto: q?.good_for_photo ?? false,
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("preserve_topics,avoid_topics,birth_year")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: used } = await supabase
      .from("user_questions")
      .select("question_id")
      .eq("user_id", userId);
    const usedIds = (used ?? []).map((r) => r.question_id).filter(Boolean) as string[];

    let query = supabase.from("questions").select("*").eq("active", true);
    if (usedIds.length > 0) query = query.not("id", "in", `(${usedIds.join(",")})`);
    const { data: pool } = await query.limit(500);
    if (!pool || pool.length === 0) return null;

    const preserve = profile?.preserve_topics ?? [];
    const avoid = profile?.avoid_topics ?? [];
    const wantedCategories = new Set(
      preserve.flatMap((t: string) => TOPIC_TO_CATEGORY[t] ?? []),
    );
    const wantedStages = new Set(preserve.flatMap((t: string) => LIFE_STAGE_BY_TOPIC[t] ?? []));

    const { data: answered } = await supabase
      .from("memories")
      .select("topics")
      .eq("user_id", userId)
      .limit(500);
    const heardCategories = new Map<string, number>();
    for (const m of answered ?? []) {
      for (const t of (m.topics as string[] | null) ?? []) {
        heardCategories.set(t, (heardCategories.get(t) ?? 0) + 1);
      }
    }

    const scored = pool
      .filter((q) => {
        const topics = (q.sensitive_topics as string[] | null) ?? [];
        return !topics.some((t) => avoid.includes(t));
      })
      .map((q) => {
        let score = 0;
        if (preserve.includes("Everything") || wantedCategories.has(q.category)) score += 4;
        if (wantedStages.has(q.life_stage ?? "")) score += 2;
        if (q.depth === "light") score += 1;
        score -= Math.min(3, heardCategories.get(q.category) ?? 0);
        score -= (q.sensitivity_level ?? 0) * 2;
        score += Math.random() * 2;
        return { q, score };
      })
      .sort((a, b) => b.score - a.score);

    const chosen = scored[0]?.q;
    if (!chosen) return null;

    const { data: inserted, error } = await supabase
      .from("user_questions")
      .insert({
        user_id: userId,
        question_id: chosen.id,
        status: "active",
        source: "weekly",
        scheduled_for: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return {
      userQuestionId: inserted.id,
      questionId: chosen.id,
      text: chosen.question_text,
      category: chosen.category,
      goodForPhoto: chosen.good_for_photo,
    };
  });

export const skipQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        userQuestionId: z.string().uuid(),
        reason: z
          .enum(["not_applicable", "dont_remember", "too_personal", "not_interested", "later"])
          .nullable()
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const status = data.reason === "later" ? "saved_for_later" : "skipped";
    const { error } = await supabase
      .from("user_questions")
      .update({ status, skipped_reason: data.reason ?? null })
      .eq("id", data.userQuestionId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const answerSchema = z.object({
  userQuestionId: z.string().uuid().nullable().optional(),
  questionId: z.string().uuid().nullable().optional(),
  questionText: z.string().max(400).nullable().optional(),
  title: z.string().trim().max(120).nullable().optional(),
  text: z.string().trim().min(1).max(20000),
  source: z.enum(["write", "voice", "photo", "capture"]).default("write"),
  memoryDateType: z
    .enum(["exact", "year", "approximate_year", "age", "life_period", "unknown"])
    .default("unknown"),
  memoryDate: z.string().nullable().optional(),
  approximateYear: z.number().int().min(1900).max(2100).nullable().optional(),
  approximateAge: z.number().int().min(0).max(120).nullable().optional(),
  lifePeriod: z.string().max(60).nullable().optional(),
  topics: z.array(z.string().max(60)).max(10).default([]),
  peopleNames: z.array(z.string().trim().max(80)).max(20).default([]),
});

export const saveMemory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => answerSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: memory, error } = await supabase
      .from("memories")
      .insert({
        user_id: userId,
        question_id: data.questionId ?? null,
        question_text: data.questionText ?? null,
        title: data.title || null,
        original_text: data.text,
        source: data.source,
        memory_date_type: data.memoryDateType,
        memory_date: data.memoryDate || null,
        approximate_year: data.approximateYear ?? null,
        approximate_age: data.approximateAge ?? null,
        life_period: data.lifePeriod || null,
        topics: data.topics,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    if (data.userQuestionId) {
      await supabase
        .from("user_questions")
        .update({ status: "answered", answered_memory_id: memory.id })
        .eq("id", data.userQuestionId)
        .eq("user_id", userId);
    }

    for (const rawName of data.peopleNames) {
      const name = rawName.trim();
      if (!name) continue;
      const { data: person } = await supabase
        .from("people")
        .upsert({ user_id: userId, name, confirmed: true }, { onConflict: "user_id,name" })
        .select("id")
        .single();
      if (person) {
        await supabase
          .from("memory_people")
          .upsert({ memory_id: memory.id, person_id: person.id, user_id: userId, confirmed: true });
      }
    }

    const { count } = await supabase
      .from("memories")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    return { memoryId: memory.id, memoryCount: count ?? 1 };
  });

export const listMemories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("memories")
      .select(
        "id,title,question_text,original_text,polished_text,use_polished,approximate_year,approximate_age,life_period,source,created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMemory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: memory, error } = await supabase
      .from("memories")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return memory;
  });

/**
 * Records the person's choice after an optional AI pass. The original text is
 * always kept; `use_polished` only decides what we show by default.
 */
export const setMemoryVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        memoryId: z.string().uuid(),
        usePolished: z.boolean(),
        editedPolishedText: z.string().max(20000).nullable().optional(),
        title: z.string().trim().max(120).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const patch: { use_polished: boolean; polished_text?: string; title?: string } = {
      use_polished: data.usePolished,
    };
    if (data.editedPolishedText) patch.polished_text = data.editedPolishedText;
    if (data.title) patch.title = data.title;
    const { error } = await supabase
      .from("memories")
      .update(patch)
      .eq("id", data.memoryId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const attachRecording = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ recordingId: z.string().uuid(), memoryId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("recordings")
      .update({ memory_id: data.memoryId })
      .eq("id", data.recordingId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Saves a follow-up question so it can be answered now or later. */
export const saveFollowUp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        text: z.string().trim().min(1).max(300),
        answerNow: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: inserted, error } = await supabase
      .from("user_questions")
      .insert({
        user_id: userId,
        custom_question_text: data.text,
        status: data.answerNow ? "active" : "saved_for_later",
        source: "followup",
        scheduled_for: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { userQuestionId: inserted.id };
  });

export const uploadMemoryPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        fileBase64: z.string().min(1),
        mimeType: z.string().max(80),
        memoryId: z.string().uuid().nullable().optional(),
        caption: z.string().trim().max(300).nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const bytes = decodeBase64(data.fileBase64);
    if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("That photo is too large.");
    const ext = data.mimeType.includes("png") ? "png" : data.mimeType.includes("webp") ? "webp" : "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("memory-photos")
      .upload(path, bytes, { contentType: data.mimeType, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: photo, error } = await supabase
      .from("memory_photos")
      .insert({
        user_id: userId,
        storage_path: path,
        memory_id: data.memoryId ?? null,
        caption: data.caption || null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { photoId: photo.id, storagePath: path };
  });

export const attachPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ photoId: z.string().uuid(), memoryId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("memory_photos")
      .update({ memory_id: data.memoryId })
      .eq("id", data.photoId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Short-lived signed URLs for private media on a memory. */
export const getMemoryMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ memoryId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const [{ data: recordings }, { data: photos }] = await Promise.all([
      supabase
        .from("recordings")
        .select("id,storage_path,duration_seconds,raw_transcript")
        .eq("memory_id", data.memoryId)
        .eq("user_id", userId),
      supabase
        .from("memory_photos")
        .select("id,storage_path,caption")
        .eq("memory_id", data.memoryId)
        .eq("user_id", userId),
    ]);

    const audio = await Promise.all(
      (recordings ?? []).map(async (r) => {
        const { data: signed } = await supabase.storage
          .from("memory-audio")
          .createSignedUrl(r.storage_path, 3600);
        return { id: r.id, url: signed?.signedUrl ?? null, durationSeconds: r.duration_seconds };
      }),
    );

    const images = await Promise.all(
      (photos ?? []).map(async (p) => {
        const { data: signed } = await supabase.storage
          .from("memory-photos")
          .createSignedUrl(p.storage_path, 3600);
        return { id: p.id, url: signed?.signedUrl ?? null, caption: p.caption };
      }),
    );

    return { audio, images };
  });
