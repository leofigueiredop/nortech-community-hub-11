
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyFeedProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

const EmptyFeed: React.FC<EmptyFeedProps> = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();
  
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
        <Filter className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-4">
          No matching posts found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          We couldn't find any posts matching your current filters
        </p>
        <Button 
          onClick={onClearFilters}
          variant="outline"
          className="flex gap-2"
        >
          Clear all filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-nortech-light-purple rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-center mb-4 text-nortech-dark-blue">
        Welcome to your community
      </h2>
      <p className="text-lg text-nortech-text-muted text-center mb-8">
        Your feed is where you'll see new posts
      </p>
      <Button 
        onClick={() => navigate('/create-post')}
        className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2"
      >
        <PlusCircle size={18} />
        Create post
      </Button>
    </div>
  );
};

export default EmptyFeed;
