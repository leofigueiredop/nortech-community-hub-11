import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';

export type StorageModule = 'branding' | 'posts' | 'events' | 'discussions' | 'profiles' | 'content';

export interface UploadOptions {
  contentType?: string;
  customFileName?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export class StorageService {
  private static BUCKET_NAME = 'community-assets';

  private static async ensureCommunityFolder(communityId: string): Promise<void> {
    try {
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

  /**
   * Upload a file to Supabase storage
   * @param file The file to upload
   * @param communityId The community ID for organization
   * @param module The module section (e.g., 'posts', 'profiles')
   * @param options Additional upload options
   * @returns The public URL of the uploaded file
   */
  static async uploadFile(
    file: File,
    communityId: string,
    module: StorageModule,
    options?: UploadOptions
  ): Promise<string | null> {
    try {
      if (!file) return null;
      
      // Construct the path: community-id/module/filename
      const path = `${communityId}/${module}`;
      const fileExtension = file.name.split('.').pop();
      const fileName = options?.customFileName || 
        `${Date.now()}-${uuidv4().substring(0, 8)}.${fileExtension}`;
      const fullPath = `${path}/${fileName}`;
      
      // Ensure the community folder exists
      await this.ensureCommunityFolder(communityId);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fullPath, file, {
          contentType: options?.contentType || file.type,
          upsert: true,
          cacheControl: '3600',
          ...(options?.metadata ? { customMetadata: options.metadata } : {})
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fullPath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Delete a file from Supabase storage
   * @param url The full URL or path of the file to delete
   * @returns Success status
   */
  static async deleteFile(url: string): Promise<boolean> {
    try {
      if (!url) return false;
      
      // Extract the path from the URL
      let path = url;
      if (url.includes(this.BUCKET_NAME)) {
        const urlParts = url.split(`${this.BUCKET_NAME}/`);
        path = urlParts.length > 1 ? urlParts[1] : url;
      }
      
      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * List files in a specific community module
   * @param communityId The community ID
   * @param module The module to list files from
   * @returns Array of file names
   */
  static async listFiles(
    communityId: string, 
    module: StorageModule
  ): Promise<string[]> {
    try {
      const path = `${communityId}/${module}`;
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(path);
      
      if (error) throw error;
      
      return data
        .filter(file => !file.name.startsWith('.')) // Filter out placeholders
        .map(file => file.name);
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Get the URL for a file
   * @param communityId The community ID
   * @param module The module containing the file
   * @param fileName The file name
   * @returns The public URL
   */
  static getFileUrl(
    communityId: string,
    module: StorageModule,
    fileName: string
  ): string {
    const path = `${communityId}/${module}/${fileName}`;
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
} 