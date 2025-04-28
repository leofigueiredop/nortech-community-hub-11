
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCommunities } from '@/types/community';

const CommunitySwitcher: React.FC = () => {
  const activeCommunity = mockCommunities[0];
  
  return (
    <Avatar className="h-8 w-8 rounded-full">
      <AvatarImage src={activeCommunity.logo_url} alt={activeCommunity.name} />
      <AvatarFallback className="bg-purple-600 text-white text-xs">
        {activeCommunity.name[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default CommunitySwitcher;
