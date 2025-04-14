
import React from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DateLocationSectionProps {
  eventData: {
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    isOnline: boolean;
    platform: string;
    meetingLink: string;
  };
  handleInputChange: (name: string, value: any) => void;
}

const DateLocationSection: React.FC<DateLocationSectionProps> = ({ 
  eventData, 
  handleInputChange 
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Date & Location</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker 
              date={eventData.date} 
              setDate={(date) => handleInputChange('date', date || new Date())} 
            />
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              value={eventData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              value={eventData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOnline"
              checked={eventData.isOnline}
              onChange={(e) => handleInputChange('isOnline', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="isOnline" className="text-sm font-medium">
              This is an online event
            </label>
          </div>
          
          {eventData.isOnline ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium mb-1">
                    Platform <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="platform"
                    value={eventData.platform}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="zoom">Zoom</option>
                    <option value="meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="meetingLink" className="block text-sm font-medium mb-1">
                    Meeting Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="meetingLink"
                    value={eventData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Physical Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={eventData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter the venue address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateLocationSection;
