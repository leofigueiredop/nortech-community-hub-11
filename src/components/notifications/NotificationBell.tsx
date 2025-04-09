
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationPanel from './NotificationPanel';
import { useNotifications } from '@/context/NotificationsContext';
import { cn } from '@/lib/utils';

const NotificationBell: React.FC = () => {
  const { unreadCount, notificationsOpen, setNotificationsOpen } = useNotifications();
  
  return (
    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative rounded-full text-gray-600 dark:text-gray-300"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className={cn(
              "absolute top-0 right-0 h-4 min-w-4 flex items-center justify-center",
              "rounded-full bg-nortech-purple text-[10px] font-medium text-white",
              "transform translate-x-1/3 -translate-y-1/3 px-[5px]"
            )}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto" sideOffset={10}>
        <NotificationPanel />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
