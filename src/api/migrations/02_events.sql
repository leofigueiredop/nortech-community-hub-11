-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id SERIAL PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  event_type TEXT,
  capacity INTEGER,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  space_id TEXT
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS events_community_idx ON public.events USING btree (community_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON public.events USING btree (date);
CREATE INDEX IF NOT EXISTS events_featured_idx ON public.events USING btree (is_featured);
CREATE INDEX IF NOT EXISTS event_attendees_event_idx ON public.event_attendees USING btree (event_id);
CREATE INDEX IF NOT EXISTS event_attendees_user_idx ON public.event_attendees USING btree (user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies for events
CREATE POLICY "Anyone can view events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Community leaders can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = events.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Event organizers can update their events" ON public.events
  FOR UPDATE USING (
    organizer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = events.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Community leaders can delete events" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_members.community_id = events.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.role IN ('admin', 'moderator')
    )
  );

-- Row Level Security Policies for event_attendees
CREATE POLICY "Anyone can view event attendees" ON public.event_attendees
  FOR SELECT USING (true);

CREATE POLICY "Anyone can register for events" ON public.event_attendees
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own registrations" ON public.event_attendees
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Event organizers can update any registration" ON public.event_attendees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.events
      JOIN public.community_members ON events.community_id = community_members.community_id
      WHERE events.id = event_attendees.event_id
      AND community_members.user_id = auth.uid()
      AND community_members.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Users can delete their own registrations" ON public.event_attendees
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Event organizers can delete any registration" ON public.event_attendees
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.events
      JOIN public.community_members ON events.community_id = community_members.community_id
      WHERE events.id = event_attendees.event_id
      AND community_members.user_id = auth.uid()
      AND community_members.role IN ('admin', 'moderator')
    )
  ); 