
import React from 'react';

interface EventCardDetailsProps {
  description: string;
  image: string | null;
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
  return (
    <>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
      
      {image && (
        <div className="mb-3 h-36 overflow-hidden rounded-md">
          <img 
            src={image} 
            alt={description} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      <div className="flex flex-col space-y-1 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Speaker</span>
          <span>{speaker}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Location</span>
          <span>{location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Attendees</span>
          <span>{attendees}/{capacity}</span>
        </div>
      </div>
    </>
  );
};

export default EventCardDetails;
