
import React from 'react';

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
    <div>
      <h3 className="text-lg font-medium mb-4">Capacity & Points</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium mb-1">
              Maximum Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="capacity"
              value={eventData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
              min={1}
              max={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of attendees allowed
            </p>
          </div>
          
          <div>
            <label htmlFor="points" className="block text-sm font-medium mb-1">
              Points Value
            </label>
            <input
              type="number"
              id="points"
              value={eventData.points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
              min={0}
              max={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Points awarded to attendees (optional)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="badgeEnabled"
              checked={eventData.badgeEnabled}
              onChange={(e) => handleInputChange('badgeEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="badgeEnabled" className="text-sm font-medium">
              Award a badge for attendance
            </label>
          </div>
          
          {eventData.badgeEnabled && (
            <div>
              <label htmlFor="badgeName" className="block text-sm font-medium mb-1">
                Badge Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="badgeName"
                value={eventData.badgeName}
                onChange={(e) => handleInputChange('badgeName', e.target.value)}
                placeholder="e.g. Workshop Attendee"
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

export default CapacityPointsSection;
