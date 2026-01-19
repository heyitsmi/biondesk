-- ============================================
-- FLOVA - Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users table (Manual Auth)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  plan VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'studio'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Workspaces
-- ============================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  address TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  locale VARCHAR(10) DEFAULT 'en-US',
  default_payment_link TEXT,
  bank_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Contacts / Clients
-- ============================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  type VARCHAR(20) DEFAULT 'lead', -- 'lead' or 'client'
  total_value DECIMAL(15,2) DEFAULT 0,
  avg_time_to_pay INTEGER, -- in days
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Opportunities (Pipeline)
-- ============================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source VARCHAR(50), -- 'upwork', 'linkedin', 'direct', 'referral', 'other'
  stage VARCHAR(50) DEFAULT 'inbox', -- 'inbox', 'drafting', 'sent', 'negotiation', 'won', 'lost'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
  value DECIMAL(15,2),
  job_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Documents (Proposals, Quotes, Invoices)
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL, -- 'proposal', 'quote', 'invoice'
  number VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT, -- For proposals: full text content
  status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'sent', 'viewed', 'accepted', 'paid', 'overdue'
  amount DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(5,2) DEFAULT 0, -- Tax percentage
  discount DECIMAL(15,2) DEFAULT 0,
  deposit DECIMAL(15,2) DEFAULT 0,
  terms TEXT,
  notes TEXT,
  valid_until DATE,
  due_date DATE,
  public_token VARCHAR(100) UNIQUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- ============================================
-- Document Line Items
-- ============================================
CREATE TABLE document_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ============================================
-- Templates
-- ============================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'proposal', 'quote', 'invoice'
  name VARCHAR(255) NOT NULL,
  content TEXT, -- Template content with placeholders
  default_terms TEXT,
  default_notes TEXT,
  default_items JSONB, -- Default line items
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Profile Library Assets
-- ============================================
CREATE TABLE profile_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL, -- 'portfolio', 'testimonial', 'snippet'
  title VARCHAR(255) NOT NULL,
  content TEXT,
  tags TEXT[], -- Array of tags for matching
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Payments (Manual Tracking - BYO Payment)
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  method VARCHAR(50), -- 'bank_transfer', 'stripe', 'paypal', 'midtrans', 'cash', 'other'
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  proof_url TEXT -- Receipt/proof image URL
);

-- ============================================
-- Reminder Rules
-- ============================================
CREATE TABLE reminder_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'pre_due', 'overdue', 'quote_followup'
  days_offset INTEGER NOT NULL, -- Negative for before, positive for after
  template_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Reminder Jobs (Scheduled)
-- ============================================
CREATE TABLE reminder_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  rule_id UUID REFERENCES reminder_rules(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'cancelled'
  content TEXT
);

-- ============================================
-- Events (Activity Log)
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'document', 'opportunity', 'contact', 'payment'
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'sent', 'viewed', 'accepted', 'paid', 'reminder_sent'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Password Reset Tokens
-- ============================================
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Sessions (Manual Auth)
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_documents_workspace ON documents(workspace_id);
CREATE INDEX idx_documents_contact ON documents(contact_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_public_token ON documents(public_token);
CREATE INDEX idx_opportunities_workspace ON opportunities(workspace_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_contacts_workspace ON contacts(workspace_id);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_events_workspace ON events(workspace_id);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_reminder_jobs_scheduled ON reminder_jobs(scheduled_at, status);

-- ============================================
-- Updated At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_assets_updated_at BEFORE UPDATE ON profile_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
-- Note: Our API uses the service_role key which bypasses RLS.
-- These policies are for additional security and for any
-- direct database access from client-side (not recommended).

-- Enable RLS on all tables
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
-- Users can only read/update their own record
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Service role has full access (for API routes)
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

-- Public documents can be viewed by anyone with the token (for public quotes/invoices)
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

-- Public document items (for public quotes/invoices)
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
-- Only service role can access password reset tokens
CREATE POLICY "Service role has full access to password_reset_tokens" ON password_reset_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- Sessions table policies
-- ============================================
-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own sessions" ON sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Service role has full access to sessions" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

