
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronDown, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';

interface ViewControlsProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreatePost: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ 
  currentView, 
  onViewChange, 
  onCreatePost 
}) => {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-transparent border-gray-700 text-gray-200 flex items-center gap-2">
            <Eye size={16} />
            {!isMobile ? (
              <>
                {currentView === 'all' ? 'View All' : 
                 currentView === 'free' ? 'View as Free Member' : 
                 currentView === 'premium' ? 'View as Premium Member' : 
                 'View as Mentor'}
              </>
            ) : (
              <span>View</span>
            )}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
          <DropdownMenuItem onClick={() => onViewChange('all')} className="hover:bg-gray-700">
            View All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('free')} className="hover:bg-gray-700">
            View as Free Member
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('premium')} className="hover:bg-gray-700">
            View as Premium Member
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('mentor')} className="hover:bg-gray-700">
            View as Mentor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        onClick={onCreatePost}
        className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
        size={isMobile ? "sm" : "default"}
      >
        <PlusCircle size={isMobile ? 16 : 18} />
        {!isMobile && "Create post"}
        {isMobile && "Post"}
      </Button>
    </div>
  );
};

export default ViewControls;
