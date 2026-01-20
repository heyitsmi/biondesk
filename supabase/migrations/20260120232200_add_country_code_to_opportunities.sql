-- Add country_code column to opportunities table
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS country_code text;
