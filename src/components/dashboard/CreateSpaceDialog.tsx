
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, MessageSquare, Layers, Users, Image } from 'lucide-react';

type SpaceType = 'posts' | 'events' | 'chat' | 'course' | 'members' | 'images';

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const CreateSpaceDialog: React.FC<CreateSpaceDialogProps> = ({ 
  open, 
  onOpenChange,
  onComplete
}) => {
  const [selectedType, setSelectedType] = useState<SpaceType | null>(null);
  
  const handleNext = () => {
    if (selectedType) {
      // In a real implementation, this would create the space with the selected type
      console.log(`Creating space of type: ${selectedType}`);
      onComplete?.();
      onOpenChange(false);
    }
  };
  
  const spaceTypes = [
    { type: 'posts' as SpaceType, icon: <FileText className="h-5 w-5" />, label: 'Posts' },
    { type: 'events' as SpaceType, icon: <Calendar className="h-5 w-5" />, label: 'Events' },
    { type: 'chat' as SpaceType, icon: <MessageSquare className="h-5 w-5" />, label: 'Chat' },
    { type: 'course' as SpaceType, icon: <Layers className="h-5 w-5" />, label: 'Course' },
    { type: 'members' as SpaceType, icon: <Users className="h-5 w-5" />, label: 'Members' },
    { type: 'images' as SpaceType, icon: <Image className="h-5 w-5" />, label: 'Images' },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-700">
        <DialogTitle className="text-xl font-semibold mb-4">Choose space type</DialogTitle>
        
        <div className="grid grid-cols-2 gap-3">
          {spaceTypes.map((space) => (
            <button
              key={space.type}
              className={`flex items-center justify-center gap-2 p-3 rounded-md border transition-colors
                ${selectedType === space.type
                  ? 'border-nortech-purple bg-nortech-purple/20'
                  : 'border-gray-700 hover:border-gray-600'
                }`}
              onClick={() => setSelectedType(space.type)}
            >
              {space.icon}
              <span>{space.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full py-6 text-base font-medium rounded-full bg-white text-black hover:bg-gray-200"
            onClick={handleNext}
            disabled={!selectedType}
          >
            Next
          </Button>
        </div>
        
        <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceDialog;
