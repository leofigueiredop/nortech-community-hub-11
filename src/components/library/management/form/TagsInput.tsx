
import React, { useState, useEffect } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Tag } from 'lucide-react';

interface TagsInputProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
}

const TagsInput: React.FC<TagsInputProps> = ({
  selectedTags,
  setSelectedTags,
  allTags
}) => {
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  
  // Auto-suggest tags based on input
  useEffect(() => {
    if (tagInput.trim()) {
      const inputLower = tagInput.toLowerCase();
      const filtered = allTags.filter(tag => 
        tag.toLowerCase().includes(inputLower) && 
        !selectedTags.includes(tag)
      );
      setSuggestedTags(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      // When input is empty, show popular tags that aren't already selected
      const popularTags = allTags
        .filter(tag => !selectedTags.includes(tag))
        .slice(0, 5);
      setSuggestedTags(popularTags);
    }
  }, [tagInput, allTags, selectedTags]);
  
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };
  
  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="mt-4">
      <div className="flex items-center mb-2">
        <FormLabel className="flex items-center">
          <Tag size={16} className="mr-2 text-purple-500" />
          Tags
        </FormLabel>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map(tag => (
          <Badge 
            key={tag} 
            variant="default" 
            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-white opacity-70 hover:opacity-100"
              aria-label={`Remove ${tag} tag`}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex">
        <Input
          placeholder="Add a tag (e.g., AI, Finance, Crypto)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          className="mr-2"
        />
        <Button type="button" onClick={addTag} variant="outline">
          Add
        </Button>
      </div>
      
      {suggestedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 border-purple-300"
                onClick={() => {
                  handleSelectTag(tag);
                  setTagInput('');
                }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsInput;
