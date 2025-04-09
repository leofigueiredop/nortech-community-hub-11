
import React, { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
  id: string;
  previewImage?: string | null;
  onPreviewChange?: (preview: string | null) => void;
  placeholder?: string;
  helpText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  onFileChange,
  accept,
  id,
  previewImage,
  onPreviewChange,
  placeholder = 'Click to upload',
  helpText = 'Supports standard file formats'
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileChange(file);
      
      if (onPreviewChange) {
        const reader = new FileReader();
        reader.onload = () => {
          onPreviewChange(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  return (
    <div className="mt-4">
      <FormLabel>{label}</FormLabel>
      <div className="border-2 border-dashed border-slate-300 rounded-md p-6 mt-1 text-center">
        {previewImage ? (
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="mx-auto max-h-40 object-contain" 
            />
            <button
              type="button"
              onClick={() => {
                onFileChange(null);
                if (onPreviewChange) {
                  onPreviewChange(null);
                }
              }}
              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Input 
              type="file" 
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              id={id}
            />
            <label 
              htmlFor={id}
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-900">{placeholder}</span>
              <span className="text-xs text-slate-500 mt-1">{helpText}</span>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
