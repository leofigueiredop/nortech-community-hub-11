import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { EventType, EVENT_TYPES } from './types/EventTypes';

export type EventTypeKey = EventType | 'all';

interface EventTypeFilterProps {
  selectedTypes: EventType[];
  onChange: (types: EventType[]) => void;
}

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({ 
  selectedTypes, 
  onChange 
}) => {
  // All event types
  const allTypes = Object.keys(EVENT_TYPES) as EventType[];
  
  // Toggle a single type
  const toggleType = (type: EventType) => {
    if (selectedTypes.includes(type)) {
      // If all but one type is selected, we need to keep at least one type
      if (selectedTypes.length === 1) return;
      
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };
  
  // Select all types
  const selectAll = () => {
    onChange(allTypes);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge 
        variant="outline" 
        className={`cursor-pointer hover:bg-slate-100 ${selectedTypes.length === allTypes.length ? 'bg-slate-100' : ''}`}
        onClick={selectAll}
      >
        {selectedTypes.length === allTypes.length && <Check size={12} className="mr-1" />}
        All types
      </Badge>
      
      {Object.entries(EVENT_TYPES).map(([type, details]) => (
        <Badge 
          key={type}
          variant="outline"
          className={`cursor-pointer ${
            selectedTypes.includes(type as EventType) 
              ? details.color 
              : 'hover:bg-slate-100'
          }`}
          onClick={() => toggleType(type as EventType)}
        >
          {selectedTypes.includes(type as EventType) && <Check size={12} className="mr-1" />}
          {details.icon}
          {details.label}
        </Badge>
      ))}
    </div>
  );
};

export default EventTypeFilter;
