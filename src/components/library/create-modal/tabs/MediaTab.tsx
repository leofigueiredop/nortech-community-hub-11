
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '../schema';
import FileUploader from '../../management/form/FileUploader';

interface MediaTabProps {
  form: UseFormReturn<ContentFormValues>;
  file: File | null;
  setFile: (file: File | null) => void;
  thumbnailFile: File | null;
  setThumbnailFile: (file: File | null) => void;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  setActiveTab: (tab: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({
  form,
  file,
  setFile,
  thumbnailFile,
  setThumbnailFile,
  previewImage,
  setPreviewImage,
  setActiveTab
}) => {
  return (
    <TabsContent value="media" className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FileUploader
            label="Content File"
            onFileChange={setFile}
            id="content-file"
            placeholder="Drag & drop or click to upload"
            helpText={`Upload your ${form.watch('format')} file`}
          />
        </div>
        
        <div>
          <FileUploader
            label="Thumbnail"
            onFileChange={setThumbnailFile}
            onPreviewChange={setPreviewImage}
            previewImage={previewImage}
            accept="image/*"
            id="thumbnail"
            placeholder="Upload thumbnail"
            helpText="PNG, JPG or GIF (recommended 16:9)"
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
          Back
        </Button>
        <Button type="button" onClick={() => setActiveTab('visibility')}>
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default MediaTab;
