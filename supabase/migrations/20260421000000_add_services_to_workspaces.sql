-- Add `services` column for managing user-provided services
ALTER TABLE workspaces 
ADD COLUMN services JSONB DEFAULT '["Web Design", "Mobile App Design", "Branding", "Development", "Other"]'::jsonb;
