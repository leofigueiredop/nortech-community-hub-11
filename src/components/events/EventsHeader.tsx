
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Grid, List, Plus } from 'lucide-react';

type ViewType = 'calendar' | 'list' | 'grid';

interface EventsHeaderProps {
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({ viewType, setViewType }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Discover and attend upcoming community events
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex rounded-md shadow-sm">
          <Button
            variant={viewType === 'calendar' ? 'default' : 'outline'}
            size="sm"
            className="rounded-l-md rounded-r-none"
            onClick={() => setViewType('calendar')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'outline'}
            size="sm"
            className="rounded-none border-x-0"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="sm"
            className="rounded-r-md rounded-l-none"
            onClick={() => setViewType('grid')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
        </div>
        
        <Link to="/events/create">
          <Button className="w-full sm:w-auto bg-nortech-purple hover:bg-nortech-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventsHeader;
