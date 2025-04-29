import { ContentItem } from '@/types/content';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';

export interface IContentRepository {
  create(content: Partial<ContentItem>): Promise<Result<ContentItem, AppError>>;
  update(id: string, content: Partial<ContentItem>): Promise<Result<ContentItem, AppError>>;
  delete(id: string): Promise<Result<boolean, AppError>>;
  getById(id: string): Promise<Result<ContentItem, AppError>>;
  list(filters?: {
    communityId?: string;
    categoryId?: string;
    format?: string;
    accessLevel?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Result<{ items: ContentItem[]; total: number }, AppError>>;
  incrementViews(id: string): Promise<Result<void, AppError>>;
}
