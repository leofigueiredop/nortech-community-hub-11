
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/api/config';
import { toast } from '@/components/ui/use-toast';

const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

export const uploadFile = async (
  file: File, 
  bucket: string = 'public', 
  path: string = ''
): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const fullPath = path ? `${path}/${fileName}` : fileName;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(fullPath, file);
    
    if (error) throw error;
    
    // Get the public URL
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(fullPath).data.publicUrl;
    
    console.log(`File uploaded: ${publicUrl}`);
    return publicUrl;
    
  } catch (error) {
    console.error('Error uploading file:', error);
    toast({
      title: "Upload failed",
      description: error instanceof Error ? error.message : "Failed to upload file",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteFile = async (
  filePath: string,
  bucket: string = 'public'
): Promise<boolean> => {
  try {
    if (!filePath) return false;
    
    // Extract file path from URL if it's a full URL
    let path = filePath;
    if (filePath.includes(bucket)) {
      const urlParts = filePath.split(bucket + '/');
      path = urlParts.length > 1 ? urlParts[1] : filePath;
    }
    
    // Delete from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) throw error;
    
    console.log(`File deleted: ${path}`);
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
};
