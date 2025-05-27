import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  Eye, 
  EyeOff, 
  MoreVertical,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Space } from './types';

interface SpaceCardProps {
  space: Space;
  onEdit: (space: Space) => void;
  onDelete: (spaceId: string) => void;
  onDuplicate: (space: Space) => void;
  onToggleVisibility: (spaceId: string) => void;
}

const SpaceCard: React.FC<SpaceCardProps> = ({
  space,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleVisibility
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forum': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'qa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'feed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'course': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'project': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: space.color + '20', color: space.color }}
            >
              {space.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{space.name}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {space.description}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(space)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Space
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(space)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleVisibility(space.id)}>
                {space.isPrivate ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Make Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Make Private
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(space.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Space
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={getTypeColor(space.type)}>
              {space.type.charAt(0).toUpperCase() + space.type.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{space.memberCount} members</span>
            </div>
            
            {space.isPrivate && (
              <Badge variant="outline" className="text-xs">
                <EyeOff className="h-3 w-3 mr-1" />
                Private
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(space)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpaceCard; 