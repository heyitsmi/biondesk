-- ============================================
-- FLOVA - Enable Row Level Security (RLS)
-- ============================================
-- Run this script AFTER schema.sql if you already have
-- existing tables without RLS enabled.
-- 
-- This script will:
-- 1. Enable RLS on all tables
-- 2. Create security policies for each table
--
-- Note: Our API uses the service_role key which bypasses RLS.
-- ============================================

-- First, drop existing policies if they exist (for re-running)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_record.policyname, policy_record.tablename);
    END LOOP;
END $$;

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Users table policies
-- ============================================
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Workspaces table policies
-- ============================================
CREATE POLICY "Users can view own workspaces" ON workspaces
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own workspaces" ON workspaces
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to workspaces" ON workspaces
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Contacts table policies
-- ============================================
CREATE POLICY "Users can view contacts in own workspace" ON contacts
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage contacts in own workspace" ON contacts
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to contacts" ON contacts
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Opportunities table policies
-- ============================================
CREATE POLICY "Users can view opportunities in own workspace" ON opportunities
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage opportunities in own workspace" ON opportunities
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to opportunities" ON opportunities
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Documents table policies
-- ============================================
CREATE POLICY "Users can view documents in own workspace" ON documents
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage documents in own workspace" ON documents
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Anyone can view public documents" ON documents
  FOR SELECT USING (public_token IS NOT NULL AND status != 'draft');

CREATE POLICY "Service role has full access to documents" ON documents
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Document Items table policies
-- ============================================
CREATE POLICY "Users can view document items in own workspace" ON document_items
  FOR SELECT USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage document items in own workspace" ON document_items
  FOR ALL USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can view items of public documents" ON document_items
  FOR SELECT USING (
    document_id IN (SELECT id FROM documents WHERE public_token IS NOT NULL AND status != 'draft')
  );

CREATE POLICY "Service role has full access to document_items" ON document_items
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Templates table policies
-- ============================================
CREATE POLICY "Users can view templates in own workspace" ON templates
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage templates in own workspace" ON templates
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to templates" ON templates
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Profile Assets table policies
-- ============================================
CREATE POLICY "Users can view profile assets in own workspace" ON profile_assets
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage profile assets in own workspace" ON profile_assets
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to profile_assets" ON profile_assets
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Payments table policies
-- ============================================
CREATE POLICY "Users can view payments for own documents" ON payments
  FOR SELECT USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage payments for own documents" ON payments
  FOR ALL USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role has full access to payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Reminder Rules table policies
-- ============================================
CREATE POLICY "Users can view reminder rules in own workspace" ON reminder_rules
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can manage reminder rules in own workspace" ON reminder_rules
  FOR ALL USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to reminder_rules" ON reminder_rules
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Reminder Jobs table policies
-- ============================================
CREATE POLICY "Users can view reminder jobs for own documents" ON reminder_jobs
  FOR SELECT USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage reminder jobs for own documents" ON reminder_jobs
  FOR ALL USING (
    document_id IN (
      SELECT d.id FROM documents d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE w.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role has full access to reminder_jobs" ON reminder_jobs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Events table policies
-- ============================================
CREATE POLICY "Users can view events in own workspace" ON events
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Users can create events in own workspace" ON events
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM workspaces WHERE user_id::text = auth.uid()::text)
  );

CREATE POLICY "Service role has full access to events" ON events
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Password Reset Tokens table policies
-- ============================================
CREATE POLICY "Service role has full access to password_reset_tokens" ON password_reset_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Sessions table policies
-- ============================================
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to sessions" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Done! Verify RLS is enabled
-- ============================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
