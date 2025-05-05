import React from 'react';
import { Users, Star, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useDiscussions } from '@/hooks/useDiscussions';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const ActiveUsersList: React.FC = () => {
  const { getActiveUsers } = useDiscussions();
  const activeUsers = getActiveUsers();
  const { t } = useTranslation('common');

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center mb-4">
        <Users size={16} className="mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">{t('discussions.activeUsersList.activeUsers')}</h3>
      </div>
      <div className="space-y-3">
        {activeUsers.map(({ user, count }, index) => (
          <div key={user.id} className="flex items-center">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {index < 3 && (
                <div className={`absolute -top-1 -right-1 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-semibold text-white
                  ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                  {index + 1}
                </div>
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.level && (
                    <Badge variant="outline" className="ml-2 text-xs h-5 px-1.5">
                      {t('discussions.activeUsersList.level', { level: user.level })}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{t('discussions.activeUsersList.contributions', { count })}</span>
              </div>
              {user.xp !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-amber-500 flex items-center">
                    <Star size={10} className="mr-0.5" />
                    {user.xp} {t('discussions.activeUsersList.xp')}
                  </span>
                  <Progress value={user.xp % 100} className="h-1.5 flex-1" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsersList;
