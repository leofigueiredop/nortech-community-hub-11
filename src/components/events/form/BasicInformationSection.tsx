
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EVENT_TYPES } from '@/components/events/types/EventTypes';

interface BasicInformationSectionProps {
  eventData: {
    title: string;
    description: string;
    type: string;
    speaker: string;
  };
  handleInputChange: (name: string, value: any) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ 
  eventData, 
  handleInputChange 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input 
            id="title" 
            value={eventData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea 
            id="description" 
            value={eventData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your event"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Event Type</Label>
            <Select 
              value={eventData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(EVENT_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {EVENT_TYPES[type as keyof typeof EVENT_TYPES].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="speaker">Speaker/Host</Label>
            <Input 
              id="speaker" 
              value={eventData.speaker}
              onChange={(e) => handleInputChange('speaker', e.target.value)}
              placeholder="Who will be hosting?"
            />
          </div>
        </div>
      </div>
      
      <Separator />
    </div>
  );
};

export default BasicInformationSection;
