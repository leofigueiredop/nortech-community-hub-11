
import { IContentRepository } from '@/api/interfaces/IContentRepository';
import { createClient } from '@/api/supabase';
import { 
  ContentItem, 
  ContentCategory,
  ContentProgress,
  ContentInteraction,
  ContentComment,
  Course
} from '@/types/library';
import { IBaseRepository } from '../interfaces/IBaseRepository';

// Class implementation
export class SupabaseContentRepository implements IContentRepository, IBaseRepository {
  private supabase = createClient();
  private communityId: string | null = null;
  
  setCommunityContext(communityId: string | null): void {
    this.communityId = communityId;
  }

  async getAll(): Promise<ContentItem[]> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching all content items:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching content item with id ${id}:`, error);
      throw error;
    }
  }

  async create(content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .insert(content)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating content item:', error);
      throw error;
    }
  }

  async update(id: string, content: Partial<ContentItem>): Promise<ContentItem> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .update(content)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error updating content item with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting content item with id ${id}:`, error);
      throw error;
    }
  }

  async getAllCategories(): Promise<ContentCategory[]> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching all content categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ContentCategory> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error fetching content category with id ${id}:`, error);
      throw error;
    }
  }

  async createCategory(category: Partial<ContentCategory>): Promise<ContentCategory> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating content category:', error);
      throw error;
    }
  }

  async updateCategory(id: string, category: Partial<ContentCategory>): Promise<ContentCategory> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Error updating content category with id ${id}:`, error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting content category with id ${id}:`, error);
      throw error;
    }
  }

  async trackContentView(contentId: string, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_interactions')
        .insert({
          content_id: contentId,
          user_id: userId,
          type: 'view',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking content view:', error);
      throw error;
    }
  }

  async trackContentCompletion(contentId: string, userId: string, percentComplete: number): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('content_interactions')
        .insert({
          content_id: contentId,
          user_id: userId,
          type: 'completion',
          percentage_complete: percentComplete,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking content completion:', error);
      throw error;
    }
  }
}

// Export an instance of the repository
const supabaseContentRepository = new SupabaseContentRepository();
export default supabaseContentRepository;
