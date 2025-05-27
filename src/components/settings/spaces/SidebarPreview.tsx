import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Calendar,
  Hash,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Space } from './types';

interface SidebarPreviewProps {
  spaces: Space[];
  showCategories?: boolean;
  showPrivateSpaces?: boolean;
}

const SidebarPreview: React.FC<SidebarPreviewProps> = ({
  spaces,
  showCategories = true,
  showPrivateSpaces = true
}) => {
  const publicSpaces = spaces.filter(space => !space.isPrivate);
  const privateSpaces = spaces.filter(space => space.isPrivate);

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case 'forum': return MessageSquare;
      case 'qa': return MessageSquare;
      case 'feed': return Hash;
      case 'course': return Calendar;
      case 'project': return Users;
      default: return MessageSquare;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Sidebar Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 text-sm">
          {/* Main Navigation */}
          <div className="flex items-center gap-2 px-2 py-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </div>
          
          {/* Public Spaces */}
          {publicSpaces.length > 0 && (
            <div className="mt-4">
              {showCategories && (
                <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <ChevronDown className="h-3 w-3" />
                  Spaces
                </div>
              )}
              <div className="space-y-0.5">
                {publicSpaces.slice(0, 4).map((space) => {
                  const IconComponent = getSpaceIcon(space.type);
                  return (
                    <div 
                      key={space.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <span className="text-sm">{space.icon}</span>
                      <span className="truncate">{space.name}</span>
                      {space.memberCount > 0 && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {space.memberCount}
                        </Badge>
                      )}
                    </div>
                  );
                })}
                {publicSpaces.length > 4 && (
                  <div className="px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
                    +{publicSpaces.length - 4} more spaces
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Private Spaces */}
          {showPrivateSpaces && privateSpaces.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                <ChevronDown className="h-3 w-3" />
                Private
              </div>
              <div className="space-y-0.5">
                {privateSpaces.slice(0, 3).map((space) => {
                  return (
                    <div 
                      key={space.id}
                      className="flex items-center gap-2 px-2 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                    >
                      <Lock className="h-3 w-3" />
                      <span className="text-sm">{space.icon}</span>
                      <span className="truncate">{space.name}</span>
                    </div>
                  );
                })}
                {privateSpaces.length > 3 && (
                  <div className="px-2 py-1 text-xs text-gray-400 dark:text-gray-500">
                    +{privateSpaces.length - 3} more private
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {spaces.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No spaces configured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SidebarPreview; 