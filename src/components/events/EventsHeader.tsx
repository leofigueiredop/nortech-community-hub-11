
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CalendarIcon, List, Grid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getTypeFilters } from './EventTypes';

interface EventsHeaderProps {
  viewType: string;
  setViewType: (viewType: string) => void;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({ viewType, setViewType }) => {
  const { toast } = useToast();
  const typeFilters = getTypeFilters();

  const handleCreateEvent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to create events will be available in a future update.",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Events</h1>
        <div className="flex items-center gap-3">
          <div className="border rounded-lg flex overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`rounded-none ${viewType === 'calendar' ? 'bg-muted' : ''}`}
              onClick={() => setViewType('calendar')}
            >
              <CalendarIcon size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`rounded-none ${viewType === 'list' ? 'bg-muted' : ''}`}
              onClick={() => setViewType('list')}
            >
              <List size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={`rounded-none ${viewType === 'grid' ? 'bg-muted' : ''}`}
              onClick={() => setViewType('grid')}
            >
              <Grid size={16} />
            </Button>
          </div>
          <Button 
            onClick={handleCreateEvent}
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
          >
            <Plus size={16} />
            <span>New Event</span>
          </Button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap mb-4">
        {typeFilters.map(({ type, details }) => (
          <Badge 
            key={type} 
            className={`cursor-pointer ${details.color} flex items-center gap-1 mb-2 mr-2`}
          >
            {details.icon}
            {details.label}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default EventsHeader;
