
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Check, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attendee {
  email: string;
  name: string;
  present: boolean;
  pointsAwarded: boolean;
}

interface BadgeAssignmentProps {
  eventId: number;
  attendees: Attendee[];
  eventTitle: string;
}

const BadgeAssignment: React.FC<BadgeAssignmentProps> = ({ 
  eventId, 
  attendees,
  eventTitle
}) => {
  const { toast } = useToast();
  const [awardingBadges, setAwardingBadges] = useState(false);
  
  const availableBadges = [
    { id: 1, name: "Event Attendee", description: "Awarded for attending any event" },
    { id: 2, name: `${eventTitle} Participant`, description: "Specific badge for this event" },
    { id: 3, name: "Active Member", description: "For members who attend 5+ events" }
  ];
  
  const handleAssignBadges = () => {
    setAwardingBadges(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Badges Assigned",
        description: `Successfully assigned badges to ${attendees.filter(a => a.present).length} attendees`,
      });
      setAwardingBadges(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availableBadges.map((badge) => (
          <Card key={badge.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Award className="h-4 w-4 mr-2 text-nortech-purple" />
                {badge.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{badge.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 mb-4">
          Badges will be awarded to all {attendees.filter(a => a.present).length} present attendees.
        </p>
        
        <Button 
          onClick={handleAssignBadges} 
          disabled={awardingBadges || attendees.filter(a => a.present).length === 0}
        >
          {awardingBadges ? (
            <>Assigning badges...</>
          ) : (
            <>
              <Award className="h-4 w-4 mr-2" />
              Assign Badges to Attendees
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BadgeAssignment;
