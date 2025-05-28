-- Create paywall_settings table
CREATE TABLE IF NOT EXISTS paywall_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  active_template TEXT DEFAULT 'standard',
  active_gateways TEXT[] DEFAULT ARRAY['stripe'],
  gateway_configs JSONB DEFAULT '{}',
  message_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(community_id)
);

-- Enable RLS
ALTER TABLE paywall_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their community paywall settings" 
ON paywall_settings FOR SELECT 
USING (
  community_id IN (
    SELECT community_id 
    FROM community_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Community owners can manage paywall settings" 
ON paywall_settings FOR ALL 
USING (
  community_id IN (
    SELECT id 
    FROM communities 
    WHERE creator_id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS paywall_settings_community_id_idx ON paywall_settings(community_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_paywall_settings_updated_at 
BEFORE UPDATE ON paywall_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 