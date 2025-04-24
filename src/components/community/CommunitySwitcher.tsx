
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

interface Community {
  id: string;
  name: string;
  logo?: string;
}

const mockCommunities: Community[] = [
  { id: '1', name: 'Nortech', logo: '/nortech-logo.png' },
  { id: '2', name: 'Alphractal', logo: '/alphractal-logo.png' },
  { id: '3', name: 'CryptoSync', logo: '/cryptosync-logo.png' },
];

export function CommunitySwitcher() {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentCommunity = mockCommunities[0];

  const handleCommunityChange = (community: Community) => {
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
              <DropdownMenuItem 
                key={community.id} 
                onSelect={() => handleCommunityChange(community)}
                className="flex items-center"
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={community.logo} alt={community.name} />
                  <AvatarFallback>{community.name[0]}</AvatarFallback>
                </Avatar>
                {community.name}
              </DropdownMenuItem>
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
