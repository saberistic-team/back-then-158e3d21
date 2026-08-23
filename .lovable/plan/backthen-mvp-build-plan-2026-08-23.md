# BackThen — MVP Build Plan

A patient biographer: one good question a week, answered by voice, writing, or photo, gradually assembled into a personal history. Mobile-first, private by default, $1/month billed $12/year.

Branding stays in a single config module (name, tagline, price copy) so "BackThen" can be renamed without touching logic.

## Build order

The full MVP (§71) is large, so it ships in four rounds. Each round leaves a working app.

### Round 1 — Foundation and the core loop
- Design system: warm, book-like, editorial typography, generous whitespace, light/dark. No dashboard chrome, no gradients, no gamification.
- Landing page: "You'll forget more than you think." hero, week 1 / 7 / 26 / 52 demonstration strip, example book spread, pricing ($1/month · $12 billed annually), START MY STORY.
- Cloud backend enabled: auth (email + Google), full schema from §32 with row-level security, private storage buckets for audio and photos.
- Onboarding (name, birth year, childhood place, what to preserve) then straight into the first question.
- Question library seeded with 100+ curated questions across the §36 categories, each with category, age range, depth, sensitivity, interview/photo suitability.
- Today screen: greeting, this week's question, Voice / Write / Photo / Skip.
- Written answers: large plain writing area, draft save, submit, "Memory preserved. You now have N memories."
- Skip flow with optional reason, no guilt copy, no streaks.

### Round 2 — Voice, AI, and media
- Voice recording (mobile-friendly, accessible controls), original audio stored privately and never overwritten.
- Server-side AI functions, each modular: transcribe, polish, suggest title, extract entities, generate follow-up, select weekly question.
- Truthfulness rules enforced in every prompt: never invent facts, dialogue, dates, or feelings; preserve uncertainty and the user's voice. Original text and raw transcript always retained alongside any polished version.
- Post-answer choices: Keep original / Polish; Edit / Use transcript / Keep both.
- Occasional single follow-up question ("There's another story here") with Answer now / Save for later.
- Photo upload as an answer and as a memory trigger (who, where, what happened just before or after).

### Round 3 — The archive
- My Story: memory list, memory detail page (title, date/age, people, places, audio, photos, original + polished).
- Timeline supporting exact date, year, approximate year, age, life period, unknown.
- People: AI-detected, user-confirmed; per-person page with their memories.
- Search across memories, built so semantic search can replace it later.
- Story stats and gentle coverage indicators worded as "how much we've heard", never life completeness.
- Empty states per §63.

### Round 4 — Money, delivery, trust, admin
- Stripe subscription at $12/year with server-verified status; free first questions before the paywall, so value lands before payment.
- Weekly email delivery with day and time preference, deep link straight into the answer screen.
- Export: PDF, text, Markdown, JSON, photos, audio, transcripts.
- Privacy centre with working controls: export, delete memory / recording / photo, delete account.
- Sensitive-topic preferences that actually filter question selection.
- Admin: question library CRUD with all metadata fields, aggregate metrics, no casual browsing of private memories.
- Demo/seed mode: a fictional user with ~30 memories, people, places, chapters, transcripts, a book preview and a contribution, plus dev tools to trigger a weekly question and adjust subscription state.

Sections 21–27 and 39–54 (contribution links, Stories About Me, family interviews, chapters, book generation, sharing, gifting) are phase two; the schema in this plan already reserves their tables so they drop in without migration churn.

## Technical notes
- TanStack Start with file-based routes; public marketing routes SSR'd with their own metadata, the whole signed-in app under a protected layout.
- All data access through server functions; AI keys and Stripe secrets never reach the browser; user identity always derived server-side.
- Media in private buckets, served through short-lived signed URLs.
- Question selection is a scored query over the curated library (age fit, category coverage, sensitivity filters, recency, saved questions) with AI only ranking among eligible candidates — never generating questions from nothing.
- Payments use Lovable's built-in Stripe integration; a subscription record mirrors Stripe state via a signature-verified webhook.
- Book data model is defined now (generated_books with configuration and per-paragraph provenance to source memories) even though generation ships in phase two.

## First step after approval
Enable the backend, then confirm the Stripe setup with you before creating the $12/year product.
