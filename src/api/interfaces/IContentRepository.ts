
import { ContentItem } from '@/types/library';

export interface IContentRepository {
  getAll(): Promise<ContentItem[]>;
  getById(id: string): Promise<ContentItem>;
  create(content: Partial<ContentItem>): Promise<ContentItem>;
  update(id: string, content: Partial<ContentItem>): Promise<ContentItem>;
  delete(id: string): Promise<void>;
}
