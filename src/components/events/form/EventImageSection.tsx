
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

interface EventImageSectionProps {
  eventData: {
    image: File | null;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventImageSection: React.FC<EventImageSectionProps> = ({ 
  eventData, 
  handleFileChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Image</h3>
      
      <div className="grid gap-2">
        <Label htmlFor="image">Upload Cover Image</Label>
        <div className="flex items-center gap-4">
          <div className="border border-dashed rounded-lg p-4 flex-1">
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <Image className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {eventData.image ? eventData.image.name : 'Drag & drop or click to upload'}
              </p>
              <Input 
                id="image" 
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image')?.click()}
              >
                Choose File
              </Button>
            </div>
          </div>
          
          {eventData.image && (
            <div className="h-32 w-32 rounded overflow-hidden">
              <img 
                src={URL.createObjectURL(eventData.image)} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventImageSection;
