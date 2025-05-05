import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const EventsHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Events</h1>
        <p className="text-muted-foreground mt-1">
          Discover and join upcoming community events
        </p>
      </div>
    
      <div className="flex items-center gap-2">
        <Link to="/create-event">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus size={16} className="mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EventsHeader;
