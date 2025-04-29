import { ContentItem } from '@/types/content';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';
import { IContentRepository } from '../interfaces/IContentRepository';
import { uploadFile, deleteFile } from '@/utils/fileUpload';

export class ContentService {
  constructor(private contentRepository: IContentRepository) {}

  async createContent(
    data: Partial<ContentItem>,
    file?: File
  ): Promise<Result<ContentItem, AppError>> {
    try {
      // Upload file if provided
      if (file) {
        const uploadResult = await uploadFile(file);
        if (typeof uploadResult === 'string') {
          data.resource_url = uploadResult;
          data.file_size = file.size;
        } else {
          return { error: { message: 'Failed to upload file', code: 'FILE_UPLOAD_ERROR' } };
        }
      }

      // Validate required fields
      if (!data.title || !data.format || !data.community_id) {
        return {
          error: {
            message: 'Missing required fields',
            code: 'VALIDATION_ERROR',
            details: {
              title: !data.title ? 'Title is required' : undefined,
              format: !data.format ? 'Format is required' : undefined,
              community_id: !data.community_id ? 'Community ID is required' : undefined,
            },
          },
        };
      }

      // Set default values
      data.views = 0;
      data.likes = 0;
      data.points_value = data.points_value || 0;
      data.completion_threshold = data.completion_threshold || 80;
      data.visibility = data.visibility || 'public';
      data.access_level = data.access_level || 'free';
      data.allow_comments = data.allow_comments ?? true;

      return await this.contentRepository.create(data);
    } catch (error) {
      return { error: { message: 'Failed to create content', code: 'CONTENT_CREATE_ERROR' } };
    }
  }

  async updateContent(
    id: string,
    data: Partial<ContentItem>,
    file?: File
  ): Promise<Result<ContentItem, AppError>> {
    try {
      // Get existing content
      const existingResult = await this.contentRepository.getById(id);
      if (existingResult.error) {
        return existingResult;
      }
      const existing = existingResult.data;

      // Handle file upload and deletion
      if (file) {
        // Delete old file if exists
        if (existing.resource_url) {
          await deleteFile(existing.resource_url);
        }

        // Upload new file
        const uploadResult = await uploadFile(file);
        if (typeof uploadResult === 'string') {
          data.resource_url = uploadResult;
          data.file_size = file.size;
        } else {
          return { error: { message: 'Failed to upload file', code: 'FILE_UPLOAD_ERROR' } };
        }
      }

      return await this.contentRepository.update(id, data);
    } catch (error) {
      return { error: { message: 'Failed to update content', code: 'CONTENT_UPDATE_ERROR' } };
    }
  }

  async deleteContent(id: string): Promise<Result<boolean, AppError>> {
    try {
      // Get content to delete associated file
      const contentResult = await this.contentRepository.getById(id);
      if (contentResult.error) {
        return contentResult;
      }

      const content = contentResult.data;
      if (content.resource_url) {
        await deleteFile(content.resource_url);
      }

      return await this.contentRepository.delete(id);
    } catch (error) {
      return { error: { message: 'Failed to delete content', code: 'CONTENT_DELETE_ERROR' } };
    }
  }

  async getContent(id: string): Promise<Result<ContentItem, AppError>> {
    try {
      const result = await this.contentRepository.getById(id);
      if (result.data) {
        // Increment views
        await this.contentRepository.incrementViews(id);
      }
      return result;
    } catch (error) {
      return { error: { message: 'Failed to fetch content', code: 'CONTENT_FETCH_ERROR' } };
    }
  }

  async listContent(filters?: {
    communityId?: string;
    categoryId?: string;
    format?: string;
    accessLevel?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Result<{ items: ContentItem[]; total: number }, AppError>> {
    return await this.contentRepository.list(filters);
  }
} 