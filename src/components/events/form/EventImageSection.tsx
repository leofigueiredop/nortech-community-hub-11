
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Create a preview when a file is selected
  React.useEffect(() => {
    if (!eventData.image) {
      setPreviewUrl(null);
      return;
    }
    
    const objectUrl = URL.createObjectURL(eventData.image);
    setPreviewUrl(objectUrl);
    
    // Free memory when the component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [eventData.image]);
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Event Image</h3>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Event preview" 
                className="max-h-64 mx-auto rounded-md" 
              />
              <button
                type="button"
                onClick={() => document.getElementById('eventImage')?.click()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Image
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                Upload an image for your event
              </p>
              <p className="text-xs text-gray-400 mb-4">
                PNG, JPG, GIF up to 5MB
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('eventImage')?.click()}
              >
                Select Image
              </Button>
            </>
          )}
          <input
            type="file"
            id="eventImage"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        
        <p className="text-xs text-gray-500">
          Adding an image helps your event stand out and attract more attendees
        </p>
      </div>
    </div>
  );
};

export default EventImageSection;
