import { BaseContentAdapter, ContentItem, ContentMetadata, ContentType } from '@/types/content';

interface ImageContentMetadata extends ContentMetadata {
  dimensions: {
    width: number;
    height: number;
  };
  format: 'image';
  altText?: string;
  caption?: string;
}

export class ImageContentAdapter extends BaseContentAdapter<ImageContentMetadata> {
  type: ContentType = 'image';

  async validate(content: Partial<ContentItem>): Promise<boolean> {
    await super.validate(content);
    
    if (!content.resourceUrl && !content.metadata?.resourceUrl) {
      throw new Error('Image URL is required');
    }
    
    return true;
  }

  async transform(content: Partial<ContentItem>): Promise<ContentItem> {
    let metadata = content.metadata || {};
    
    if (content.resourceUrl && (!metadata.dimensions || !metadata.fileSize)) {
      metadata = {
        ...metadata,
        ...(await this.extractMetadata(content.resourceUrl))
      };
    }
    
    return {
      ...content,
      metadata: {
        ...metadata,
        format: this.type,
        title: metadata.title || 'Untitled Image',
      },
      slug: content.slug || this.generateSlug(metadata.title || 'untitled-image'),
      version: content.version || 1,
      status: content.status || 'draft',
      accessLevel: content.accessLevel || 'free',
    } as ContentItem;
  }

  async extractMetadata(file: File | string): Promise<ImageContentMetadata> {
    if (file instanceof File) {
      await this.validateFileType(file, this.getStorageConfig().allowedMimeTypes);
      await this.validateFileSize(file, this.getStorageConfig().maxFileSize);
      
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      const dimensions = await this.getImageDimensions(url);
      URL.revokeObjectURL(url);
      
      return {
        format: 'image' as const,
        title: file.name,
        mimeType: file.type,
        fileSize: file.size,
        dimensions,
      };
    } else {
      // If it's a URL, load the image and get its dimensions
      const dimensions = await this.getImageDimensions(file);
      return {
        format: 'image' as const,
        title: this.getFileNameFromUrl(file),
        dimensions,
      };
    }
  }

  async generatePreview(content: ContentItem): Promise<string> {
    // For images, we can use the actual image URL as preview
    // In a real implementation, you might want to generate a thumbnail
    return content.resourceUrl || content.metadata?.resourceUrl || '';
  }

  getStorageConfig() {
    return {
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
      ],
      maxFileSize: 5 * 1024 * 1024, // 5MB
      storagePrefix: 'images',
    };
  }

  private getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      return filename || 'untitled-image';
    } catch {
      return 'untitled-image';
    }
  }

  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = url;
    });
  }
} 