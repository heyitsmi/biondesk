import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { createServerClient } from './supabase';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const SESSION_COOKIE_NAME = 'flova_session';

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Password verification
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export async function generateToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

// Create session in database and set cookie
export async function createSession(userId: string): Promise<string> {
  const token = await generateToken(userId);
  const supabase = createServerClient();
  
  // Store session in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
  
  await supabase.from('sessions').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString()
  });

  return token;
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<void> {
  const supabase = createServerClient();
  await supabase.from('sessions').delete().eq('token', token);
}

// Get current user from session
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  const supabase = createServerClient();
  
  // Verify session exists in database and is not expired
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!session) {
    return null;
  }

  // Get user data
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, avatar_url, plan')
    .eq('id', payload.userId)
    .single();

  return user;
}

// Get user's workspace
export async function getUserWorkspace(userId: string) {
  const supabase = createServerClient();
  
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('user_id', userId)
    .single();

  return workspace;
}

// Generate password reset token
export async function generatePasswordResetToken(userId: string): Promise<string> {
  const supabase = createServerClient();
  const token = crypto.randomUUID();
  
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
  
  await supabase.from('password_reset_tokens').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString()
  });

  return token;
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string) {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('password_reset_tokens')
    .select('user_id, expires_at, used_at')
    .eq('token', token)
    .single();

  if (!data) {
    return null;
  }

  if (data.used_at) {
    return null; // Token already used
  }

  if (new Date(data.expires_at) < new Date()) {
    return null; // Token expired
  }

  return { userId: data.user_id };
}

// Mark password reset token as used
export async function markPasswordResetTokenUsed(token: string): Promise<void> {
  const supabase = createServerClient();
  await supabase
    .from('password_reset_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token);
}
