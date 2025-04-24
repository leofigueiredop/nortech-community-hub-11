
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockCommunities } from '@/types/community';

export function CommunitySwitcher() {
  const currentCommunity = mockCommunities[0];

  return (
    <Avatar className="h-4 w-4 cursor-pointer">
      <AvatarImage src={currentCommunity.logo} alt={currentCommunity.name} />
      <AvatarFallback className="bg-transparent text-white text-xs">
        {currentCommunity.name[0]}
      </AvatarFallback>
    </Avatar>
  );
}
