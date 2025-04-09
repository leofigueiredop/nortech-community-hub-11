
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import TagsExplorer from '@/components/tags/TagsExplorer';

interface TagType {
  name: string;
  count: number;
}

interface TagsSectionProps {
  tagsWithCount: TagType[];
  setTagFilter: (tag: string) => void;
  setActiveTab: (value: string) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({ 
  tagsWithCount, 
  setTagFilter, 
  setActiveTab 
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Browse Content by Tags</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tagsWithCount.map(tag => (
          <div 
            key={tag.name} 
            className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
            onClick={() => {
              setTagFilter(tag.name);
              setActiveTab('all');
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-purple-500">#{tag.name}</Badge>
              <span className="text-sm text-muted-foreground">{tag.count} items</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <Link to={`/tags/${tag.name}`} className="text-purple-600 hover:underline">
                View all content with this tag
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;
