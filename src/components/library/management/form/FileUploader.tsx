
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { uploadFile, deleteFile } from '@/utils/fileUpload';

interface FileUploaderProps {
  label: string;
  onFileChange: (file: File | null) => void;
  onPreviewChange?: (previewUrl: string | null) => void;
  previewImage?: string | null;
  accept?: string;
  id: string;
  placeholder?: string;
  helpText?: string;
  bucket?: string;
  path?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileChange,
  onPreviewChange,
  previewImage,
  accept = '*',
  id,
  placeholder = 'Click to upload',
  helpText,
  bucket = 'public',
  path = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(previewImage || null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setCurrentFile(file);
    onFileChange(file);
    
    // If it's an image, show preview immediately (local blob URL)
    if (file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      if (onPreviewChange) {
        onPreviewChange(localUrl);
      }
    }
    
    try {
      // Upload to Supabase storage
      const uploadedUrl = await uploadFile(file, bucket, path);
      
      // If upload was successful, update preview URL to the persistent storage URL
      if (uploadedUrl && onPreviewChange) {
        onPreviewChange(uploadedUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = async () => {
    // If we have a preview URL from storage, try to delete it
    if (previewUrl && !previewUrl.startsWith('blob:')) {
      try {
        // Extract filename from URL for deletion
        const urlParts = previewUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        
        // Delete the file from storage
        await deleteFile(`${path}/${filename}`, bucket);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    // Release object URL if it's a blob
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    onFileChange(null);
    setCurrentFile(null);
    setPreviewUrl(null);
    if (onPreviewChange) {
      onPreviewChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <div className="text-sm font-medium">{label}</div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 ${
          isDragging ? 'border-primary bg-primary/10' : 'border-input'
        } transition-colors cursor-pointer relative`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          id={id}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 mx-auto rounded-md object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{placeholder}</p>
            {helpText && (
              <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
