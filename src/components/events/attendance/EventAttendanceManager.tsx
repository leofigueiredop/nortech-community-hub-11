
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePoints } from '@/context/PointsContext';
import { ClipboardList, Users, Award } from 'lucide-react';
import CSVUploader from './CSVUploader';
import AttendanceList from './AttendanceList';
import BadgeAssignment from './BadgeAssignment';

interface EventAttendanceManagerProps {
  eventId: number;
  eventTitle: string;
}

const EventAttendanceManager: React.FC<EventAttendanceManagerProps> = ({
  eventId,
  eventTitle
}) => {
  const { toast } = useToast();
  const { awardPoints } = usePoints();
  const [attendees, setAttendees] = useState<string[]>([]);
  const [isAwarding, setIsAwarding] = useState(false);
  
  const handleCSVUpload = (data: string[]) => {
    setAttendees(data);
    toast({
      title: "Attendees Imported",
      description: `Successfully imported ${data.length} attendees`,
    });
  };
  
  const handleAwardPoints = () => {
    setIsAwarding(true);
    
    // Simulate awarding points (in a real app this would call an API)
    setTimeout(() => {
      toast({
        title: "Points Awarded",
        description: `Successfully awarded points to ${attendees.length} attendees for attending "${eventTitle}"`,
      });
      setIsAwarding(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <TabsList className="mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users size={16} />
            Attendance List
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <ClipboardList size={16} />
            Import Attendees
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award size={16} />
            Assign Badges
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <AttendanceList 
            attendees={attendees} 
            onUpdateAttendees={setAttendees} 
          />
        </TabsContent>
        
        <TabsContent value="import">
          <CSVUploader onUpload={handleCSVUpload} />
        </TabsContent>
        
        <TabsContent value="badges">
          <BadgeAssignment 
            eventId={eventId} 
            attendees={attendees} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between pt-4 border-t">
        <p className="text-sm text-gray-500 self-center">
          {attendees.length} attendees marked for this event
        </p>
        
        <Button 
          disabled={attendees.length === 0 || isAwarding}
          onClick={handleAwardPoints}
        >
          {isAwarding ? 'Awarding...' : 'Award Points to Attendees'}
        </Button>
      </div>
    </div>
  );
};

export default EventAttendanceManager;
