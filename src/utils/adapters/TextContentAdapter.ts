import { BaseContentAdapter, ContentItem, ContentMetadata, ContentType } from '@/types/content';

interface TextContentMetadata extends ContentMetadata {
  wordCount?: number;
  readingTime?: number;
  language?: string;
  format: 'text';
}

export class TextContentAdapter extends BaseContentAdapter<TextContentMetadata> {
  type: ContentType = 'text';

  async validate(content: Partial<ContentItem>): Promise<boolean> {
    await super.validate(content);
    
    if (!content.metadata?.content) {
      throw new Error('Text content is required');
    }
    
    return true;
  }

  async transform(content: Partial<ContentItem>): Promise<ContentItem> {
    const metadata = await this.extractMetadata(content.metadata?.content || '');
    
    return {
      ...content,
      metadata: {
        ...content.metadata,
        ...metadata,
        format: this.type,
      },
      slug: content.slug || this.generateSlug(content.metadata?.title || ''),
      version: content.version || 1,
      status: content.status || 'draft',
      accessLevel: content.accessLevel || 'free',
    } as ContentItem;
  }

  async extractMetadata(content: string): Promise<TextContentMetadata> {
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute
    
    return {
      format: 'text' as const,
      wordCount,
      readingTime,
      language: 'en', // Could be enhanced with language detection
      fileSize: new Blob([content]).size,
    };
  }

  async generatePreview(content: ContentItem): Promise<string> {
    const textContent = content.metadata?.content || '';
    const words = textContent.trim().split(/\s+/);
    const preview = words.slice(0, 50).join(' ');
    
    return preview + (words.length > 50 ? '...' : '');
  }

  getStorageConfig() {
    return {
      allowedMimeTypes: ['text/plain', 'text/markdown', 'text/html'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      storagePrefix: 'text',
    };
  }
} 