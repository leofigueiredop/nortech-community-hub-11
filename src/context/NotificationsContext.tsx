import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/api/ApiClient';

export type NotificationType = 'post' | 'reply' | 'event' | 'announcement' | 'milestone' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loading: boolean;
  error: string | null;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, community } = useAuth();

  // Fetch notifications when user or community changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !community) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get notifications directly from Supabase
        const { data: apiNotifications, error: fetchError } = await api.supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('community_id', community.id)
          .order('created_at', { ascending: false });
          
        if (fetchError) {
          throw fetchError;
        }
        
        // Format notifications
        if (apiNotifications) {
          const formattedNotifications = apiNotifications.map(notification => ({
            id: notification.id,
            type: (notification.type || 'system') as NotificationType,
            title: notification.title,
            message: notification.content,
            link: notification.link,
            timestamp: new Date(notification.created_at),
            read: !!notification.read,
            priority: 'medium' as 'low' | 'medium' | 'high'
          }));
          
          setNotifications(formattedNotifications);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Set up polling or realtime subscription for new notifications
    const notificationInterval = setInterval(fetchNotifications, 60000); // Poll every minute
    
    return () => {
      clearInterval(notificationInterval);
    };
  }, [user, community]);

  // Helper to count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const totalCount = notifications.length;

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      // Update in API directly using Supabase
      const { error: updateError } = await api.supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (notifications.length === 0 || !user || !community) return;
    
    try {
      // Update all notifications for this user and community
      const { error: updateError } = await api.supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('community_id', community.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        totalCount,
        markAsRead,
        markAllAsRead,
        loading,
        error
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
