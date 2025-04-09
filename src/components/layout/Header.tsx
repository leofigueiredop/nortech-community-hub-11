
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PointsBadge from '@/components/points/PointsBadge';
import { Trophy, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import NotificationBell from '@/components/notifications/NotificationBell';
import GlobalSearch from '@/components/search/GlobalSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const HeaderPointsBadge: React.FC = () => {
  return (
    <div className="mr-2">
      <PointsBadge size="sm" />
    </div>
  );
};

const Header: React.FC<{
  title?: string;
  children?: React.ReactNode;
}> = ({ title, children }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {children}
          {title && <h1 className="font-medium">{title}</h1>}
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground bg-muted/50"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search everything...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-8 w-8"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link to="/leaderboard">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trophy className="h-5 w-5 text-nortech-purple" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ranking da Comunidade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          
          <NotificationBell />
          
          <HeaderPointsBadge />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/onboarding/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/general">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Sair</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
