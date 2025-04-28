import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  SlidersHorizontal,
  Search,
  CheckCircle2,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DiscussionFilter } from '@/types/discussion';

interface DiscussionFiltersProps {
  topicId: string;
  onFilterChange: (filters: DiscussionFilter[]) => void;
}

export default function DiscussionFilters({
  topicId,
  onFilterChange
}: DiscussionFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<DiscussionFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for filters
  const discussionFormats = ['question', 'discussion', 'announcement'];
  const discussionStatuses = ['open', 'closed', 'pending'];
  const discussionTags = ['help', 'advice', 'feedback', 'general', 'ideas'];

  useEffect(() => {
    onFilterChange(activeFilters);
  }, [activeFilters, onFilterChange]);

  const handleFormatFilter = (format: string, active: boolean) => {
    if (active) {
      setActiveFilters(prev => [...prev, {
        id: `format-${format}`,
        type: 'format',
        value: format,
        label: format.charAt(0).toUpperCase() + format.slice(1)
      }]);
    } else {
      setActiveFilters(prev => 
        prev.filter(f => !(f.type === 'format' && f.value === format))
      );
    }
  };

  const handleStatusFilter = (status: string, active: boolean) => {
    if (active) {
      setActiveFilters(prev => [...prev, {
        id: `status-${status}`,
        type: 'status',
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1)
      }]);
    } else {
      setActiveFilters(prev => 
        prev.filter(f => !(f.type === 'status' && f.value === status))
      );
    }
  };

  const handleTagFilter = (tag: string, active: boolean) => {
    if (active) {
      setActiveFilters(prev => [...prev, {
        id: `tag-${tag}`,
        type: 'tag',
        value: tag,
        label: tag
      }]);
    } else {
      setActiveFilters(prev => 
        prev.filter(f => !(f.type === 'tag' && f.value === tag))
      );
    }
  };

  return (
    <div className="w-full">
      {/* Search Filter */}
      <div className="mb-4">
        <Label htmlFor="search">
          <Search className="mr-2 h-4 w-4 inline-block" />
          Search Discussions
        </Label>
        <Input
          type="search"
          id="search"
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1"
        />
      </div>

      <Separator className="mb-4" />

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <Label>Active Filters:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {activeFilters.map(filter => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  if (filter.type === 'format') {
                    handleFormatFilter(filter.value, false);
                  } else if (filter.type === 'status') {
                    handleStatusFilter(filter.value, false);
                  } else if (filter.type === 'tag') {
                    handleTagFilter(filter.value, false);
                  }
                }}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Accordion Filters */}
      <Accordion type="multiple" collapsible className="w-full">
        {/* Format Filter */}
        <AccordionItem value="format">
          <AccordionTrigger>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Format
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {discussionFormats.map(format => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${format}`}
                    checked={activeFilters.some(f => f.type === 'format' && f.value === format)}
                    onCheckedChange={(checked) => handleFormatFilter(format, checked)}
                  />
                  <Label htmlFor={`format-${format}`} className="capitalize">{format}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filter */}
        <AccordionItem value="status">
          <AccordionTrigger>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Status
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {discussionStatuses.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={activeFilters.some(f => f.type === 'status' && f.value === status)}
                    onCheckedChange={(checked) => handleStatusFilter(status, checked)}
                  />
                  <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags Filter */}
        <AccordionItem value="tags">
          <AccordionTrigger>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h7.455a3 3 0 012.122.879l4.5 4.5A3 3 0 0119 15v1a2 2 0 01-2 2h-1v-1.586a3 3 0 00-3-3H5a3 3 0 00-3 3V19h-1a2 2 0 01-2-2v-1a3 3 0 013-3zm6.121-2.121a1.5 1.5 0 012.122 0l2.121 2.121a1.5 1.5 0 010 2.122L12.364 9.5A1.5 1.5 0 0110.243 7.379L12.364 5.258z"
                clipRule="evenodd"
              />
            </svg>
            Tags
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {discussionTags.map(tag => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={activeFilters.some(f => f.type === 'tag' && f.value === tag)}
                    onCheckedChange={(checked) => handleTagFilter(tag, checked)}
                  />
                  <Label htmlFor={`tag-${tag}`} className="capitalize">{tag}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
