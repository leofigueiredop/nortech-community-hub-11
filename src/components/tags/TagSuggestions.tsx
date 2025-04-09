
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContentCard from '@/components/library/ContentCard';
import { ContentItem } from '@/types/library';
import { Tag } from 'lucide-react';

interface TagSuggestionsProps {
  visitedTags: string[];
  allContent: ContentItem[];
  onItemSelect: (item: ContentItem) => void;
}

const TagSuggestions: React.FC<TagSuggestionsProps> = ({ 
  visitedTags, 
  allContent,
  onItemSelect
}) => {
  const suggestedContent = useMemo(() => {
    if (visitedTags.length === 0) return [];
    
    // Find content that has tags matching the user's interests
    // but that they haven't likely seen
    const suggestions = allContent.filter(item => {
      // Must have at least one tag in common with user interests
      const hasMatchingTag = item.tags.some(tag => visitedTags.includes(tag));
      
      // Should be premium content to promote
      const isPremiumContent = item.accessLevel === 'premium';
      
      return hasMatchingTag && isPremiumContent;
    });
    
    // Return a random selection of up to 3 suggestions
    return suggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [visitedTags, allContent]);
  
  if (suggestedContent.length === 0) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 mb-8">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Tag className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
          <h3 className="font-medium">Recommended for you</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Based on your interest in {visitedTags.map(tag => `#${tag}`).join(', ')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedContent.map(item => (
            <ContentCard key={item.id} item={item} onClick={() => onItemSelect(item)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagSuggestions;
