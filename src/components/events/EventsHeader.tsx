import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import CreateEventDialog from './CreateEventDialog';

const EventsHeader: React.FC = () => {
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useUserRole();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Join upcoming events or catch up on past ones
        </p>
      </div>
      
      {isOwnerOrAdmin && (
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-nortech-purple hover:bg-nortech-purple/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      )}
      
      <CreateEventDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default EventsHeader;
