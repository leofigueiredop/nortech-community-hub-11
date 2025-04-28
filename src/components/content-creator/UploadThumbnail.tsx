
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface UploadThumbnailProps {
  value: string;
  onChange: (value: string) => void;
}

const UploadThumbnail: React.FC<UploadThumbnailProps> = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange('');
  };

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative rounded-md overflow-hidden">
          <img 
            src={previewUrl}
            alt="Thumbnail preview"
            className="h-40 w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-primary transition-colors">
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload thumbnail
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF up to 2MB
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            id="thumbnail-upload"
          />
          <Label
            htmlFor="thumbnail-upload"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Select Image
          </Label>
        </div>
      )}
    </div>
  );
};

export default UploadThumbnail;
