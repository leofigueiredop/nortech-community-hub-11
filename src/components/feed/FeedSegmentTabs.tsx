
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Layers, Unlock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto p-1 bg-gray-100 dark:bg-gray-800 mb-4">
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white shadow-none data-[state=active]:shadow-sm transition-all"
          >
            <Layers size={16} />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger 
            value="free" 
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white shadow-none data-[state=active]:shadow-sm transition-all"
          >
            <Unlock size={16} />
            <span>Free</span>
          </TabsTrigger>
          <TabsTrigger 
            value="premium" 
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-purple-700 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white shadow-none data-[state=active]:shadow-sm transition-all"
          >
            <Lock size={16} />
            <span>Premium</span>
          </TabsTrigger>
        </TabsList>

        {['all', 'free', 'premium'].map((segment) => (
          <TabsContent key={segment} value={segment} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 flex flex-nowrap gap-1 overflow-x-auto">
            {getFilteredSpaces()
              .filter(space => {
                if (segment === 'all') return true;
                if (segment === 'free') return space.id === 'all' || space.id === 'announcements' || space.id === 'general' || space.id === 'free';
                if (segment === 'premium') return space.id === 'all' || space.id === 'premium' || space.id === 'mentorship';
                return true;
              })
              .map(space => (
                <Button
                  key={space.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "mb-1 whitespace-nowrap",
                    activeSpace === space.id 
                      ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/70"
                  )}
                  onClick={() => onSpaceChange(space.id)}
                >
                  {space.name}
                </Button>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeedSegmentTabs;
