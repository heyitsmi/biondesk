-- Create an Admin User
-- Replace with your desired email and password hash
-- You can generate a hash using https://bcrypt-generator.com/ or via the app registration
-- For this seed, we'll assume a known hash or just insert a placeholder. 
-- Ideally, you register via the app then manually update the role to 'admin', 
-- OR insert a user here if you know the hash mechanism matches exactly.
-- Since we use bcryptjs in `lib/auth.ts`, we can insert a user with a known password.
-- Password 'admin123' -> $2a$10$w... (example, but better to generate one)
-- Let's just create a function to promote a user to admin by email, to be safe.

CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users SET role = 'admin' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT promote_to_admin('admin@biondesk.com');
