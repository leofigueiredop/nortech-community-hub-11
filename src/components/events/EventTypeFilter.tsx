
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { EVENT_TYPES } from './EventTypes';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';

export type EventTypeKey = keyof typeof EVENT_TYPES;

interface EventTypeFilterProps {
  selectedTypes: EventTypeKey[];
  onChange: (types: EventTypeKey[]) => void;
}

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({ selectedTypes, onChange }) => {
  const allEventTypes = Object.entries(EVENT_TYPES) as [EventTypeKey, typeof EVENT_TYPES[EventTypeKey]][];
  
  const handleToggleType = (type: EventTypeKey) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleSelectAll = () => {
    onChange(allEventTypes.map(([type]) => type));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const allSelected = selectedTypes.length === allEventTypes.length;
  const someSelected = selectedTypes.length > 0 && !allSelected;

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 ${someSelected ? 'border-nortech-purple text-nortech-purple' : ''}`}
          >
            <Filter size={16} />
            <span>Filter by type</span>
            {someSelected && (
              <Badge variant="secondary" className="ml-1 bg-nortech-purple/10 text-nortech-purple">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Event Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={handleSelectAll}
              >
                Select all
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {allEventTypes.map(([type, details]) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleToggleType(type)}
              className="gap-2"
            >
              <div className="flex items-center gap-2">
                <Badge className={`${details.color} flex items-center h-6`}>
                  {details.icon}
                  {details.label}
                </Badge>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {selectedTypes.map(type => {
            const details = EVENT_TYPES[type];
            return (
              <Badge 
                key={type}
                className={`${details.color} flex items-center cursor-pointer`}
                onClick={() => handleToggleType(type)}
              >
                {details.icon}
                {details.label}
                <span className="ml-1 text-xs">×</span>
              </Badge>
            );
          })}
          
          {selectedTypes.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={handleClearAll}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventTypeFilter;
