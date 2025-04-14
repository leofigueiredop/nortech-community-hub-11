
import React from 'react';
import { EVENT_TYPES } from '../types/EventTypes';

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
    <div>
      <h3 className="text-lg font-medium mb-4">Basic Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={eventData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Give your event a clear, descriptive name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={eventData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your event is about"
            className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={eventData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              {Object.entries(EVENT_TYPES).map(([type, details]) => (
                <option key={type} value={type}>
                  {details.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="speaker" className="block text-sm font-medium mb-1">
              Speaker / Host <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="speaker"
              value={eventData.speaker}
              onChange={(e) => handleInputChange('speaker', e.target.value)}
              placeholder="Who will be hosting this event?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;
