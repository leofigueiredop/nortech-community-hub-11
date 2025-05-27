import { supabase } from '@/lib/supabase';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { AuthResponse, AuthUser, Profile } from '../interfaces/IAuthRepository';
import { BaseRepository } from './BaseRepository';
import { CommunityContext } from '@/types/community';

interface CommunityData {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  theme_config: {
    primary_color?: string;
    secondary_color?: string;
    background_color?: string;
  } | null;
}

export class SupabaseAuthRepository extends BaseRepository implements IAuthRepository {
  constructor() {
    super(supabase);
  }

  private async fetchUserCommunity(userId: string): Promise<CommunityContext | null> {
    try {
      console.log('Fetching user community for user ID:', userId);
      
      // Check if user is a creator of any community
      const { data: creatorCommunity, error: creatorError } = await this.supabase
        .from('communities')
        .select('id, name, description, logo_url, theme_config')
        .eq('creator_id', userId)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator community:', creatorError);
      }

      if (creatorCommunity) {
        console.log('User is a creator of community:', creatorCommunity.id);
        
        return {
          id: creatorCommunity.id,
          name: creatorCommunity.name,
          description: creatorCommunity.description || '',
          logo_url: creatorCommunity.logo_url,
          theme_config: creatorCommunity.theme_config
        };
      }

      // If not creator, check if member of any community
      const { data: memberData, error: memberError } = await this.supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching community membership:', memberError);
      }

      if (memberData && memberData.community_id) {
        // Then get the community details by ID
        const { data: communityData, error: communityError } = await this.supabase
          .from('communities')
          .select('id, name, description, logo_url, theme_config')
          .eq('id', memberData.community_id)
          .maybeSingle();
          
        if (communityError) {
          console.error('Error fetching community details:', communityError);
        }
          
        if (communityData) {
          console.log('User is a member of community:', communityData.id);
          
          return {
            id: communityData.id,
            name: communityData.name,
            description: communityData.description || '',
            logo_url: communityData.logo_url,
            theme_config: communityData.theme_config
          };
        }
      }

      // If no community was found
      return null;
    } catch (error) {
      console.error('Error fetching user community:', error);
      throw new Error('Failed to fetch user community. Please try again later.');
    }
  }

  private async fetchProfile(userId: string): Promise<Profile> {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      // Check if profile exists
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      if (profile) {
        return profile as Profile;
      }

      // If no profile, create a basic one
      const { data: session } = await this.supabase.auth.getSession();
      const email = session?.session?.user?.email || '';
      
      const newProfile = {
        id: userId,
        full_name: email.split('@')[0], // Default name based on email
        avatar_url: null
      };
      
      const { error: insertError } = await this.supabase
        .from('profiles')
        .insert(newProfile);
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw new Error('Failed to create user profile');
      }
      
      return newProfile as Profile;
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      throw new Error('Failed to fetch or create user profile');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Attempting login for email:', email);
      
      const { data: authData, error: authError } = await this.supabase.auth
        .signInWithPassword({ email, password });

      if (authError) throw authError;
      if (!authData?.user) throw new Error('Login successful but no user data returned');

      const profile = await this.fetchProfile(authData.user.id);
      const community = await this.fetchUserCommunity(authData.user.id);

      if (!community) {
        throw new Error('No community access. Please join or create a community.');
      }

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email || '',
          profile
        },
        community
      };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error && error.message.includes('No community access')) {
        throw new Error('You currently have no access to any communities. Please create a new community or request access to an existing one.');
      }
      
      // Handle auth errors with friendly messages
      if (error instanceof Error && error.message.includes('Invalid login credentials')) {
        throw new Error('Incorrect email or password. Please try again.');
      }
      
      // Network errors
      if (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError'))) {
        throw new Error('Network connectivity issue. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async getSession(): Promise<AuthResponse> {
    try {
      console.log('Getting current session');
      
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error('No active session');

      const profile = await this.fetchProfile(session.user.id);
      const community = await this.fetchUserCommunity(session.user.id);

      if (!community) {
        throw new Error('No community access. Please join or create a community.');
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          profile
        },
        community
      };
    } catch (error) {
      console.error('Session error:', error);
      
      if (error instanceof Error && error.message.includes('No community access')) {
        throw new Error('You currently have no access to any communities. Please create a new community or request access to an existing one.');
      }
      
      // Network errors
      if (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError'))) {
        throw new Error('Network connectivity issue. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('Logging out user');
      
      // First, try to terminate the session server-side
      const { error } = await this.supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.warn('Server-side logout had an error, will still proceed with client-side cleanup:', error);
      }
      
      // Perform client-side cleanup regardless of server response
      try {
        // Clear any stored supabase session data in localStorage
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('currentCommunityId');
        
        // Clear all Supabase-related cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name.includes('sb-') || name.includes('supabase')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
        
        console.log('Client-side auth cleanup completed');
      } catch (cleanupError) {
        console.warn('Error during client-side cleanup:', cleanupError);
        // Continue even if cleanup fails - we still want to complete the logout flow
      }
      
      // If the server-side signOut threw an error, propagate it after cleanup
      if (error) throw error;
      
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Could not complete logout process. Try clearing your browser cache.');
    }
  }

  async handleAuthCallback(): Promise<AuthResponse> {
    try {
      console.log('Handling auth callback');
      
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error('No active session during callback');

      const profile = await this.fetchProfile(session.user.id);
      const community = await this.fetchUserCommunity(session.user.id);

      if (!community) {
        throw new Error('No community access. Please join or create a community.');
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email || '',
          profile
        },
        community
      };
    } catch (error) {
      console.error('Auth callback error:', error);
      
      if (error instanceof Error && error.message.includes('No community access')) {
        throw new Error('You currently have no access to any communities. Please create a new community or request access to an existing one.');
      }
      
      // Network errors
      if (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError'))) {
        throw new Error('Network connectivity issue. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      console.log('Registering new user with email:', email);
      
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth
        .signUp({ email, password });

      if (authError) throw authError;
      if (!authData?.user) throw new Error('Registration successful but no user data returned');

      // Create a profile for the new user
      const profile: Profile = {
        id: authData.user.id,
        full_name: fullName,
        avatar_url: null
      };
      
      const { error: profileError } = await this.supabase
        .from('profiles')
        .insert(profile);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error('Failed to create user profile');
      }

      // At this point, the user is registered but has no community access
      // They will be directed to either create a community or join an existing one
      // Return the user data without a community
      
      return {
        user: {
          id: authData.user.id,
          email: authData.user.email || '',
          profile
        },
        community: null
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle auth errors with friendly messages
      if (error instanceof Error && error.message.includes('already exists')) {
        throw new Error('An account with this email already exists. Please try logging in.');
      }
      
      // Network errors
      if (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError'))) {
        throw new Error('Network connectivity issue. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  async createCommunity(communityData: {
    name: string;
    description: string;
    logo_url?: string | null;
    category?: string;
    is_private?: boolean;
  }): Promise<CommunityContext> {
    try {
      console.log('Creating new community:', communityData.name);
      
      // Get current user ID from session
      const { data: { session } } = await this.supabase.auth.getSession();
      if (!session?.user) throw new Error('No active session, please log in first');
      
      const userId = session.user.id;
      
      // Generate a slug from the community name
      const slug = communityData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Create the community record
      const newCommunity = {
        name: communityData.name,
        description: communityData.description,
        logo_url: communityData.logo_url || null,
        creator_id: userId,
        category: communityData.category || 'general',
        is_private: communityData.is_private || false,
        slug,
        theme_config: {
          primary_color: "#6C5DD3",
          secondary_color: "#10b981",
          background_color: "#f9fafb"
        }
      };
      
      const { data: community, error: communityError } = await this.supabase
        .from('communities')
        .insert(newCommunity)
        .select()
        .single();
      
      if (communityError) throw communityError;
      if (!community) throw new Error('Failed to create community');
      
      // Add the creator as a member with role 'owner'
      const { error: memberError } = await this.supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: userId,
          role: 'owner',
          status: 'active',
          joined_at: new Date().toISOString()
        });
      
      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        throw new Error('Failed to set up community membership');
      }
      
      return {
        id: community.id,
        name: community.name,
        description: community.description || '',
        logo_url: community.logo_url,
        theme_config: community.theme_config
      };
    } catch (error) {
      console.error('Create community error:', error);
      
      if (error instanceof Error && error.message.includes('communities_slug_unique')) {
        throw new Error('A community with this name already exists. Please try a different name.');
      }
      
      throw error;
    }
  }
}
