import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useApi } from '@/hooks/useApi';
import { EventAttendee } from '@/types/events';

interface EventCheckInProps {
  eventId: number;
  onCheckIn?: (attendeeId: string) => void;
}

export function EventCheckIn({ eventId, onCheckIn }: EventCheckInProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { events } = useApi();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await events.searchAttendees(eventId, searchQuery);
      if (result.isSuccess()) {
        setAttendees(result.value);
      } else {
        toast({
          title: "Error searching attendees",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error searching attendees",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (attendeeId: string) => {
    try {
      const result = await events.checkInAttendee(eventId, attendeeId);
      if (result.isSuccess()) {
        toast({
          title: "Check-in successful",
          description: "Attendee has been checked in",
        });
        
        // Update attendee status in the list
        setAttendees(prev => prev.map(att => 
          att.user_id === attendeeId 
            ? { ...att, attended: true, status: 'attended' as const } 
            : att
        ));
        
        onCheckIn?.(attendeeId);
      } else {
        toast({
          title: "Check-in failed",
          description: result.error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search attendee by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          onClick={handleSearch}
          disabled={loading}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="space-y-2">
        {attendees.map((attendee) => (
          <div 
            key={attendee.id}
            className="flex items-center justify-between p-3 bg-card rounded-lg"
          >
            <div className="flex items-center gap-3">
              {attendee.user?.avatar_url && (
                <img 
                  src={attendee.user.avatar_url} 
                  alt={attendee.user?.name || 'Attendee'} 
                  className="h-8 w-8 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">{attendee.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Status: {attendee.status}
                </p>
              </div>
            </div>
            
            <Button
              variant={attendee.attended ? "secondary" : "default"}
              onClick={() => !attendee.attended && handleCheckIn(attendee.user_id)}
              disabled={attendee.attended}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {attendee.attended ? 'Checked In' : 'Check In'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 