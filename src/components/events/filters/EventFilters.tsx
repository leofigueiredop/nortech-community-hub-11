import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EventType, EVENT_TYPES } from '@/components/events/types/EventTypes';

interface EventFiltersProps {
  selectedPremiumFilter: 'all' | 'premium' | 'free';
  setSelectedPremiumFilter: (filter: 'all' | 'premium' | 'free') => void;
  selectedTypeFilters: EventType[];
  setSelectedTypeFilters: (types: EventType[]) => void;
  showAvailableOnly: boolean;
  setShowAvailableOnly: (show: boolean) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedPremiumFilter,
  setSelectedPremiumFilter,
  selectedTypeFilters,
  setSelectedTypeFilters,
  showAvailableOnly,
  setShowAvailableOnly,
}) => {
  // Use main event types for filters
  const mainEventTypes: EventType[] = ['workshop', 'webinar', 'meetup', 'conference'];
  
  const toggleEventType = (type: EventType) => {
    if (selectedTypeFilters.includes(type)) {
      setSelectedTypeFilters(selectedTypeFilters.filter(t => t !== type));
    } else {
      setSelectedTypeFilters([...selectedTypeFilters, type]);
    }
  };

  return (
    <div className="bg-card/40 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Access:</span>
        <Badge
          variant={selectedPremiumFilter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedPremiumFilter('all')}
        >
          All Events
        </Badge>
        <Badge
          variant={selectedPremiumFilter === 'free' ? 'default' : 'outline'}
          className={`cursor-pointer ${selectedPremiumFilter === 'free' ? '' : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'}`}
          onClick={() => setSelectedPremiumFilter('free')}
        >
          Free Events
        </Badge>
        <Badge
          variant={selectedPremiumFilter === 'premium' ? 'default' : 'outline'}
          className={`cursor-pointer ${selectedPremiumFilter === 'premium' ? '' : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
          onClick={() => setSelectedPremiumFilter('premium')}
        >
          Premium Events
        </Badge>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Types:</span>
        {mainEventTypes.map(type => (
          <Badge
            key={type}
            variant={selectedTypeFilters.includes(type) ? 'default' : 'outline'}
            className={`cursor-pointer ${
              selectedTypeFilters.includes(type) ? '' : EVENT_TYPES[type].color
            }`}
            onClick={() => toggleEventType(type)}
          >
            {EVENT_TYPES[type].icon}
            <span className="ml-1">{EVENT_TYPES[type].label}</span>
          </Badge>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={showAvailableOnly}
            onCheckedChange={setShowAvailableOnly}
            id="available-filter"
          />
          <label 
            htmlFor="available-filter" 
            className="text-sm font-medium cursor-pointer"
          >
            Show available events only
          </label>
        </div>
      </div>
    </div>
  );
};

export default EventFilters; 