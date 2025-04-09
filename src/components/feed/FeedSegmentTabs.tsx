
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Rss, Star, Users } from 'lucide-react';

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
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <Tabs 
        value={activeSegment} 
        onValueChange={setActiveSegment}
        className="w-full"
      >
        <TabsList className="w-full justify-start bg-transparent">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 py-2 h-12"
          >
            <Rss className="h-4 w-4 mr-2" />
            All Content
          </TabsTrigger>
          
          <TabsTrigger 
            value="free" 
            className="data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 py-2 h-12"
          >
            <Users className="h-4 w-4 mr-2" />
            Free Zone
          </TabsTrigger>
          
          <TabsTrigger 
            value="premium" 
            className="data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 py-2 h-12"
          >
            <Lock className="h-4 w-4 mr-2" />
            Premium Zone
          </TabsTrigger>
          
          <TabsTrigger 
            value="mentor" 
            className="data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-4 py-2 h-12"
          >
            <Star className="h-4 w-4 mr-2" />
            Mentor Zone
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeSegment === 'premium' && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm text-purple-700 dark:text-purple-400">
              Premium content requires an active subscription
            </span>
          </div>
          <a 
            href="/settings/subscriptions" 
            className="text-xs font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View Plans
          </a>
        </div>
      )}
    </div>
  );
};

export default FeedSegmentTabs;
