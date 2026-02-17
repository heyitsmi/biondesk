-- Allow public read access to app_settings
DROP POLICY IF EXISTS "Users can view settings" ON public.app_settings;

CREATE POLICY "Anyone can view settings" ON public.app_settings
FOR SELECT USING (true);
