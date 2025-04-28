
import { ContentItem, ContentCategory } from '@/types/library';

export interface IContentRepository {
  getAll(): Promise<ContentItem[]>;
  getById(id: string): Promise<ContentItem>;
  create(content: Partial<ContentItem>): Promise<ContentItem>;
  update(id: string, content: Partial<ContentItem>): Promise<ContentItem>;
  delete(id: string): Promise<void>;
  getAllCategories(): Promise<ContentCategory[]>;
  getCategoryById(id: string): Promise<ContentCategory>;
  createCategory(category: Partial<ContentCategory>): Promise<ContentCategory>;
  updateCategory(id: string, category: Partial<ContentCategory>): Promise<ContentCategory>;
  deleteCategory(id: string): Promise<void>;
  trackContentView(contentId: string, userId: string): Promise<void>;
  trackContentCompletion(contentId: string, userId: string, percentComplete: number): Promise<void>;
}
