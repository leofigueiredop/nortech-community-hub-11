
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CreateContentButtonProps {
  onClick: () => void;
}

const CreateContentButton: React.FC<CreateContentButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onClick} 
              size="lg" 
              className="rounded-full w-14 h-14 shadow-lg"
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Create Content</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Create New Content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CreateContentButton;
