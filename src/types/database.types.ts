export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          id: string
          community_id: string
          event_type: string
          user_id: string | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          community_id: string
          event_type: string
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string
          event_type?: string
          user_id?: string | null
          metadata?: Json | null
          created_at?: string | null
        }
      }
      badges: {
        Row: {
          id: string
          community_id: string
          name: string
          description: string | null
          icon_url: string | null
          points_value: number | null
          category: string | null
          requirements: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          community_id: string
          name: string
          description?: string | null
          icon_url?: string | null
          points_value?: number | null
          category?: string | null
          requirements?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          points_value?: number | null
          category?: string | null
          requirements?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          domain: string | null
          creator_id: string
          created_at: string | null
          updated_at: string | null
          status: string | null
          theme_config: Json | null
          api_keys: Json | null
          is_private: boolean | null
          member_count: number | null
          category: string | null
          slug: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          domain?: string | null
          creator_id?: string
          created_at?: string | null
          updated_at?: string | null
          status?: string | null
          theme_config?: Json | null
          api_keys?: Json | null
          is_private?: boolean | null
          member_count?: number | null
          category?: string | null
          slug?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          domain?: string | null
          creator_id?: string
          created_at?: string | null
          updated_at?: string | null
          status?: string | null
          theme_config?: Json | null
          api_keys?: Json | null
          is_private?: boolean | null
          member_count?: number | null
          category?: string | null
          slug?: string | null
        }
      }
      community_members: {
        Row: {
          id: string
          community_id: string
          user_id: string
          role: string | null
          status: string | null
          subscription_plan_id: string | null
          joined_at: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          custom_fields: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          community_id: string
          user_id: string
          role?: string | null
          status?: string | null
          subscription_plan_id?: string | null
          joined_at?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          custom_fields?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string
          user_id?: string
          role?: string | null
          status?: string | null
          subscription_plan_id?: string | null
          joined_at?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          custom_fields?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // ... outros tipos de tabelas aqui ...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
} 