
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface LibraryHeaderProps {
  premiumContentCount: number;
  onToggleFilters: () => void;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ 
  premiumContentCount,
  onToggleFilters
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground">
            Explore our curated collection of resources
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {premiumContentCount > 0 && (
            <Badge variant="outline" className="border-amber-500 text-amber-500">
              {premiumContentCount} Premium Items
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onToggleFilters}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LibraryHeader;
