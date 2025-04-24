
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateCommunityDialog from './CreateCommunityDialog';
import { CommunityMenuItem } from './CommunityMenuItem';
import { mockCommunities } from '@/types/community';

export function CommunitySwitcher() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentCommunity = mockCommunities[0];

  const handleCommunityChange = (community: typeof mockCommunities[0]) => {
    console.log(`Switching to community: ${community.name}`);
  };

  const handleCreateCommunity = () => {
    setShowCreateDialog(true);
    localStorage.setItem('newCommunityName', '');
    localStorage.setItem('newCommunityCategory', '');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="p-0 hover:bg-transparent">
          <Avatar className="h-4 w-4 cursor-pointer">
            <AvatarImage src={currentCommunity.logo} alt={currentCommunity.name} />
            <AvatarFallback className="bg-transparent text-white text-xs">
              {currentCommunity.name[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start" forceMount>
          <DropdownMenuGroup>
            {mockCommunities.map((community) => (
              <CommunityMenuItem 
                key={community.id}
                community={community}
                onSelect={handleCommunityChange}
              />
            ))}
          </DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleCreateCommunity} className="text-nortech-purple">
            Criar nova comunidade
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateCommunityDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
