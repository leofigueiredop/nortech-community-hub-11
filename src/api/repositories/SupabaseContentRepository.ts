import { IContentRepository } from '@/api/interfaces/IContentRepository';
import { IBaseRepository } from '../interfaces/IBaseRepository';
import { 
  ContentItem, 
  ContentCategory,
  ContentProgress,
  ContentInteraction,
  ContentComment,
  Course
} from '@/types/library';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';
import { SupabaseClient } from '@supabase/supabase-js';

// Class implementation
export class SupabaseContentRepository implements IContentRepository, IBaseRepository {
  private supabase: SupabaseClient;
  private currentCommunityId: string | null = null;
  
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  setCommunityContext(communityId: string | null): void {
    this.currentCommunityId = communityId;
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

  async getById(id: string): Promise<Result<ContentItem, AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .select('*, author:profiles(*)')
        .eq('id', id)
        .single();

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_FETCH_ERROR' } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to fetch content', code: 'CONTENT_FETCH_ERROR' } };
    }
  }

  async create(content: Partial<ContentItem>): Promise<Result<ContentItem, AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .insert([content])
        .select()
        .single();

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_CREATE_ERROR' } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to create content', code: 'CONTENT_CREATE_ERROR' } };
    }
  }

  async update(id: string, content: Partial<ContentItem>): Promise<Result<ContentItem, AppError>> {
    try {
      const { data, error } = await this.supabase
        .from('content_items')
        .update(content)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_UPDATE_ERROR' } };
      }

      return { data };
    } catch (error) {
      return { error: { message: 'Failed to update content', code: 'CONTENT_UPDATE_ERROR' } };
    }
  }

  async delete(id: string): Promise<Result<boolean, AppError>> {
    try {
      const { error } = await this.supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_DELETE_ERROR' } };
      }

      return { data: true };
    } catch (error) {
      return { error: { message: 'Failed to delete content', code: 'CONTENT_DELETE_ERROR' } };
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

  async list(filters?: {
    communityId?: string;
    categoryId?: string;
    format?: string;
    accessLevel?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Result<{ items: ContentItem[]; total: number }, AppError>> {
    try {
      let query = this.supabase
        .from('content_items')
        .select('*, author:profiles(*)', { count: 'exact' });

      if (filters?.communityId) {
        query = query.eq('community_id', filters.communityId);
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.format) {
        query = query.eq('format', filters.format);
      }
      if (filters?.accessLevel) {
        query = query.eq('access_level', filters.accessLevel);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('is_featured', filters.featured);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_LIST_ERROR' } };
      }

      return { data: { items: data, total: count || 0 } };
    } catch (error) {
      return { error: { message: 'Failed to list content', code: 'CONTENT_LIST_ERROR' } };
    }
  }

  async incrementViews(id: string): Promise<Result<void, AppError>> {
    try {
      const { error } = await this.supabase.rpc('increment_content_views', { content_id_param: id });

      if (error) {
        return { error: { message: error.message, code: 'CONTENT_VIEW_ERROR' } };
      }

      return { data: undefined };
    } catch (error) {
      return { error: { message: 'Failed to increment views', code: 'CONTENT_VIEW_ERROR' } };
    }
  }
}

// Export an instance of the repository
const supabaseContentRepository = new SupabaseContentRepository();
export default supabaseContentRepository;
