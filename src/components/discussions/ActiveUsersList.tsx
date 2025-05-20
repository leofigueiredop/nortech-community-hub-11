import React, { useState, useEffect } from 'react';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

interface ActiveUsersListProps {
  limit?: number;
}

interface ActiveUser {
  user: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    xp?: number;
  };
  count: number;
}

const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ limit = 5 }) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use mock data for now - this would be replaced with API data
  useEffect(() => {
    const mockUsers: ActiveUser[] = [
      {
        user: {
          id: '1',
          name: 'Jessica Silva',
          avatar: 'https://i.pravatar.cc/150?img=1',
          level: 3,
        },
        count: 12
      },
      {
        user: {
          id: '2',
          name: 'Ricardo Oliveira',
          avatar: 'https://i.pravatar.cc/150?img=2',
          level: 5,
        },
        count: 8
      },
      {
        user: {
          id: '3',
          name: 'Maria Santos',
          avatar: 'https://i.pravatar.cc/150?img=3',
          level: 2,
        },
        count: 6
      },
      {
        user: {
          id: '4',
          name: 'João Costa',
          avatar: 'https://i.pravatar.cc/150?img=4',
          level: 4,
        },
        count: 5
      },
      {
        user: {
          id: '5',
          name: 'Ana Pereira',
          avatar: 'https://i.pravatar.cc/150?img=5',
          level: 1,
        },
        count: 3
      }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setActiveUsers(mockUsers.slice(0, limit));
      setLoading(false);
    }, 1000);
  }, [limit]);
  
  if (loading) {
    return (
      <div className="bg-card rounded-lg p-4 shadow-sm border">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Users size={16} />
          Active Members
        </h3>
        <div className="space-y-3">
          {Array(limit).fill(0).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm border">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Users size={16} />
        Active Members
      </h3>
      <div className="space-y-3">
        {activeUsers.map((item) => (
          <div key={item.user.id} className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
              <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{item.user.name}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">Level {item.user.level}</span>
                <span className="text-gray-400">•</span>
                <span className="ml-1">{item.count} contributions</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsersList;
