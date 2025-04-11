
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { needsFileUpload, needsUrlInput } from '../../management/constants/contentFormOptions';
import FileUploader from '../../management/form/FileUploader';

interface MediaTabProps {
  form: UseFormReturn<any>;
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
  const contentFormat = form.watch('format');
  
  return (
    <TabsContent value="media" className="space-y-4 py-4">
      <FileUploader
        label="Thumbnail Image"
        onFileChange={setThumbnailFile}
        onPreviewChange={setPreviewImage}
        previewImage={previewImage}
        accept="image/*"
        id="thumbnail"
        placeholder="Upload thumbnail"
        helpText="PNG, JPG or GIF recommended"
      />
      
      {needsFileUpload(contentFormat) && (
        <FileUploader
          label={`${contentFormat.toUpperCase()} File`}
          onFileChange={setFile}
          id="content-file"
          placeholder={`Upload your ${contentFormat} file`}
          helpText={`Supported formats: ${contentFormat}`}
          accept={contentFormat === 'image' ? 'image/*' : contentFormat === 'audio' ? 'audio/*' : contentFormat === 'video' ? 'video/*' : '*'}
        />
      )}
      
      {needsUrlInput(contentFormat) && (
        <FormField
          control={form.control}
          name="resourceUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource URL</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
              <FormDescription>
                {contentFormat === 'youtube' && 'Enter YouTube video URL'}
                {contentFormat === 'vimeo' && 'Enter Vimeo video URL'}
                {contentFormat === 'link' && 'Enter external website URL'}
                {contentFormat === 'gdoc' && 'Enter Google Document link'}
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab('basic')}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setActiveTab('visibility')}
        >
          Next: Visibility
        </Button>
      </div>
    </TabsContent>
  );
};

export default MediaTab;
