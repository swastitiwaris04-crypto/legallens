-- LegalLens Supabase Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  filename TEXT,
  file_type TEXT CHECK (file_type IN ('pdf', 'image', 'text')),
  file_url TEXT,
  original_name TEXT,
  raw_text TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Analyses table (result of Gemini analysis)
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE UNIQUE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  document_type TEXT,
  risk_score TEXT CHECK (risk_score IN ('Low', 'Medium', 'High')),
  risk_score_num SMALLINT CHECK (risk_score_num >= 0 AND risk_score_num <= 100),
  risk_reason TEXT,
  result_json JSONB,
  red_flag_count SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Reminders table (for obligation deadlines)
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  obligation_id TEXT,
  description TEXT NOT NULL,
  deadline_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurring_type TEXT CHECK (recurring_type IN ('monthly', 'weekly', 'yearly', NULL)),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Share links table
CREATE TABLE public.share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Chat messages table (persist conversation history)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS: Documents — users can only see/manage their own
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: Analyses — users can only see their own
CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: Reminders
CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: Share links — insert allowed for own docs, select public by token
CREATE POLICY "Users can create share links for own docs"
  ON public.share_links FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.documents WHERE id = document_id)
  );

CREATE POLICY "Anyone can view share links by token"
  ON public.share_links FOR SELECT
  USING (true);

CREATE POLICY "Users can delete own share links"
  ON public.share_links FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.documents WHERE id = document_id)
  );

-- RLS: Chat messages
CREATE POLICY "Users can view own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can only access their own files
CREATE POLICY "Users can view own documents storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can upload own documents storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own documents storage"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Indexes for performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_analyses_document_id ON public.analyses(document_id);
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX idx_chat_messages_document_id ON public.chat_messages(document_id);
CREATE INDEX idx_share_links_token ON public.share_links(token);
