import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import { useAuth } from '@/context/AuthContext';

const SettingsLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Verify user has proper permissions to access settings
  useEffect(() => {
    if (!isLoading && user) {
      const role = user.role || user.communityRole;
      const isAuthorized = role === 'owner' || role === 'admin' || role === 'moderator';
      
      if (!isAuthorized) {
        console.log('User not authorized to access settings:', user);
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if user is not authorized
  const role = user?.role || user?.communityRole;
  if (!user || !(role === 'owner' || role === 'admin' || role === 'moderator')) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-6">
        <aside className="w-64">
          <SettingsMenu />
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;
