
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import CreateCommunityDialog from './CreateCommunityDialog';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
    // Logic for changing community context
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
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="p-1 hover:bg-transparent"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentCommunity.logo} alt={currentCommunity.name} />
              <AvatarFallback className="bg-nortech-purple text-white">
                {currentCommunity.name[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" forceMount>
          <DropdownMenuLabel>Suas comunidades</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {mockCommunities.map((community) => (
              <DropdownMenuItem 
                key={community.id} 
                onSelect={() => handleCommunityChange(community)}
              >
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={community.logo} alt={community.name} />
                  <AvatarFallback>{community.name[0]}</AvatarFallback>
                </Avatar>
                {community.name}
                {community.id === currentCommunity.id && (
                  <ChevronDown className="ml-auto h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleCreateCommunity}>
            <span className="text-nortech-purple font-medium">Criar nova comunidade</span>
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
