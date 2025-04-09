
import React from 'react';
import { Link } from 'react-router-dom';
import PointsBadge from '@/components/points/PointsBadge';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
          <HeaderPointsBadge />
        </div>
      </div>
    </header>
  );
};

export default Header;
