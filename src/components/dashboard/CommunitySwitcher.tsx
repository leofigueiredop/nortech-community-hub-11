
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Plus, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Community {
  id: string;
  name: string;
  logo?: string;
  color: string;
}

const CommunitySwitcher: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock communities data
  const communities: Community[] = [
    {
      id: '1',
      name: "Pablo's Community",
      color: 'bg-purple-600',
    },
    {
      id: '2',
      name: "NFT Academy",
      logo: "/placeholder.svg",
      color: 'bg-blue-600',
    },
    {
      id: '3',
      name: "Web3 Developers",
      color: 'bg-green-600',
    }
  ];
  
  const activeCommunity = communities[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2 h-9 pr-1 pl-0"
        >
          <Avatar className="h-7 w-7 rounded-full">
            <AvatarImage src={activeCommunity.logo} alt={activeCommunity.name} />
            <AvatarFallback className={`${activeCommunity.color} text-white text-xs`}>
              {activeCommunity.name[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-normal hidden md:inline-block">
            {activeCommunity.name}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch community</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {communities.map(community => (
          <DropdownMenuItem key={community.id} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarImage src={community.logo} alt={community.name} />
                <AvatarFallback className={`${community.color} text-white text-xs`}>
                  {community.name[0]}
                </AvatarFallback>
              </Avatar>
              <span>{community.name}</span>
              {community.id === activeCommunity.id && (
                <span className="ml-auto text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                  ✓
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/create-space')} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Community</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-muted-foreground">
          <Globe className="mr-2 h-4 w-4" />
          <span>Explore Public Communities</span>
          <span className="ml-auto text-xs">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommunitySwitcher;
