CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_first_admin
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND (key NOT IN ('seo','settings') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "Staff update content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()) AND (key NOT IN ('seo','settings') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "Admins delete content" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone sends a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (is_read = false);
CREATE POLICY "Staff read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.page_views (
  id bigserial PRIMARY KEY,
  path text NOT NULL,
  referrer text,
  device text,
  country text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_idx ON public.page_views (created_at DESC);
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read views" ON public.page_views FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.site_events (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  label text,
  path text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_events_created_idx ON public.site_events (created_at DESC);
GRANT SELECT ON public.site_events TO authenticated;
GRANT ALL ON public.site_events TO service_role;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read events" ON public.site_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TABLE public.chatbot_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'fact' CHECK (kind IN ('fact','response','rule')),
  title text NOT NULL DEFAULT '',
  trigger text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '' CHECK (char_length(content) <= 6000),
  enabled boolean NOT NULL DEFAULT true,
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chatbot_knowledge TO authenticated;
GRANT ALL ON public.chatbot_knowledge TO service_role;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage chatbot" ON public.chatbot_knowledge FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.activity_log (
  id bigserial PRIMARY KEY,
  user_id uuid,
  user_email text,
  action text NOT NULL,
  entity text NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read log" ON public.activity_log FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write own log" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND user_id = auth.uid());

CREATE POLICY "Staff read site media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'site-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND public.is_staff(auth.uid()));