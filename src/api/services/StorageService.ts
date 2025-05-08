import { supabase } from '@/lib/supabase';

export type StorageModule = 'branding' | 'posts' | 'events' | 'discussions';

interface UploadOptions {
  customFileName?: string;
  contentType?: string;
  maxSizeMB?: number;
}

export class StorageService {
  private static BUCKET_NAME = 'community-assets';

  private static async ensureCommunityFolder(communityId: string): Promise<void> {
    try {
      console.log('Ensuring community folder exists:', communityId);
      
      // Try to list files in the community folder to check if it exists
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${communityId}`);

      if (error) {
        console.log('Creating community folder with placeholder...');
        // If folder doesn't exist, create it with a placeholder file
        // Supabase doesn't support creating empty folders, so we need a placeholder
        const placeholderContent = new Blob([''], { type: 'text/plain' });
        await supabase.storage
          .from(this.BUCKET_NAME)
          .upload(`${communityId}/.placeholder`, placeholderContent);
      }
    } catch (error) {
      console.error('Error ensuring community folder:', error);
      throw error;
    }
  }

  static async uploadFile(
    file: File,
    bucket: string,
    path: string,
    options?: UploadOptions
  ): Promise<string | null> {
    try {
      console.log('Starting file upload:', {
        bucket,
        path,
        fileName: options?.customFileName || file.name,
        fileSize: file.size,
        contentType: options?.contentType
      });

      // Ensure the community folder exists
      const communityId = path.split('/')[0];
      await this.ensureCommunityFolder(communityId);

      // Construct the full path properly
      const fileName = options?.customFileName || `${Date.now()}.${file.name.split('.').pop()}`;
      const fullPath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fullPath, file, {
          contentType: options?.contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fullPath);

      console.log('Generated public URL:', publicUrl);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  static async deleteFile(communityId: string, bucket: string, fileName: string): Promise<void> {
    try {
      console.log('Deleting file:', { communityId, bucket, fileName });
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([`${communityId}/${fileName}`]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('File deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  static async listFiles(communityId: string, module?: StorageModule): Promise<string[]> {
    try {
      const path = module ? `${communityId}/${module}` : communityId;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(path);

      if (error) {
        throw error;
      }

      return data.map(file => file.name);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
} 