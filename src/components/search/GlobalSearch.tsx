
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Search, Tag, Book, Calendar, File, MessageSquare, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSearchResults } from '@/hooks/useSearchResults';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const { results, isLoading } = useSearchResults(query);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }

      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (value: string) => {
    setQuery('');
    onOpenChange(false);
    navigate(value);
  };

  // Helper function to highlight matched text
  const highlightMatch = (text: string) => {
    if (!query || query.length < 2) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : part
        )}
      </>
    );
  };

  // Get content type icon
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare className="mr-2 h-4 w-4" />;
      case 'course':
        return <Book className="mr-2 h-4 w-4" />;
      case 'library':
        return <File className="mr-2 h-4 w-4" />;
      case 'event':
        return <Calendar className="mr-2 h-4 w-4" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  };

  // Check if query is a hashtag search
  const isHashtagSearch = query.startsWith('#');
  
  // Calculate if we have any results
  const hasResults = results.posts.length > 0 || results.courses.length > 0 || 
                    results.library.length > 0 || results.events.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput 
          placeholder="Search everything..." 
          value={query}
          onValueChange={setQuery}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <CommandList>
        {query === '' ? (
          <CommandEmpty className="py-6 text-center text-sm">
            Type to search posts, courses, library content, and events...
          </CommandEmpty>
        ) : isLoading ? (
          <div className="p-4 text-center text-sm">
            Searching...
          </div>
        ) : !hasResults ? (
          <CommandEmpty className="py-6 text-center text-sm">
            No results found for "{query}"
          </CommandEmpty>
        ) : (
          <>
            {isHashtagSearch && (
              <CommandGroup heading="Tags">
                <CommandItem
                  onSelect={() => handleSelect(`/feed?tag=${query.substring(1)}`)}
                  className="flex items-center"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Browse all content with {query}</span>
                </CommandItem>
              </CommandGroup>
            )}

            {results.posts && results.posts.length > 0 && (
              <CommandGroup heading="Posts">
                {results.posts.map((post) => (
                  <CommandItem
                    key={post.id}
                    onSelect={() => handleSelect(`/discussions/${post.id}`)}
                    className="flex flex-col items-start"
                  >
                    <div className="flex items-center w-full">
                      {getContentIcon('post')}
                      <span className="font-medium">{highlightMatch(post.title)}</span>
                    </div>
                    {post.preview && (
                      <p className="text-xs text-muted-foreground mt-1 ml-6 line-clamp-1">
                        {highlightMatch(post.preview)}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 ml-6">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.courses && results.courses.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Courses">
                  {results.courses.map((course) => (
                    <CommandItem
                      key={course.id}
                      onSelect={() => handleSelect(`/courses/${course.id}`)}
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center w-full">
                        {getContentIcon('course')}
                        <span className="font-medium">{highlightMatch(course.title)}</span>
                      </div>
                      {course.preview && (
                        <p className="text-xs text-muted-foreground mt-1 ml-6 line-clamp-1">
                          {highlightMatch(course.preview)}
                        </p>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.library && results.library.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Library">
                  {results.library.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(`/library?item=${item.id}`)}
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center w-full">
                        {getContentIcon('library')}
                        <span className="font-medium">{highlightMatch(item.title)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-6 line-clamp-1">
                        {highlightMatch(item.description)}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 ml-6">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                              #{tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{item.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.events && results.events.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Events">
                  {results.events.map((event) => (
                    <CommandItem
                      key={event.id}
                      onSelect={() => handleSelect(`/events/${event.id}`)}
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center w-full">
                        {getContentIcon('event')}
                        <span className="font-medium">{highlightMatch(event.title)}</span>
                      </div>
                      {event.date && (
                        <p className="text-xs text-muted-foreground mt-1 ml-6">
                          {event.date}
                        </p>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
