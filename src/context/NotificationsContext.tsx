import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'post' | 'event' | 'reply' | 'mention' | 'content' | 'invitation' | 'milestone' | 'announcement';
  title: string;
  message: string;
  link: string;
  timestamp: Date;
  read: boolean;
  priority?: 'normal' | 'high';
  icon?: React.ReactNode;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock data for demonstrations
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'post',
    title: 'New post in Web3 Space',
    message: 'Pablo just posted "Introduction to Smart Contracts" in the Web3 space',
    link: '/feed',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'reply',
    title: 'New reply to your post',
    message: 'Maria replied to your post "React Best Practices"',
    link: '/feed',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: false
  },
  {
    id: '3',
    type: 'event',
    title: 'Upcoming event reminder',
    message: 'Your scheduled event "Web3 Workshop" starts in 30 minutes',
    link: '/events',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true
  },
  {
    id: '4',
    type: 'announcement',
    title: 'Platform Update',
    message: 'We just launched a new Notifications system! Check your settings to customize your preferences.',
    link: '/settings/notifications',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: 'high'
  },
  {
    id: '5',
    type: 'milestone',
    title: 'Achievement Unlocked!',
    message: "Congratulations! You've completed your first course on Nortech Communities.",
    link: '/courses',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true
  }
];

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== id)
    );
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        notificationsOpen,
        setNotificationsOpen
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
