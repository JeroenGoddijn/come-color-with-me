-- Run this in Supabase Dashboard → SQL Editor
-- Or via: supabase db push (if CLI is set up)

CREATE TABLE IF NOT EXISTS public.downloads (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text        NOT NULL UNIQUE,
  artwork_slug      text        NOT NULL,
  artwork_title     text        NOT NULL,
  downloaded_at     timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own download records
CREATE POLICY "Users can view own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS downloads_user_id_idx
  ON public.downloads (user_id, downloaded_at DESC);
