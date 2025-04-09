
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import { Search, Tag, Filter, Gift } from 'lucide-react';
import RewardsList from './RewardsList';
import RedemptionHistory from './RedemptionHistory';
import { Card } from '@/components/ui/card';

const PointsStore: React.FC = () => {
  const { toast } = useToast();
  const { totalPoints } = usePoints();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 border-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Your Points Balance</h2>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">{totalPoints} Points</p>
          </div>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
            <Gift className="mr-2 h-4 w-4" />
            Redeem Points
          </Button>
        </div>
      </Card>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rewards..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ebooks">E-Books</SelectItem>
                <SelectItem value="subscriptions">Subscriptions</SelectItem>
                <SelectItem value="badges">Badges</SelectItem>
                <SelectItem value="nft">NFTs</SelectItem>
                <SelectItem value="access">Access Passes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="browse">Browse Rewards</TabsTrigger>
          <TabsTrigger value="history">Redemption History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-0">
          <RewardsList 
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            sortBy={sortBy}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <RedemptionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointsStore;
