
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface TagsInputProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
}

const TagsInput: React.FC<TagsInputProps> = ({ selectedTags, setSelectedTags, allTags }) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Suggestions are tags from allTags that aren't already selected
  const suggestions = allTags.filter(tag => !selectedTags.includes(tag)).slice(0, 5);

  return (
    <div className="space-y-2 mt-6">
      <div className="text-sm font-medium">Tags</div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1">
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="flex-grow"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleAddTag}
          disabled={!tagInput.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-1">Suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSuggestionClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsInput;
