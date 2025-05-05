import { supabase } from '@/lib/supabase';

export type StorageModule = 'branding' | 'posts' | 'events' | 'discussions';

export class StorageService {
  private static BUCKET_NAME = 'community-assets';

  private static async ensureCommunityFolder(communityId: string): Promise<void> {
    try {
      // Try to list files in the community folder to check if it exists
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${communityId}`);

      if (error) {
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
    module: StorageModule, 
    communityId: string,
    options?: { 
      customFileName?: string,
      contentType?: string 
    }
  ): Promise<string> {
    try {
      // Ensure community folder exists
      await this.ensureCommunityFolder(communityId);

      // Create unique file name if not provided
      const fileExt = file.name.split('.').pop();
      const fileName = options?.customFileName || `${Date.now()}.${fileExt}`;

      // Construct the full path
      const filePath = module === 'branding' 
        ? `${communityId}/${fileName}` // branding files in community root
        : `${communityId}/${module}/${fileName}`; // other modules in subfolders

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          contentType: options?.contentType,
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async deleteFile(communityId: string, module: StorageModule, fileName: string): Promise<void> {
    try {
      const filePath = module === 'branding'
        ? `${communityId}/${fileName}`
        : `${communityId}/${module}/${fileName}`;

      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
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