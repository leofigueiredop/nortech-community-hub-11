
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Community } from '@/types/community';

interface CommunityMenuItemProps {
  community: Community;
  onSelect: (community: Community) => void;
}

export function CommunityMenuItem({ community, onSelect }: CommunityMenuItemProps) {
  return (
    <DropdownMenuItem 
      key={community.id} 
      onSelect={() => onSelect(community)}
      className="flex items-center"
    >
      <Avatar className="h-5 w-5 mr-2">
        <AvatarImage src={community.logo} alt={community.name} />
        <AvatarFallback>{community.name[0]}</AvatarFallback>
      </Avatar>
      {community.name}
    </DropdownMenuItem>
  );
}
