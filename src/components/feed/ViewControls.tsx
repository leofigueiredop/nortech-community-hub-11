import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronDown, PlusCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/context/AuthContext';

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
  const { loading } = useUserRole();
  const { user } = useAuth();
  
  // Qualquer usuário autenticado pode criar posts
  const canCreatePost = !!user;
  
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DropdownMenuItem onClick={() => onViewChange('all')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            View All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('free')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            View as Free Member
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('premium')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            View as Premium Member
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('mentor')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            View as Mentor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Show loading state while determining permissions */}
      {loading ? (
        <Button 
          disabled
          className="bg-gray-300 dark:bg-gray-700 text-white flex gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <Loader2 size={isMobile ? 16 : 18} className="animate-spin" />
          {!isMobile && "Loading..."}
        </Button>
      ) : canCreatePost && (
        <Button 
          onClick={onCreatePost}
          className="bg-purple-600 hover:bg-purple-700 text-white flex gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <PlusCircle size={isMobile ? 16 : 18} />
          {!isMobile && "Create post"}
          {isMobile && "Post"}
        </Button>
      )}
    </div>
  );
};

export default ViewControls;
