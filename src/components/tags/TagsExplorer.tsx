
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag as TagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TagWithCount {
  name: string;
  count: number;
}

interface TagsExplorerProps {
  tags: TagWithCount[];
  title?: string;
  limit?: number;
  className?: string;
}

const TagsExplorer: React.FC<TagsExplorerProps> = ({ 
  tags, 
  title = "Trending Topics", 
  limit = 12,
  className = ""
}) => {
  const navigate = useNavigate();
  
  const sortedTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  const handleTagClick = (tag: string) => {
    navigate(`/tags/${tag}`);
  };
  
  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg border bg-card p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <TagIcon size={18} className="mr-2 text-purple-500" />
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sortedTags.map(tag => (
          <Badge 
            key={tag.name}
            variant="outline" 
            className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300 flex items-center gap-1"
            onClick={() => handleTagClick(tag.name)}
          >
            #{tag.name}
            <span className="text-xs text-muted-foreground ml-1">
              {tag.count}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagsExplorer;
