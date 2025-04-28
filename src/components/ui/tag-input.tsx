
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';
import { Input } from './input';

interface TagInputProps {
  id?: string;
  className?: string; 
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
  disabled?: boolean;
}

export function TagInput({
  id,
  className,
  placeholder = 'Add tag...',
  tags = [],
  onTagsChange,
  maxTags = 10,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the pressed key is Enter or comma
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      
      // Prevent adding more tags than maxTags
      if (tags.length >= maxTags) return;
      
      // Don't add if it already exists
      const newTag = inputValue.trim();
      if (tags.includes(newTag)) {
        setInputValue('');
        return;
      }
      
      // Add the tag
      onTagsChange([...tags, newTag]);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // If input is empty and Backspace is pressed, remove the last tag
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  return (
    <div className={`flex flex-wrap gap-2 p-1 border rounded-md ${className || ''}`}>
      {tags.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
          {tag}
          {!disabled && (
            <X 
              className="h-3 w-3 cursor-pointer hover:text-destructive" 
              onClick={() => removeTag(index)} 
            />
          )}
        </Badge>
      ))}
      
      {!disabled && tags.length < maxTags && (
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : undefined}
          className="flex-1 min-w-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
        />
      )}
    </div>
  );
}
