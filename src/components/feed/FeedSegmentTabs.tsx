
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnlockIcon, LockIcon, ListFilterIcon } from 'lucide-react';

interface FeedSegmentTabsProps {
  activeSegment: string;
  setActiveSegment: (segment: string) => void;
}

const FeedSegmentTabs: React.FC<FeedSegmentTabsProps> = ({ 
  activeSegment, 
  setActiveSegment 
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs 
        value={activeSegment} 
        onValueChange={setActiveSegment}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full bg-purple-100 dark:bg-slate-800">
          <TabsTrigger 
            value="all" 
            className="gap-2 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
          >
            <ListFilterIcon size={16} />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger 
            value="free" 
            className="gap-2 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
          >
            <UnlockIcon size={16} />
            <span>Free</span>
          </TabsTrigger>
          <TabsTrigger 
            value="premium" 
            className="gap-2 data-[state=active]:bg-nortech-purple data-[state=active]:text-white"
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
