
import React from 'react';
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
import { Input } from '@/components/ui/input';
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
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {children}
          {title && <h1 className="font-medium">{title}</h1>}
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar..."
              className="w-full pl-8 bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
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
    </header>
  );
};

export default Header;
