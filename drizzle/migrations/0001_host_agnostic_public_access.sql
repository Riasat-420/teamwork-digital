GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.page_views_id_seq TO anon, authenticated;
CREATE POLICY "Anyone records a view" ON public.page_views FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(path) <= 300 AND path !~ '^/(admin|login|reset-password|api)');
GRANT INSERT ON public.site_events TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.site_events_id_seq TO anon, authenticated;
CREATE POLICY "Anyone records an event" ON public.site_events FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) <= 60 AND (label IS NULL OR char_length(label) <= 200));
GRANT SELECT ON public.chatbot_knowledge TO anon;
CREATE POLICY "Anyone reads enabled chatbot answers" ON public.chatbot_knowledge FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Anyone reads uploaded site media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-media' AND (storage.foldername(name))[1] = 'uploads');