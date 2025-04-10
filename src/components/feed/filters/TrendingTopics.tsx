
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TrendingTopicsProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  popularTags: string[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({
  selectedTags,
  toggleTag,
  clearTags,
  popularTags
}) => {
  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-500" />
            <span className="text-sm font-medium">Trending Topics</span>
          </div>
          <Link 
            to="/tags" 
            className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            View all
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"} 
              className={`cursor-pointer ${
                selectedTags.includes(tag) 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-200'
              }`}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Only show active filters when there are any */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center mt-4">
          <span className="text-sm font-medium">Active:</span>
          {selectedTags.map(tag => (
            <Badge 
              key={tag}
              variant="default" 
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer flex items-center gap-1"
            >
              #{tag}
              <button onClick={() => toggleTag(tag)} className="ml-1">
                <X size={14} />
              </button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 ml-auto"
            onClick={clearTags}
          >
            Clear All
          </Button>
        </div>
      )}
    </>
  );
};

export default TrendingTopics;
