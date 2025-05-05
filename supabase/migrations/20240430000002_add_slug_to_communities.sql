-- Add slug column to communities table
ALTER TABLE public.communities
ADD COLUMN slug text;

-- Make slug unique
ALTER TABLE public.communities
ADD CONSTRAINT communities_slug_unique UNIQUE (slug);

-- Create index for slug lookups
CREATE INDEX communities_slug_idx ON public.communities (slug);

-- Add comment explaining the fields
COMMENT ON COLUMN public.communities.slug IS 'URL-friendly version of community name - used for routing';
COMMENT ON COLUMN public.communities.domain IS 'Optional custom domain for the community';

-- Add trigger to automatically generate slug from name if not provided
CREATE OR REPLACE FUNCTION generate_community_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    temp_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate base slug from name if slug is not provided, or clean provided slug
    IF NEW.slug IS NULL THEN
        base_slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    ELSE
        -- Clean provided slug
        base_slug := LOWER(REGEXP_REPLACE(NEW.slug, '[^a-zA-Z0-9]+', '-', 'g'));
    END IF;
    
    -- Remove leading/trailing hyphens
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    -- Ensure minimum length
    IF LENGTH(base_slug) < 1 THEN
        base_slug := 'community';
    END IF;
    
    -- Start with base slug
    temp_slug := base_slug;
    
    -- Keep trying with incremented counter until we find an unused slug
    WHILE EXISTS (SELECT 1 FROM public.communities WHERE slug = temp_slug AND id != NEW.id) LOOP
        temp_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    NEW.slug := temp_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert or update
CREATE TRIGGER ensure_community_slug
    BEFORE INSERT OR UPDATE ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION generate_community_slug();

-- Add RLS policy for slug access
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to community slugs" 
    ON public.communities
    FOR SELECT 
    USING (true);  -- Everyone can read slugs for routing

-- Add insert policy for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON public.communities
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Update existing communities to have slugs
WITH numbered_communities AS (
    SELECT 
        id,
        name,
        ROW_NUMBER() OVER (PARTITION BY LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) ORDER BY created_at) as rn
    FROM public.communities 
    WHERE slug IS NULL
)
UPDATE public.communities c
SET slug = CASE 
    WHEN nc.rn = 1 THEN LOWER(REGEXP_REPLACE(c.name, '[^a-zA-Z0-9]+', '-', 'g'))
    ELSE LOWER(REGEXP_REPLACE(c.name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || nc.rn::text
END
FROM numbered_communities nc
WHERE c.id = nc.id; 