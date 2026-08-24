# Your Story Captured

# Build a Web App That Writes Your Life Story One Question at a Time




Build a production-quality, mobile-first web application tentatively called **BackThen**.




The name must be easy to replace later, so do not tightly couple branding to application logic.




The core promise is:




> **You'll forget more than you think.**

>

> We ask you one good question every week.

>

> You answer.

>

> Over time, it becomes the story of your life.

>

> **$1/month.**




This is **not a journaling app**.




Users should never face a blank page asking, “What's on your mind?”




The product acts as a thoughtful interviewer that asks specific questions designed to retrieve memories.




The application gradually transforms hundreds of small answers into an organized personal history.




---




# 1. PRODUCT PHILOSOPHY




The fundamental loop is:




**QUESTION → REMEMBER → ANSWER → PRESERVE**




Once per week, the user receives one thoughtful question.




Example:




> ## This week's question

>

> What food did your family always have at home when you were growing up?

>

> **Answer with**

>

> 🎙 Voice

> ✍️ Write

> 📷 Photo




The interaction should take anywhere from 30 seconds to 10 minutes.




After answering:




> **Memory preserved.**

>

> You now have **37 memories** in your story.




Then show:




**Next question arrives Sunday.**




Do not overwhelm users with dozens of prompts.




Scarcity is part of the experience.




One good question is more valuable than a database of 10,000 prompts.




---




# 2. THE PRODUCT IS NOT A JOURNAL




Avoid traditional journaling language.




Do NOT prominently use:




* journal

* diary

* daily journal

* mood tracker

* habit tracker




Instead use:




* stories

* memories

* questions

* chapters

* people

* places

* moments

* your story




The product should feel like someone interviewing you for an autobiography.




---




# 3. WHAT MAKES A GOOD QUESTION




Questions must be concrete, conversational and capable of triggering specific memories.




BAD:




> Describe your childhood.




GOOD:




> What did your childhood bedroom look like?




BAD:




> Tell us about your family.




GOOD:




> Who was the funniest person in your family growing up?




BAD:




> What are your thoughts about money?




GOOD:




> What's the first thing you remember buying with money you earned yourself?




Other examples:




> What food did you think every family ate when you were growing up?




> What did your parents repeatedly tell you as a child?




> What was your first car?




> What happened the first time you drove alone?




> Who was your best friend when you were 10?




> Where did you usually go when you wanted to get out of the house as a teenager?




> What was considered expensive when you were growing up?




> What's a smell that instantly takes you somewhere else?




> What piece of clothing did you wear constantly?




> Who was your first crush?




> What was your first job?




> What's something your grandparents did that people rarely do anymore?




> What was the first computer you remember using?




> What did your family usually do on weekends?




> What was your favorite place to hide as a child?




Questions should make users think:




**“Oh wow. I haven't thought about that in years.”**




That reaction is the heart of the product.




---




# 4. LANDING PAGE




Keep the landing page extremely simple.




Hero:




# You'll forget more than you think.




**One good question every week.**




Answer it.




Over time, we'll help you turn those memories into the story of your life.




### [ START MY STORY ]




**$1/month · billed $12/year**




Below the hero, demonstrate the concept visually.




---




### Week 1




**What did your childhood bedroom look like?**




→ Memory preserved




### Week 7




**What was your first job?**




→ Memory preserved




### Week 26




**Who changed the direction of your life?**




→ Memory preserved




### Week 52




# 52 memories.




**Your story is already taking shape.**




Then show a beautiful example digital book.




**Your Life**




52 memories

18 people

9 places

14 photographs

43 minutes of voice




### [ START MY STORY ]




---




# 5. PRICING




Keep pricing intentionally simple.




Display it as:




# $1/month




Small text:




**$12 billed annually**




Do not charge $1 through Stripe every month because fixed payment processing costs make this inefficient.




Use Stripe annual subscriptions at $12/year.




Consider a free trial experience where the user can answer their first few questions before payment.




Recommended flow:




1. Landing page

2. Start My Story

3. Create account

4. Answer first question

5. See their first preserved memory

6. Answer several starter questions if desired

7. Ask them to subscribe to continue receiving weekly questions




The user should experience the emotional value before being asked to pay.




---




# 6. ONBOARDING




Onboarding should take approximately 60 seconds.




Ask only what improves the experience.




### Step 1




**What should we call you?**




First name.




### Step 2




**When were you born?**




Year required.




Exact birthday optional.




Explain:




> This helps us ask questions appropriate to your generation.




### Step 3




**Where did you spend most of your childhood?**




Optional.




City / region / country.




### Step 4




**What would you most like to preserve?**




Allow multiple selections:




* Childhood

* Family

* Friends

* Relationships

* Adventures

* Career

* Parenthood

* Culture

* Lessons I've learned

* Everyday memories

* Everything




### Step 5




Immediately ask the first question.




Do NOT continue collecting profile information.




---




# 7. THE HOME SCREEN




The dashboard should not look like SaaS.




The primary screen should feel like opening a beautiful personal book.




At the top:




**Good evening, Amir.**




Then:




# This week's question




> What did your family usually do on Sunday mornings when you were growing up?




### [ 🎙 ANSWER WITH VOICE ]




### [ ✍️ WRITE ]




### [ 📷 ADD A PHOTO ]




Below:




**YOUR STORY**




37 memories




████████████████░░




**37 weeks remembered**




Then show recent memories.




---




# 8. WRITTEN ANSWERS




Writing should be extremely simple.




Question displayed prominently.




Large writing area.




Do not show excessive formatting controls.




Allow:




* plain text

* save draft

* submit

* add photo

* add approximate date

* tag people




After submission, show:




# Memory preserved.




Then provide optional AI assistance:




**Want me to lightly clean this up while keeping it sounding like you?**




[ KEEP ORIGINAL ]




[ POLISH ]




Never automatically rewrite someone's memories without permission.




Always preserve the original.




---




# 9. VOICE ANSWERS




Voice should be a first-class experience.




The user taps:




**🎙 Answer with voice**




Then sees:




# Tell me the story.




00:00




### ● RECORDING




They talk naturally.




After recording:




1. upload audio

2. securely store original recording

3. transcribe it

4. generate a lightly edited readable version

5. preserve the raw transcript

6. preserve the audio

7. show the user the result




Example:




### Original Recording




▶ 03:42




### Your Story




> My first car was an old Honda Accord. My dad bought it from someone he knew...




Allow:




**Edit**




**Use transcript instead**




**Keep both**




The user's original audio should never be destroyed by AI processing.




---




# 10. AI AS AN INTERVIEWER




This is one of the most important features.




AI should not primarily be a writing generator.




AI should behave like an excellent biographical interviewer.




Suppose the user says:




> My dad bought me an old Honda Accord when I was seventeen.




The system might ask:




> **You mentioned your dad bought the car. What do you remember about the day he gave it to you?**




Or:




> **Where did you drive the first time you took it out alone?**




These are **follow-up questions**.




After preserving a memory, occasionally show:




### There's another story here.




> What do you remember about the day your dad gave you the car?




[ ANSWER NOW ]




[ SAVE FOR LATER ]




Do not endlessly interrogate users.




Usually offer no more than 1–2 follow-up questions.




---




# 11. AI SAFETY / TRUTHFULNESS PRINCIPLE




The AI must NEVER invent biographical facts.




This is critical.




When transforming memories:




* preserve facts

* preserve uncertainty

* preserve names

* preserve chronology when known

* preserve the user's tone

* remove filler words when requested

* improve readability when requested




If someone says:




> “I think I was around eleven.”




Do not change it to:




> “When I was eleven.”




Preserve:




> “I think I was around eleven.”




The application organizes a person's memories.




It does not manufacture their autobiography.




---




# 12. MEMORY STRUCTURE




Every answer becomes a **Memory**.




A Memory should support:




* title

* original question

* written answer

* polished answer

* raw transcript

* audio

* photos

* approximate date

* user's age at the time

* people mentioned

* places mentioned

* topics

* chapter/category

* created date

* follow-up memories

* privacy status




Example:




# My First Car




**Around 2005 · Age ~17**




🚗 First Car

👨 Dad

📍 New Jersey




> My first car was...




🎙 3:42 original recording




---




# 13. MEMORY TIMELINE




Create:




# My Life




Display memories chronologically when dates can be estimated.




Example:




**1994**




Starting school




↓




**1997**




The house on Oak Street




↓




**2002**




My best friend Mike




↓




**2005**




My first car




↓




**2008**




Leaving home




↓




**2014**




My first real career opportunity




Do not force every memory to have an exact date.




Support:




* exact date

* year

* approximate year

* age

* life period

* unknown




---




# 14. PEOPLE




Automatically detect people mentioned repeatedly, but require user confirmation before permanently creating relationships.




Create:




# People In My Story




Example:




### Dad




23 memories




### Mom




31 memories




### Michael




17 memories




### Sarah




8 memories




Selecting someone opens:




# Dad




**23 memories together**




Then show memories involving that person chronologically.




AI can detect gaps.




Example:




> You've mentioned your dad in 23 stories, but you've never described what he was like when you were young.




### Ask me about Dad →




This should generate an appropriate future question.




---




# 15. PLACES




Create:




# Places In My Story




Examples:




**Tehran**

17 memories




**New Jersey**

31 memories




**Austin**

12 memories




**Grandma's House**

8 memories




A place doesn't have to be geographically precise.




Users may create personal locations such as:




* Grandma's kitchen

* childhood home

* summer cabin

* old office

* school playground




---




# 16. LIFE MAP




As memories accumulate, privately organize them into areas.




Example:




# Your Story So Far




Childhood

████████░░




Family

███████░░░




School

█████████░




Friendships

████░░░░░░




Career

███████░░░




Relationships

█████░░░░░




Travel

███░░░░░░░




Beliefs

████░░░░░░




Everyday Life

██░░░░░░░░




Do NOT imply that someone's life is actually “40% complete.”




These indicators represent **how much the application has heard about each topic**, not completeness of their life.




Use wording such as:




> **We've heard lots about your career, but not much about your teenage years yet.**




Then use that information when selecting future questions.




---




# 17. PERSONALIZED WEEKLY QUESTIONS




Initially, questions can come from a curated question library.




As more memories accumulate, personalize question selection.




Consider:




* user's age

* generation

* childhood location

* existing memories

* people mentioned

* life periods with few memories

* unanswered saved questions

* topics user enjoys answering

* recently discussed memories

* repeated themes




Do not ask inappropriate questions purely because AI detects missing information.




Questions involving trauma, death, sexuality, medical history, abuse, etc. should not be unexpectedly surfaced.




Allow users to configure sensitive topics.




---




# 18. SKIPPING QUESTIONS




Users must never feel pressured.




Every question should have:




**Skip this question**




Then ask optionally:




**Why?**




* Doesn't apply to me

* Don't remember

* Too personal

* Not interested

* Ask me later




Use this information to improve future question selection.




No guilt language.




No broken streak messaging.




This isn't Duolingo.




---




# 19. NO STREAK ANXIETY




Avoid aggressive gamification.




Don't say:




**YOU LOST YOUR 47-WEEK STREAK!**




Life happens.




Instead:




> **You have 41 preserved memories.**




The value is accumulation, not perfect compliance.




Users can always return to unanswered questions.




---




# 20. PHOTOS AS MEMORY TRIGGERS




Allow users to upload old photographs.




After uploading:




# There's a story in this photo.




Ask:




**Who is here?**




Then:




**Where was this?**




Then the important question:




> **What happened immediately before or after this picture?**




The objective isn't photo storage.




The photograph triggers a story that would otherwise be lost.




---




# 21. ASK SOMEONE ELSE




Build an important viral feature:




# Ask Someone Who Was There




Suppose the user's memory involves their brother.




Offer:




> **Want to hear how your brother remembers it?**




The user can generate a private contribution link.




Recipient sees:




> **Amir is collecting stories from his life.**




> What was Amir like when you were kids?




No account required.




They can:




🎙 Record

✍️ Write

📷 Add photo




After submitting:




> **Thanks. Your memory has been sent to Amir.**




Then softly introduce:




> **Everyone has stories worth keeping.**




**Start yours →**




Never automatically expose the owner's existing private memories to contributors.




---




# 22. STORIES ABOUT ME




Create a separate section:




# Stories About Me




These are memories submitted by other people.




Example:




### From Mom




> “When Amir was six, he used to...”




### From Michael




> “The first time I met Amir...”




The owner decides whether these become part of their main story.




---




# 23. FAMILY INTERVIEWS




Create another mode:




# Capture Someone's Stories




User chooses:




**Who would you like to interview?**




Examples:




Mom

Dad

Grandparent

Partner

Friend

Someone else




Create an interview project.




Example:




# Mom's Stories




12 conversations

1h 42m audio

17 photographs

31 people mentioned




Provide weekly interview questions.




Examples:




> What was your mother like?




> What was your childhood home like?




> What did your family eat for dinner?




> What was your first job?




> How did you meet Dad?




> What did you imagine your life would be like when you were twenty?




The subscriber can record the conversation directly in the application.




---




# 24. “BEFORE IT'S LOST” EXPERIENCE




Do not make the overall product about death.




However, create an optional experience focused on capturing stories from older family members.




Use warm language such as:




# Stories worth keeping.




Not:




**Before they die.**




Allow someone to create an interview journey for a parent or grandparent.




This could eventually become one of the strongest reasons people discover the product.




---




# 25. CHAPTERS




As memories accumulate, automatically suggest chapters.




Example:




# My Story




### Where I Came From




18 memories




### Growing Up




31 memories




### Teenage Years




22 memories




### Becoming Independent




19 memories




### Work




28 memories




### People Who Changed Me




17 memories




### Love & Family




24 memories




### Places I've Called Home




12 memories




### Things I've Learned




16 memories




Users can:




* rename chapters

* move memories

* create chapters

* hide chapters

* reorder chapters




AI can suggest organization but the user remains in control.




---




# 26. CREATE MY BOOK




This is the long-term monetization feature.




Once enough memories exist, show:




# Your story is becoming a book.




### [ CREATE MY BOOK ]




AI should organize existing memories into a coherent manuscript.




Important:




AI may:




* organize

* lightly edit

* connect memories

* create chapter introductions based entirely on supplied material

* remove unnecessary repetition




AI must NOT:




* invent events

* invent dialogue

* invent dates

* invent feelings

* invent motivations

* embellish stories as fact




Generate a beautiful digital book preview.




Example:




# Stories From My Life




### Amir Sharifi




---




## Chapter One




# Where I Came From




...




---




Allow complete editing before publishing/exporting.




---




# 27. PHYSICAL BOOK




Design the architecture for future physical-book ordering.




Potential product:




**Hardcover Life Book — $49+**




User chooses:




* cover

* title

* subtitle

* photographs

* chapters

* dedication




Then sees a print preview.




Do not implement a full printing-provider integration unless needed for MVP.




Build the book data model so this can be added cleanly later.




---




# 28. EXPORT




Users own their memories.




This is extremely important for trust.




Allow exporting:




* PDF

* text

* Markdown

* JSON/data export

* photographs

* original audio

* transcripts




Never intentionally create lock-in by preventing people from retrieving their own history.




---




# 29. SEARCH




Create natural search.




Examples:




**Search your memories...**




User searches:




> Dad




> college




> Austin




> first jobs




> stories involving Michael




Eventually support semantic queries:




> What stories have I told about moving?




> What have I said about my father?




> Show memories from my twenties.




---




# 30. PRIVATE BY DEFAULT




Everything must be private by default.




A user's memories should NEVER automatically become public.




Users explicitly choose when sharing:




* individual memory

* contribution request

* generated book

* family project




Do not create a public social feed.




Do not optimize the product around public profiles.




This is a private personal archive first.




---




# 31. AUTHENTICATION




Use Supabase Auth.




Support:




* email/password or magic link

* Google authentication




Keep signup minimal.




---




# 32. DATABASE




Use Supabase/Postgres.




Design a normalized schema around entities such as:




### profiles




id

user_id

first_name

birth_year

childhood_location

created_at




### subscriptions




user_id

stripe_customer_id

stripe_subscription_id

status

current_period_start

current_period_end

created_at

updated_at




### memories




id

user_id

question_id

title

original_text

polished_text

memory_date_type

memory_date

approximate_year

approximate_age

life_period

privacy_status

created_at

updated_at




### questions




id

question_text

category

age_min

age_max

sensitivity_level

follow_up_allowed

active

created_at




### user_questions




id

user_id

question_id

scheduled_for

status

skipped_reason

answered_memory_id

created_at




Possible statuses:




* scheduled

* active

* answered

* skipped

* saved_for_later




### recordings




id

memory_id

storage_path

duration_seconds

raw_transcript

created_at




### memory_photos




id

memory_id

storage_path

caption

approximate_date

created_at




### people




id

user_id

name

relationship

notes

created_at




### memory_people




memory_id

person_id

confidence

confirmed




### places




id

user_id

name

location_text

latitude optional

longitude optional

created_at




### memory_places




memory_id

place_id

confidence

confirmed




### chapters




id

user_id

title

description

sort_order

created_at




### chapter_memories




chapter_id

memory_id

sort_order




### contribution_requests




id

owner_user_id

recipient_name

question

token

expires_at

status

created_at




### contributed_memories




id

contribution_request_id

contributor_name

text

audio_path

transcript

status

created_at




### interview_projects




id

owner_user_id

subject_name

relationship

description

created_at




### interview_memories




id

interview_project_id

question_id

memory_id

created_at




### generated_books




id

user_id

title

subtitle

status

configuration

created_at

updated_at




Use appropriate foreign keys, indexes and Row Level Security.




Users must only have access to their own private information unless a specific share/contribution token grants narrowly scoped access.




---




# 33. STORAGE




Use Supabase Storage for:




* voice recordings

* photographs

* generated book assets

* exports




Use private buckets by default.




Generate temporary signed URLs when content needs to be accessed.




Do not make user photos or recordings publicly accessible merely because the URL is known.




---




# 34. AI ARCHITECTURE




Keep AI functionality modular so providers/models can be changed later.




Create server-side functions for:




### `transcribeMemory`




Audio → transcription.




### `polishMemory`




Original answer → lightly cleaned version.




Rules:




* no invented facts

* no invented dialogue

* preserve uncertainty

* maintain first-person perspective

* retain the user's speaking style

* don't make everything sound like corporate AI prose




### `suggestMemoryTitle`




Generate concise titles such as:




**The Red Bicycle**




instead of:




**Memory About My Childhood Bicycle**




### `extractEntities`




Detect potential:




* people

* places

* time periods

* ages

* events

* themes




Treat results as suggestions until sufficiently confident or confirmed.




### `generateFollowUp`




Generate one thoughtful follow-up question grounded exclusively in information supplied by the user.




### `selectWeeklyQuestion`




Select the next question based on the user's existing story.




### `suggestChapters`




Suggest ways to organize memories.




### `assembleBook`




Organize approved memories into a manuscript.




All AI calls must happen server-side.




Never expose AI API keys to clients.




---




# 35. QUESTION ENGINE




The question engine is one of the most important pieces of the application.




Do not simply call an LLM every Sunday and ask:




> “Give this person a question.”




Maintain a curated question library.




Give each question metadata such as:




* category

* approximate age range

* generation relevance

* relationship relevance

* location relevance

* depth

* emotional intensity

* sensitivity

* whether it works as an interview question

* whether it works as a photo prompt




Then use AI/personalization to select among appropriate questions.




This preserves quality while still providing personalization.




---




# 36. STARTER QUESTION LIBRARY




Seed the application with at least **100 high-quality questions** across multiple categories.




Generate realistic examples rather than repetitive variations.




Categories should include:




### Early Childhood




* What was your childhood bedroom like?

* What toy did you carry everywhere?

* What did you usually eat for breakfast?

* Where did you play when adults weren't watching?

* What did your home sound like in the morning?




### Family




* Who made everyone laugh at family gatherings?

* What phrase did one of your parents repeat constantly?

* What meal reminds you most of your family?

* What family tradition seemed completely normal to you but unusual to others?

* Who in your family told the best stories?




### School




* Who was the first teacher you clearly remember?

* Where did you sit during lunch?

* What subject came naturally to you?

* What subject did you dread?

* What trouble did you get into at school?




### Teenage Years




* Where did you go when you wanted to get out of the house?

* What music did you listen to constantly?

* What did you think was cool that seems ridiculous now?

* What did your friends usually do together?

* What was the first party you remember?




### Firsts




* What was your first job?

* What was your first car?

* What was the first thing you bought with your own money?

* What was your first big trip without your family?

* What was the first computer or game console you used?




### People




* Who understood you particularly well growing up?

* Who taught you something you've never forgotten?

* Who intimidated you when you were young?

* Who made you laugh harder than anyone else?

* Who did you lose touch with but still think about?




### Places




* What place from childhood can you still picture perfectly?

* Where did your family go for special occasions?

* What neighborhood did you know by heart?

* What place felt like freedom to you?

* What's somewhere you wish you could visit exactly as it existed then?




### Work




* What was your first day at your first real job like?

* Who was the best boss you ever had?

* What work mistake taught you the most?

* When did you first feel genuinely competent at something?

* What job did you think you'd have when you were a child?




### Everyday Life




This category is particularly important.




Capture ordinary things people normally don't think are worth recording.




Examples:




* What was always inside your refrigerator growing up?

* What did your family keep on top of the television?

* What store did you visit all the time that no longer exists?

* What did a normal Saturday look like when you were twelve?

* What phone did you first use regularly?

* What did people do before everyone had smartphones?

* What item in your home seemed incredibly modern at the time?




These mundane memories may become some of the most interesting ones decades later.




---




# 37. WEEKLY DELIVERY




Users choose when they want their weekly question.




Default:




**Sunday morning**




Allow preferences:




* Sunday

* Monday

* Friday

* Saturday




And:




* Morning

* Afternoon

* Evening




For MVP, support email delivery.




Email example:




**Subject: A question for you**




> What did your childhood bedroom look like?

>

> You don't need to write much.

>

> **Answer this question →**




The link should authenticate or securely take the user directly into the answer experience.




Do not make users navigate through a dashboard to answer.




---




# 38. HOME EXPERIENCE AFTER ANSWERING




Don't leave the homepage empty after the weekly question has been answered.




Instead show:




# Memory #38 preserved.




**The House on Maple Street**




Then:




> Next question arrives Sunday.




Below that:




**While you're here...**




Present optional actions:




**Answer a saved question**




**Add an old photo**




**Ask someone else**




**Read a random memory**




These should be optional.




Do not undermine the core one-question-per-week philosophy.




---




# 39. “SURPRISE ME”




Create a secondary feature:




### Surprise Me




Show a random old memory.




Example:




# 2 years ago you told us...




**The first apartment**




> “I remember walking into it and thinking...”




This gives users a reason to revisit the app beyond answering questions.




It also demonstrates that their archive is becoming more valuable.




---




# 40. “ON THIS DAY”




When enough dated memories exist, support:




### On This Day




or:




### Around this time...




For example:




> You said you moved to Austin around this time in 2018.




Then show the associated memory.




Do not fabricate exact anniversaries when the memory only has approximate dates.




---




# 41. MEMORY CONNECTIONS




Memories should gradually form a graph.




If two memories involve the same:




* person

* location

* time period

* event

* topic




show subtle relationships.




Example:




At the bottom of:




# My First Car




show:




**Related memories**




→ Dad Teaching Me to Drive

→ The Road Trip to Colorado

→ Selling the Honda




This makes the archive feel alive rather than like a folder of journal entries.




---




# 42. FOLLOW THE THREAD




Create an optional feature:




### Follow this story




If a memory contains an interesting unresolved thread, allow a user to explore it.




Example:




The user says:




> My grandmother owned a little grocery store.




Then suggest:




**What was your grandmother's store like inside?**




After that answer:




**Who usually came into the store?**




After that:




**Did you ever work there with her?**




This can create a chain of connected memories.




Do not automatically create dozens of questions.




The user controls whether to follow the thread.




---




# 43. MEMORY INBOX




Sometimes users suddenly remember something unrelated to the weekly question.




Provide a small:




### + Capture a memory




button.




Instead of presenting a blank journal, ask:




> **What happened?**




Then allow text/voice/photo.




Afterward, AI can ask:




> When was this approximately?




> Who was there?




Keep this lightweight.




Weekly questions remain the primary habit.




---




# 44. SEARCH EXPERIENCE




Prominently provide:




**Search your life...**




Search can initially use full-text search.




Structure the architecture so semantic/vector search can later support natural language.




Examples:




> memories about my dad




> when I lived in Texas




> my first jobs




> stories from college




> things involving Sarah




> cars I've owned




Return beautiful memory results, not database-looking rows.




---




# 45. STORY STATS




Provide gentle accumulation statistics.




Examples:




# Your Story




**137 memories**




**19 hours of stories preserved**




**83 photographs**




**41 people**




**12 places**




**17 years represented**




Avoid meaningless gamification such as XP.




Statistics should reinforce:




> Look at everything you've preserved.




Not:




> Beat other users.




There are no public leaderboards.




---




# 46. PRIVACY CENTER




Because this application stores deeply personal information, trust should be visible.




Create a clear Privacy area.




Explain in plain language:




**Your memories are private.**




**We don't sell your stories.**




**Nothing becomes public unless you explicitly share it.**




**You can export your memories.**




**You can delete your account and data.**




Implement actual controls for:




* export

* delete memory

* delete recording

* delete photograph

* revoke contribution links

* delete account




Do not merely write privacy claims that the application architecture doesn't honor.




---




# 47. SENSITIVE CONTENT




People's autobiographical memories may include deeply personal material.




Provide:




**Sensitive topics**




preferences.




Allow users to avoid prompts involving areas such as:




* grief

* relationships

* family conflict

* health

* finances

* religion

* sexuality

* traumatic events




Default curated weekly questions toward broadly safe subjects.




Never surprise someone with:




> Tell us about the worst trauma of your childhood.




The app is an interviewer, not a therapist.




---




# 48. SHARING A MEMORY




Users can explicitly share one memory.




Generate a beautiful private/public share page based on their selection.




Example:




# My First Car




*Amir's story*




> My first car was...




Optional photo.




At bottom:




**Preserved with BackThen**




**Start your own story →**




Sharing is optional and off by default.




Allow link revocation.




---




# 49. CONTRIBUTION LINKS




Contribution links should be tokenized and narrowly scoped.




A contributor should only see:




* whose project they're contributing to

* the question

* answer controls




They should NOT gain access to the owner's account or other memories.




Example:




# Amir wants to remember this with you.




**What was Amir like when you first met him?**




[ WRITE ]




[ RECORD ]




No account required.




---




# 50. FAMILY PROJECTS




Architect for eventual collaborative archives.




Example:




# The Sharifi Family Stories




Contributors:




Mom

Dad

Amir

Sibling




Topics might include:




**The Old House**




Four different people can remember the same event differently.




Never merge different accounts into one “true” story.




Preserve each person's perspective.




This could eventually become a separate premium product, but don't complicate MVP pricing with it yet.




---




# 51. SUBSCRIPTION EXPERIENCE




Use Stripe.




Primary plan:




# BackThen Membership




**$12/year**




Displayed prominently as:




**$1/month**




Include:




* weekly questions

* unlimited memories

* text responses

* voice memories

* photos

* AI polish

* personalized questions

* story organization

* digital book generation

* exports




Avoid complicated pricing tiers in MVP.




Potential additional monetization later:




* printed hardcover books

* family projects

* gift memberships

* premium transcription/storage

* professionally designed books




But **do not build the MVP around upselling.**




---




# 52. GIFT MEMBERSHIP




Design the product so eventually someone can give:




# A Year of Stories




**52 questions. $12.**




Potential use cases:




* Mother's Day

* Father's Day

* grandparents

* birthdays

* newlyweds

* new parents




The recipient receives:




> Someone wants to hear your stories.




This could become a major acquisition channel later.




Do not make gifting essential for MVP.




---




# 53. BOOK GENERATION WORKFLOW




When the user selects:




### Create My Book




Show:




# Let's turn your memories into a story.




Step 1:




**Choose what to include**




All memories

or selected chapters/memories.




Step 2:




**Choose organization**




Chronological

By chapter

AI suggested




Step 3:




**Choose editing level**




### Original




Use answers almost exactly as written.




### Light polish




Clean grammar and filler while preserving voice.




### Story flow




Connect memories into a smoother narrative, without inventing information.




Step 4:




Generate preview.




Step 5:




Allow editing.




Step 6:




Export digital version.




---




# 54. AI BOOK ASSEMBLY REQUIREMENT




Always maintain provenance.




Every generated paragraph should be traceable internally to its source memories.




This will help prevent hallucinations.




When possible, structure book generation around retrieval from selected memories rather than unconstrained generation.




If facts conflict:




Memory A:




> “I moved in 2009.”




Memory B:




> “I think I moved around 2010.”




Do NOT silently pick one.




Preserve the uncertainty or flag it for the user:




> **We found two different dates for this event. Which one should we use?**




The autobiography belongs to the user.




---




# 55. ADMIN




Create a simple admin dashboard.




Admins can:




* manage curated questions

* create/edit/archive questions

* assign categories

* set sensitivity

* inspect aggregate product metrics

* view subscription counts

* manage reported technical issues

* manage email templates

* manage feature flags




Admins should **not casually browse private memories.**




Design the system around privacy.




If administrative access to user content is technically necessary for support, make it deliberately restricted and auditable.




---




# 56. ADMIN QUESTION EDITOR




Make the question library easy to maintain.




Each question should have fields:




Question:




> What did your childhood bedroom look like?




Category:




Childhood




Depth:




Light / Medium / Deep




Sensitive:




No




Ideal life stage:




Childhood




Potential follow-up themes:




* siblings sharing room

* favorite objects

* posters

* moving homes




Suitable for:




✓ Personal story

✓ Parent interview

✓ Grandparent interview




This makes the content system maintainable without code changes.




---




# 57. ANALYTICS




Track product events without capturing unnecessary sensitive content.




Useful events:




* account_created

* onboarding_completed

* first_memory_started

* first_memory_completed

* voice_memory_completed

* weekly_question_opened

* weekly_question_answered

* question_skipped

* photo_added

* contribution_link_created

* contribution_completed

* subscription_started

* subscription_cancelled

* book_generated

* export_created




Track IDs and metadata needed for product analytics.




Do not send full private memory text to third-party analytics platforms.




---




# 58. DESIGN LANGUAGE




The product should feel:




* intimate

* warm

* premium

* quiet

* nostalgic without looking old-fashioned

* contemporary

* trustworthy




Avoid:




* corporate dashboards

* excessive gradients

* gamification

* cartoon mascots

* neon AI aesthetics

* overwhelming cards everywhere

* fake handwritten fonts everywhere




Think of:




**a beautiful modern book + private photo album + thoughtful interviewer.**




Use substantial whitespace.




Typography should be central to the visual identity.




Memories should be pleasant to read.




---




# 59. VISUAL MOTIF




Use the idea of a story gradually filling in.




For example, the homepage could visualize memories as small points along a subtle lifetime line.




As the archive grows, the line becomes richer.




Do not display a countdown to death or predicted lifespan.




Never create morbid visualizations.




The point is:




**Look how much you've remembered.**




---




# 60. MOBILE-FIRST EXPERIENCE




Assume many answers will happen on phones.




Voice recording should be especially easy.




The primary weekly interaction should fit comfortably on one mobile screen:




> This week's question




QUESTION




[ 🎙 TELL THE STORY ]




[ ✍️ WRITE ]




[ SKIP ]




A user should be able to open an email, tap once, talk for three minutes, save, and leave.




That is the ideal workflow.




---




# 61. DESKTOP EXPERIENCE




Desktop should emphasize browsing and organizing memories.




Use more room for:




* timeline

* chapters

* book editing

* people

* places

* search




But do not turn desktop into an admin-style dashboard.




It should still feel like browsing a beautifully organized personal archive.




---




# 62. NAVIGATION




Keep main navigation simple:




**Today**




**My Story**




**People**




**Book**




Profile menu




Inside **My Story**, provide:




* Memories

* Timeline

* Chapters

* Places

* Stories About Me




Do not expose every secondary feature in the main nav.




---




# 63. EMPTY STATES




Empty states are critical.




When there are no memories:




# Every life starts with one story.




**Let's find yours.**




[ ANSWER YOUR FIRST QUESTION ]




When there are no People:




> People will appear here as they become part of your stories.




When there is no book yet:




> Your book grows from the stories you preserve.




**You currently have 7 memories.**




Do not pretend features are valuable before the user has supplied content.




---




# 64. FIRST SESSION




The first session should create an immediate emotional payoff.




Recommended sequence:




Landing page




↓




Start My Story




↓




Name + birth year




↓




Question:




> **What did your childhood bedroom look like?**




↓




User responds




↓




Show beautifully formatted result:




# My Childhood Bedroom




“...”




↓




# That's one memory you won't have to rely on remembering forever.




**Memory #1 preserved.**




Then:




### There's another story here.




Optional follow-up.




Only after demonstrating the product's value should the subscription proposition become prominent.




---




# 65. DEMO MODE




Create seeded demo data so the product can be evaluated immediately.




Create a fictional demo user with:




* ~30 memories

* several people

* several places

* voice transcript examples

* photos/placeholders

* chapters

* timeline

* weekly question

* book preview

* external contribution




The demo should make it easy to understand what the product becomes after a year of use.




---




# 66. DEVELOPMENT CONFIGURATION




Provide development tooling/settings allowing:




* manually trigger a weekly question

* change subscription status

* create demo memories

* simulate contribution

* run AI functions against test data

* regenerate question recommendations

* generate sample book

* bypass Stripe in local/demo mode




Keep production behavior secure.




---




# 67. RESPONSIVENESS AND ACCESSIBILITY




Meet good accessibility standards.




Requirements include:




* keyboard navigation

* sufficient contrast

* form labels

* accessible recording controls

* screen-reader-friendly structure

* responsive typography

* descriptive buttons

* clear focus states

* reduced motion support




Older family members may use this application, so interfaces must remain understandable without sacrificing contemporary aesthetics.




---




# 68. PERFORMANCE




Prioritize fast loading.




The weekly question page should be extremely lightweight.




Lazy-load:




* historical photos

* audio players

* complex timeline views

* book preview assets




Do not make someone download their entire archive when opening today's question.




---




# 69. SECURITY




Apply secure defaults.




Implement:




* Supabase Row Level Security

* server-side Stripe validation

* private storage

* signed URLs

* rate limiting

* secure contribution tokens

* server-side AI API usage

* sanitization of rendered user content

* webhook signature validation

* authorization checks on every protected mutation




Never trust a `user_id` provided by the client.




Derive authenticated identity server-side.




---




# 70. BACKUP AND DURABILITY




This product makes an unusually strong promise because people may store memories for decades.




Architect for data durability.




Keep media storage and relational metadata separate.




Avoid destructive overwrites.




For AI-polished content, retain:




**original version + edited version**




For transcripts, retain:




**recording + raw transcript + polished narrative**




Users should never lose originals merely because they clicked an AI feature.




---




# 71. MVP — BUILD THIS FIRST




The first production version should focus intensely on the core experience.




### Required MVP




1. Marketing landing page

2. Supabase authentication

3. Basic onboarding

4. Curated question library

5. First-question experience

6. Weekly question selection

7. Written answers

8. Voice recording

9. Transcription

10. Memory storage

11. Optional AI polish

12. Follow-up question suggestion

13. Photos

14. My Story memory list

15. Basic timeline

16. People extraction/confirmation

17. Search

18. Stripe $12/year subscription

19. Weekly email

20. Private-by-default permissions

21. Export

22. Admin question management

23. Responsive mobile UI

24. Demo/seed mode




---




# 72. SECOND PHASE




After the core loop works, implement:




1. personalized question engine

2. richer People pages

3. Places

4. life-map coverage

5. contribution links

6. Stories About Me

7. family interview projects

8. deeper semantic search

9. chapters

10. digital book generation

11. sharing

12. gift memberships




---




# 73. THIRD PHASE




Future opportunities:




1. collaborative family archives

2. physical hardcover ordering

3. richer audio storytelling

4. automatic photo-based prompts

5. importing old photographs

6. video memories

7. interviewer conversation mode

8. annual printed storybooks

9. family trees

10. legacy/archive access controls

11. optional trusted-person access

12. multilingual storytelling




Do not prematurely build these at the expense of the weekly-question loop.




---




# 74. WHAT NOT TO BUILD




Do NOT build:




* a social media feed

* public follower counts

* likes

* competitive streaks

* XP

* coins

* virtual currency

* daily mandatory check-ins

* generic AI chat as the homepage

* dozens of pricing tiers

* a complicated family genealogy product

* a generic cloud photo drive

* an open-ended diary

* an AI autobiography that invents stories




Every feature should answer:




> **Does this help someone remember, preserve, organize or revisit a real story?**




If not, it probably doesn't belong.




---




# 75. PRODUCT MOAT




The long-term moat is not AI generation.




The moat is the progressively structured personal archive:




**Questions → Memories → People → Places → Events → Time → Relationships → Chapters → Book**




After years of usage, the system understands enough context to ask dramatically better questions.




For example, a generic app asks:




> What was your first car?




After two years, this app can ask:




> You mentioned driving your old Honda to your first job at the restaurant, but you've never told the story of how you got that job. How did that happen?




That is the experience to build toward.




The AI should increasingly feel like:




**someone who has actually listened to your stories.**




---




# 76. NORTH-STAR PRODUCT MOMENT




The product succeeds when someone opens an old memory and thinks:




> **I had completely forgotten about that.**




Everything should optimize for creating that moment repeatedly.




The application should not make users feel guilty for failing to document their lives.




It should make preservation feel effortless.




The user gives us a few minutes at a time.




Over years, those minutes become something enormous.




---




# 77. CORE COPY




Use this messaging throughout the initial product:




### Primary headline




# You'll forget more than you think.




### Subheadline




**One good question every week.**




Answer it with your voice, words, or photos.




Over time, those little memories become the story of your life.




### CTA




**START MY STORY**




### Pricing




**$1/month**




*$12 billed annually*




### Supporting message




**Don't journal. Just answer.**




### Another supporting message




**52 questions. 52 memories. One year of your life preserved.**




Do not overuse sentimental copy.




Let the concept speak for itself.




---




# 78. FINAL BUILD PRINCIPLE




Build this as a real product, not a collection of screens.




The most important experience is:




**Email arrives → user opens question → remembers something → speaks/writes → memory becomes beautiful → user leaves.**




This loop should feel effortless.




The second most important experience is:




**Months later → user returns → discovers an old memory → realizes the archive has become meaningful.**




Keep the MVP small enough to maintain by one founder.




Prefer simple systems and strong product design over feature quantity.




The final application should feel like a **patient biographer that asks you one surprisingly good question at a time.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://back-then.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/272fb217-a75c-4162-9fc1-4c4936ef44b7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
