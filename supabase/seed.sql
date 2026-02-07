-- ============================================
-- FLOVA - Database Seeder
-- ============================================
-- Run this after schema.sql to create initial admin user

-- Admin user
-- Email: admin@biondesk.com
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (id, email, password_hash, name, plan)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@biondesk.com',
  '$2b$10$abFtiQCFRwGunhkU/.mI8.aFT0DsPyIpJbXzsqa0nvO9g30uQVIvy',
  'Admin User',
  'pro'
);

-- Default workspace for admin
INSERT INTO workspaces (id, user_id, name, currency, locale)
VALUES (
  'b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'My Workspace',
  'USD',
  'en-US'
);

-- Sample reminder rules
INSERT INTO reminder_rules (workspace_id, type, days_offset, template_content, is_active)
VALUES 
  ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'pre_due', -3, 'This is a friendly reminder that Invoice {{invoice_number}} is due in 3 days.', true),
  ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'overdue', 1, 'Invoice {{invoice_number}} is now 1 day overdue. Please process the payment at your earliest convenience.', true),
  ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'quote_followup', 3, 'Following up on Quote {{quote_number}} sent 3 days ago. Let me know if you have any questions!', true);

-- Sample template
INSERT INTO templates (workspace_id, type, name, content, default_terms, default_notes)
VALUES (
  'b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'quote',
  'Standard Project Quote',
  'Thank you for considering our services. This quote outlines the scope and pricing for your project.',
  'Payment: 50% upfront, 50% upon completion. Quote valid for 14 days.',
  'We look forward to working with you!'
);

-- Sample contacts
INSERT INTO contacts (workspace_id, name, email, company, type)
VALUES 
  ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'John Smith', 'john@example.com', 'Acme Corp', 'client'),
  ('b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Sarah Johnson', 'sarah@startup.io', 'Startup.io', 'lead');

-- Sample opportunity
INSERT INTO opportunities (workspace_id, title, source, stage, priority, value, notes)
VALUES (
  'b1ffbc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'Website Redesign Project',
  'direct',
  'inbox',
  'high',
  5000,
  'Potential client looking for a complete website redesign.'
);
