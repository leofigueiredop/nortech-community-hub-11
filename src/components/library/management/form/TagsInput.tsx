
import React, { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

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
      <FormLabel>Tags</FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="outline" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex">
        <Input
          placeholder="Add a tag"
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
      {allTags.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-slate-500 mb-1">Suggested tags:</p>
          <div className="flex flex-wrap gap-1">
            {allTags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => handleSelectTag(tag)}
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
