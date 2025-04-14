
import React from 'react';
import { MapPin, User, Users } from 'lucide-react';

interface EventCardDetailsProps {
  description: string;
  image?: string | null;
  speaker: string;
  location: string;
  attendees: number;
  capacity: number;
}

const EventCardDetails: React.FC<EventCardDetailsProps> = ({
  description,
  image,
  speaker,
  location,
  attendees,
  capacity
}) => {
  // Truncate description if too long
  const truncatedDescription = description.length > 150 
    ? `${description.substring(0, 150)}...` 
    : description;

  return (
    <div>
      {image && (
        <div className="h-40 w-full overflow-hidden mb-3 rounded-md">
          <img 
            src={image} 
            alt="Event" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {truncatedDescription}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <User size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{speaker}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 md:col-span-2">
          <Users size={16} className="mr-2 flex-shrink-0" />
          <span>{attendees} / {capacity} attendees</span>
          {attendees >= capacity && (
            <span className="ml-2 text-xs bg-red-100 text-red-800 py-0.5 px-2 rounded-full">
              Sold out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCardDetails;
