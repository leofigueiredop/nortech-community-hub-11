
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Globe, Link, MapPin } from 'lucide-react';

interface DateLocationSectionProps {
  eventData: {
    date: Date;
    startTime: string;
    endTime: string;
    isOnline: boolean;
    platform: string;
    meetingLink: string;
    location: string;
  };
  handleInputChange: (name: string, value: any) => void;
}

const DateLocationSection: React.FC<DateLocationSectionProps> = ({ 
  eventData, 
  handleInputChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Date & Location</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Date</Label>
          <DatePicker
            date={eventData.date}
            setDate={(date) => handleInputChange('date', date)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label>Time</Label>
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <TimePicker
                value={eventData.startTime}
                onChange={(value) => handleInputChange('startTime', value)}
              />
            </div>
            <span className="opacity-50">to</span>
            <div className="flex-1">
              <TimePicker
                value={eventData.endTime}
                onChange={(value) => handleInputChange('endTime', value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 my-4">
        <Switch
          id="isOnline"
          checked={eventData.isOnline}
          onCheckedChange={(checked) => handleInputChange('isOnline', checked)}
        />
        <Label htmlFor="isOnline">This is an online event</Label>
      </div>
      
      {eventData.isOnline ? (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="platform">Online Platform</Label>
            <Select 
              value={eventData.platform}
              onValueChange={(value) => handleInputChange('platform', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="meet">Google Meet</SelectItem>
                <SelectItem value="webex">Cisco Webex</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <div className="flex items-center border rounded-md pl-2">
              <Link className="h-4 w-4 opacity-50" />
              <Input 
                id="meetingLink" 
                value={eventData.meetingLink}
                onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                placeholder="Enter meeting URL"
                className="border-0"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <div className="flex items-center border rounded-md pl-2">
            <MapPin className="h-4 w-4 opacity-50" />
            <Input 
              id="location" 
              value={eventData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter physical location"
              className="border-0"
            />
          </div>
        </div>
      )}
      
      <Separator />
    </div>
  );
};

export default DateLocationSection;
