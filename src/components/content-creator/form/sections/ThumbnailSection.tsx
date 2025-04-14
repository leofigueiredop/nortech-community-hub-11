
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ThumbnailSectionProps {
  setPreviewUrl: (url: string | null) => void;
  previewUrl: string | null;
}

const ThumbnailSection: React.FC<ThumbnailSectionProps> = ({ setPreviewUrl, previewUrl }) => {
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <FormLabel>Thumbnail</FormLabel>
      <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Thumbnail Preview"
          className="mt-2 rounded-md"
          style={{ maxWidth: '200px', maxHeight: '150px' }}
        />
      )}
    </div>
  );
};

export default ThumbnailSection;
