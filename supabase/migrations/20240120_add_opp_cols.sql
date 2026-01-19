-- Add new columns to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS budget_type VARCHAR(20); -- 'fixed', 'hourly', 'tbd'
