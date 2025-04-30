-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Modify communities table to use uuid_generate_v4() as default for id
ALTER TABLE communities 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Add comment explaining the change
COMMENT ON COLUMN communities.id IS 'Unique identifier for the community - automatically generated UUID v4'; 