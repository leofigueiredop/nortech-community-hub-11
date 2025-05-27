import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, File, FileText, FileImage, Video } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { StorageService, StorageModule } from '@/services/StorageService';
import { useAuth } from '@/context/AuthContext';
import { toast } from './use-toast';

export interface FileUploaderProps {
  label: string;
  onFileUploaded: (url: string | null) => void;
  onFileChange?: (file: File | null) => void;
  initialValue?: string | null;
  accept?: string;
  id: string;
  module: StorageModule;
  placeholder?: string;
  helpText?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  showPreview?: boolean;
  className?: string;
}

/**
 * FileUploader component for easily uploading files to Supabase storage
 */
export function FileUploader({
  label,
  onFileUploaded,
  onFileChange,
  initialValue,
  accept = '*',
  id,
  module,
  placeholder = 'Click or drag to upload',
  helpText,
  maxSizeMB = 5,
  disabled = false,
  showPreview = true,
  className = '',
}: FileUploaderProps) {
  const { user, community } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValue || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setErrorMessage(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }
    
    // Check file type if accept is specified
    if (accept && accept !== '*') {
      const fileType = file.type;
      const acceptTypes = accept.split(',').map(type => type.trim());
      
      // Check if any of the accepted types match the file type
      const isValidType = acceptTypes.some(type => {
        if (type.includes('*')) {
          // Handle wildcards like image/*
          return fileType.startsWith(type.replace('/*', '/'));
        }
        return type === fileType;
      });
      
      if (!isValidType) {
        setErrorMessage(`Invalid file type. Accepted types: ${accept}`);
        return false;
      }
    }
    
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    
    if (onFileChange) {
      onFileChange(file);
    }
    
    // Show local preview for images
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      // For non-images, remove any previous preview
      setPreviewUrl(null);
    }
    
    // Skip upload if no community yet (e.g. during onboarding)
    if (!community || !user) {
      console.warn('Community or user missing, skipping upload to Supabase');
      // Still notify parent with null URL
      onFileUploaded(null);
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload to Supabase storage
      const uploadedUrl = await StorageService.uploadFile(
        file,
        community.id,
        module
      );
      
      // Update preview with the permanent URL for images
      if (file.type.startsWith('image/') && uploadedUrl) {
        setPreviewUrl(uploadedUrl);
      }
      
      // Notify parent component
      onFileUploaded(uploadedUrl);
      
      if (uploadedUrl) {
        toast({
          title: 'Upload successful',
          description: `File "${file.name}" uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Upload failed. Please try again.');
      
      // Notify parent of failure
      onFileUploaded(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = async () => {
    setErrorMessage(null);
    
    // Revoke object URLs to prevent memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Try to delete the file from Supabase if it's not a local preview
    if (previewUrl && !previewUrl.startsWith('blob:') && community) {
      try {
        await StorageService.deleteFile(previewUrl);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    // Reset state
    setPreviewUrl(null);
    if (onFileChange) {
      onFileChange(null);
    }
    onFileUploaded(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine the icon to show based on file type
  const getFileIcon = () => {
    if (!previewUrl) return <UploadCloud className="h-8 w-8 text-muted-foreground" />;
    
    if (previewUrl.startsWith('blob:')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    
    // Check file extension
    const extension = previewUrl.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <Video className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium">{label}</div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 ${
          isDragging 
            ? 'border-primary bg-primary/10' 
            : disabled 
              ? 'border-muted bg-muted/20 cursor-not-allowed' 
              : 'border-input hover:border-primary/50 cursor-pointer'
        } transition-colors relative ${disabled ? 'pointer-events-none opacity-60' : ''}`}
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
          disabled={disabled}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : previewUrl && previewUrl.match(/\.(jpeg|jpg|gif|png)$/) && showPreview ? (
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
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            {previewUrl ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  {getFileIcon()}
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {previewUrl.split('/').pop()}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Click to replace</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{placeholder}</p>
                {helpText && (
                  <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {errorMessage && (
        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
      )}
    </div>
  );
} 