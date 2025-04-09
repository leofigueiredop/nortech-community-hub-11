
import React from 'react';
import { Button } from '@/components/ui/button';

interface SpacesSidebarProps {
  spaces: { id: string; name: string }[];
  activeSpace: string;
  onSpaceChange: (space: string) => void;
}

const SpacesSidebar: React.FC<SpacesSidebarProps> = ({ 
  spaces, 
  activeSpace, 
  onSpaceChange 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 font-medium border-b border-gray-200 dark:border-gray-700">
        Spaces
      </div>
      <div className="p-2">
        {spaces.map(space => (
          <Button
            key={space.id}
            variant="ghost"
            className={`w-full justify-start mb-1 ${
              activeSpace === space.id 
                ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'
            }`}
            onClick={() => onSpaceChange(space.id)}
          >
            {space.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SpacesSidebar;
