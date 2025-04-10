
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UnlockIcon, LockIcon, LayersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedSegmentTabsProps {
  activeSegment: string;
  setActiveSegment: (segment: string) => void;
  spaceOptions: { id: string; name: string }[];
  activeSpace: string;
  onSpaceChange: (space: string) => void;
}

const FeedSegmentTabs: React.FC<FeedSegmentTabsProps> = ({ 
  activeSegment, 
  setActiveSegment,
  spaceOptions,
  activeSpace,
  onSpaceChange
}) => {
  // Filter spaces based on segment
  const getFilteredSpaces = () => {
    if (activeSegment === 'free') {
      return spaceOptions.filter(space => 
        space.id === 'all' || 
        space.id === 'announcements' || 
        space.id === 'general' || 
        space.id === 'free'
      );
    } else if (activeSegment === 'premium') {
      return spaceOptions.filter(space => 
        space.id === 'all' || 
        space.id === 'premium' || 
        space.id === 'mentorship'
      );
    }
    return spaceOptions;
  };

  return (
    <div className="w-full mb-6">
      <Tabs 
        value={activeSegment} 
        onValueChange={setActiveSegment}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-background border shadow-sm mb-4">
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
          >
            <LayersIcon size={16} />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger 
            value="free" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
          >
            <UnlockIcon size={16} />
            <span>Free</span>
          </TabsTrigger>
          <TabsTrigger 
            value="premium" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
          >
            <LockIcon size={16} />
            <span>Premium</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
          {spaceOptions.map(space => (
            <Button
              key={space.id}
              variant="ghost"
              size="sm"
              className={`mb-1 ${
                activeSpace === space.id 
                ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'
              }`}
              onClick={() => onSpaceChange(space.id)}
            >
              {space.name}
            </Button>
          ))}
        </TabsContent>

        <TabsContent value="free" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
          {getFilteredSpaces().filter(space => space.id === 'all' || space.id === 'announcements' || space.id === 'general' || space.id === 'free').map(space => (
            <Button
              key={space.id}
              variant="ghost"
              size="sm"
              className={`mb-1 ${
                activeSpace === space.id 
                ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'
              }`}
              onClick={() => onSpaceChange(space.id)}
            >
              {space.name}
            </Button>
          ))}
        </TabsContent>

        <TabsContent value="premium" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
          {getFilteredSpaces().filter(space => space.id === 'all' || space.id === 'premium' || space.id === 'mentorship').map(space => (
            <Button
              key={space.id}
              variant="ghost"
              size="sm"
              className={`mb-1 ${
                activeSpace === space.id 
                ? 'bg-gray-100 dark:bg-gray-700 font-medium' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'
              }`}
              onClick={() => onSpaceChange(space.id)}
            >
              {space.name}
            </Button>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedSegmentTabs;
