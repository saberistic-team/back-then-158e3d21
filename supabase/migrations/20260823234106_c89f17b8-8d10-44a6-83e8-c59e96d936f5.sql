
-- ============ helpers ============
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ roles ============
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  birth_year integer,
  birth_date date,
  childhood_location text,
  preserve_topics text[] NOT NULL DEFAULT '{}',
  avoid_topics text[] NOT NULL DEFAULT '{}',
  delivery_day text NOT NULL DEFAULT 'sunday',
  delivery_time text NOT NULL DEFAULT 'morning',
  onboarded_at timestamptz,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ subscriptions ============
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'none',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription readable" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER subscriptions_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ question library ============
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  category text NOT NULL,
  life_stage text,
  depth text NOT NULL DEFAULT 'light',
  age_min integer,
  age_max integer,
  sensitivity_level integer NOT NULL DEFAULT 0,
  sensitive_topics text[] NOT NULL DEFAULT '{}',
  follow_up_allowed boolean NOT NULL DEFAULT true,
  good_for_interview boolean NOT NULL DEFAULT false,
  good_for_photo boolean NOT NULL DEFAULT false,
  follow_up_themes text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.questions TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions readable" ON public.questions FOR SELECT USING (true);
CREATE POLICY "admins manage questions" ON public.questions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER questions_updated BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX questions_active_category_idx ON public.questions(active, category);

-- ============ memories ============
CREATE TABLE public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL,
  question_text text,
  parent_memory_id uuid REFERENCES public.memories(id) ON DELETE SET NULL,
  title text,
  original_text text,
  polished_text text,
  use_polished boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'write',
  status text NOT NULL DEFAULT 'preserved',
  memory_date_type text NOT NULL DEFAULT 'unknown',
  memory_date date,
  approximate_year integer,
  approximate_age integer,
  life_period text,
  topics text[] NOT NULL DEFAULT '{}',
  privacy_status text NOT NULL DEFAULT 'private',
  share_token text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO authenticated;
GRANT ALL ON public.memories TO service_role;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own memories" ON public.memories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER memories_updated BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX memories_user_created_idx ON public.memories(user_id, created_at DESC);
CREATE INDEX memories_user_year_idx ON public.memories(user_id, approximate_year);

-- ============ user_questions ============
CREATE TABLE public.user_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  custom_question_text text,
  scheduled_for timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  skipped_reason text,
  answered_memory_id uuid REFERENCES public.memories(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'weekly',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_questions TO authenticated;
GRANT ALL ON public.user_questions TO service_role;
ALTER TABLE public.user_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own user questions" ON public.user_questions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER user_questions_updated BEFORE UPDATE ON public.user_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX user_questions_user_status_idx ON public.user_questions(user_id, status);

-- ============ recordings ============
CREATE TABLE public.recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id uuid REFERENCES public.memories(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  duration_seconds integer,
  raw_transcript text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recordings TO authenticated;
GRANT ALL ON public.recordings TO service_role;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own recordings" ON public.recordings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ memory_photos ============
CREATE TABLE public.memory_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id uuid REFERENCES public.memories(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  caption text,
  approximate_date text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_photos TO authenticated;
GRANT ALL ON public.memory_photos TO service_role;
ALTER TABLE public.memory_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own photos" ON public.memory_photos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ people ============
CREATE TABLE public.people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  relationship text,
  notes text,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.people TO authenticated;
GRANT ALL ON public.people TO service_role;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own people" ON public.people FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.memory_people (
  memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  person_id uuid NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  confidence numeric,
  confirmed boolean NOT NULL DEFAULT false,
  PRIMARY KEY (memory_id, person_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_people TO authenticated;
GRANT ALL ON public.memory_people TO service_role;
ALTER TABLE public.memory_people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own memory people" ON public.memory_people FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ places ============
CREATE TABLE public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location_text text,
  latitude double precision,
  longitude double precision,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.places TO authenticated;
GRANT ALL ON public.places TO service_role;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own places" ON public.places FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.memory_places (
  memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  confidence numeric,
  confirmed boolean NOT NULL DEFAULT false,
  PRIMARY KEY (memory_id, place_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_places TO authenticated;
GRANT ALL ON public.memory_places TO service_role;
ALTER TABLE public.memory_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own memory places" ON public.memory_places FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ chapters ============
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT ALL ON public.chapters TO service_role;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chapters" ON public.chapters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chapter_memories (
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  memory_id uuid NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (chapter_id, memory_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapter_memories TO authenticated;
GRANT ALL ON public.chapter_memories TO service_role;
ALTER TABLE public.chapter_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chapter memories" ON public.chapter_memories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ contributions ============
CREATE TABLE public.contribution_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_display_name text,
  recipient_name text,
  question text NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contribution_requests TO authenticated;
GRANT SELECT ON public.contribution_requests TO anon;
GRANT ALL ON public.contribution_requests TO service_role;
ALTER TABLE public.contribution_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages contribution requests" ON public.contribution_requests FOR ALL TO authenticated
  USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

CREATE TABLE public.contributed_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_request_id uuid NOT NULL REFERENCES public.contribution_requests(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contributor_name text,
  text text,
  audio_path text,
  transcript text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contributed_memories TO authenticated;
GRANT ALL ON public.contributed_memories TO service_role;
ALTER TABLE public.contributed_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner reads contributed memories" ON public.contributed_memories FOR SELECT TO authenticated USING (auth.uid() = owner_user_id);
CREATE POLICY "owner updates contributed memories" ON public.contributed_memories FOR UPDATE TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "owner deletes contributed memories" ON public.contributed_memories FOR DELETE TO authenticated USING (auth.uid() = owner_user_id);

-- ============ interviews ============
CREATE TABLE public.interview_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_name text NOT NULL,
  relationship text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_projects TO authenticated;
GRANT ALL ON public.interview_projects TO service_role;
ALTER TABLE public.interview_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own interview projects" ON public.interview_projects FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

CREATE TABLE public.interview_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_project_id uuid NOT NULL REFERENCES public.interview_projects(id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE SET NULL,
  memory_id uuid REFERENCES public.memories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_memories TO authenticated;
GRANT ALL ON public.interview_memories TO service_role;
ALTER TABLE public.interview_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own interview memories" ON public.interview_memories FOR ALL TO authenticated USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

-- ============ books ============
CREATE TABLE public.generated_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Stories From My Life',
  subtitle text,
  status text NOT NULL DEFAULT 'draft',
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_books TO authenticated;
GRANT ALL ON public.generated_books TO service_role;
ALTER TABLE public.generated_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own books" ON public.generated_books FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER generated_books_updated BEFORE UPDATE ON public.generated_books FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ analytics ============
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert own events" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins read events" ON public.analytics_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- ============ storage policies ============
CREATE POLICY "own audio files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'memory-audio' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'memory-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own photo files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'memory-photos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'memory-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own export files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);
