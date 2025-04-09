
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tag, Users } from 'lucide-react';

interface CapacityPointsSectionProps {
  eventData: {
    capacity: number;
    points: number;
    badgeEnabled: boolean;
    badgeName: string;
  };
  handleInputChange: (name: string, value: any) => void;
}

const CapacityPointsSection: React.FC<CapacityPointsSectionProps> = ({ 
  eventData, 
  handleInputChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Capacity & Points</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="capacity">Maximum Capacity</Label>
          <div className="flex items-center border rounded-md pl-2">
            <Users className="h-4 w-4 opacity-50" />
            <Input 
              id="capacity" 
              type="number"
              min="1"
              value={eventData.capacity.toString()}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
              placeholder="How many attendees?"
              className="border-0"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="points">Points for Attendance</Label>
          <Input 
            id="points" 
            type="number"
            min="0"
            value={eventData.points.toString()}
            onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
            placeholder="How many points for attending?"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="badge"
          checked={eventData.badgeEnabled}
          onCheckedChange={(checked) => handleInputChange('badgeEnabled', checked)}
        />
        <Label htmlFor="badge">Award attendance badge</Label>
      </div>
      
      {eventData.badgeEnabled && (
        <div className="grid gap-2">
          <Label htmlFor="badgeName">Badge Name</Label>
          <div className="flex items-center border rounded-md pl-2">
            <Tag className="h-4 w-4 opacity-50" />
            <Input 
              id="badgeName" 
              value={eventData.badgeName}
              onChange={(e) => handleInputChange('badgeName', e.target.value)}
              placeholder={`${eventData.badgeName || 'Event'} Attendee`}
              className="border-0"
            />
          </div>
        </div>
      )}
      
      <Separator />
    </div>
  );
};

export default CapacityPointsSection;
