-- Allow Admins to view all users
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);

-- Allow Admins to update users (specifically roles)
CREATE POLICY "Admins can update users" ON public.users
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.users WHERE role = 'admin'
  )
);
