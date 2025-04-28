
import { BaseRepository } from './BaseRepository';
import { IContentRepository } from '../interfaces/IContentRepository';
import { 
  ContentItem, 
  ContentCategory, 
  ContentProgress, 
  ContentInteraction, 
  ContentComment,
  Course 
} from '@/types/library';

export class SupabaseContentRepository extends BaseRepository implements IContentRepository {
  constructor() {
    super();
  }

  async getAll(): Promise<ContentItem[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<ContentItem> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_items')
        .insert([{
          ...content,
          community_id: this.currentCommunityId,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_items')
        .update(content)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('content_items')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllCategories(): Promise<ContentCategory[]> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('community_id', this.currentCommunityId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCategoryById(id: string): Promise<ContentCategory> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createCategory(category: Partial<ContentCategory>): Promise<ContentCategory> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_categories')
        .insert([{
          ...category,
          community_id: this.currentCommunityId,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateCategory(id: string, category: Partial<ContentCategory>): Promise<ContentCategory> {
    try {
      await this.setTenantContext();
      const { data, error } = await this.supabase
        .from('content_categories')
        .update(category)
        .eq('id', id)
        .eq('community_id', this.currentCommunityId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await this.setTenantContext();
      const { error } = await this.supabase
        .from('content_categories')
        .delete()
        .eq('id', id)
        .eq('community_id', this.currentCommunityId);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async trackContentView(contentId: string, userId: string): Promise<void> {
    try {
      await this.setTenantContext();
      
      // Update views count on content
      const { error: updateError } = await this.supabase
        .rpc('increment_content_views', {
          content_id_param: contentId
        });
      
      if (updateError) throw updateError;
      
      // Record interaction
      const { error } = await this.supabase
        .from('content_interactions')
        .insert([{
          content_id: contentId,
          user_id: userId,
          community_id: this.currentCommunityId,
          interaction_type: 'view',
          interaction_data: {}
        }]);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }

  async trackContentCompletion(contentId: string, userId: string, percentComplete: number): Promise<void> {
    try {
      await this.setTenantContext();
      
      // Check if there's already a completion record
      const { data: existingData, error: fetchError } = await this.supabase
        .from('content_interactions')
        .select('id, interaction_data')
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .eq('interaction_type', 'completion')
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (existingData) {
        // Update existing record if new percentage is higher
        if (percentComplete > (existingData.interaction_data?.percent || 0)) {
          const { error } = await this.supabase
            .from('content_interactions')
            .update({
              interaction_data: { percent: percentComplete },
              updated_at: new Date().toISOString()
            })
            .eq('id', existingData.id);
          
          if (error) throw error;
        }
      } else {
        // Create new record
        const { error } = await this.supabase
          .from('content_interactions')
          .insert([{
            content_id: contentId,
            user_id: userId,
            community_id: this.currentCommunityId,
            interaction_type: 'completion',
            interaction_data: { percent: percentComplete }
          }]);
        
        if (error) throw error;
      }
    } catch (error) {
      this.handleError(error);
    }
  }
}
