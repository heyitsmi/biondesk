-- Add username column to workspaces table
ALTER TABLE workspaces ADD COLUMN username TEXT UNIQUE;

-- Create an index for faster lookups
CREATE INDEX idx_workspaces_username ON workspaces(username);
