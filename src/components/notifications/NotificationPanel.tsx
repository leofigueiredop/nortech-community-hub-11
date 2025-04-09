
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X, Settings, Bell, CheckCheck, Megaphone, Calendar, MessageSquare, AtSign, FileText, UserPlus, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications, Notification } from '@/context/NotificationsContext';
import { Link } from 'react-router-dom';

const getIconForNotificationType = (type: Notification['type']) => {
  switch (type) {
    case 'post':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'event':
      return <Calendar className="h-4 w-4 text-green-500" />;
    case 'reply':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'mention':
      return <AtSign className="h-4 w-4 text-indigo-500" />;
    case 'content':
      return <FileText className="h-4 w-4 text-teal-500" />;
    case 'invitation':
      return <UserPlus className="h-4 w-4 text-pink-500" />;
    case 'milestone':
      return <Award className="h-4 w-4 text-amber-500" />;
    case 'announcement':
      return <Megaphone className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { markAsRead } = useNotifications();
  
  const handleClick = () => {
    markAsRead(notification.id);
  };
  
  return (
    <Link 
      to={notification.link} 
      onClick={handleClick}
      className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${!notification.read ? 'bg-purple-50 dark:bg-gray-800/50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {notification.icon || getIconForNotificationType(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 dark:text-white">
            {notification.title}
            {notification.priority === 'high' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
                Important
              </span>
            )}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <span className="w-2 h-2 rounded-full bg-purple-500 absolute right-4 top-4"></span>
        )}
      </div>
    </Link>
  );
};

const NotificationPanel: React.FC = () => {
  const { notifications, markAllAsRead, unreadCount } = useNotifications();
  
  return (
    <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead} 
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification, i) => (
              <React.Fragment key={notification.id}>
                <NotificationItem notification={notification} />
                {i < notifications.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <Link to="/settings/notifications">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-gray-700 dark:text-gray-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            Notification settings
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
