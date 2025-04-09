
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnlockIcon, LockIcon, LayersIcon } from 'lucide-react';

interface FeedSegmentTabsProps {
  activeSegment: string;
  setActiveSegment: (segment: string) => void;
}

const FeedSegmentTabs: React.FC<FeedSegmentTabsProps> = ({ 
  activeSegment, 
  setActiveSegment 
}) => {
  return (
    <div className="w-full mb-6">
      <Tabs 
        value={activeSegment} 
        onValueChange={setActiveSegment}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-background border shadow-sm">
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
      </Tabs>
    </div>
  );
};

export default FeedSegmentTabs;
