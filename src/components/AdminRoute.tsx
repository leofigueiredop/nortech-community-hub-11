import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'admin' | 'moderator';
  requiredPermissions?: string[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  requiredRole = 'admin',
  requiredPermissions = [] 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // If no user, redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = () => {
    if (!user.role && !user.communityRole) {
      console.log('User has no role:', user);
      return false;
    }
    
    // Use communityRole se disponível, caso contrário use role
    const userRole = user.communityRole || user.role;
    
    console.log('Checking user role:', userRole, 'against required role:', requiredRole);
    
    switch (requiredRole) {
      case 'owner':
        return userRole === 'owner';
      case 'admin':
        return userRole === 'owner' || userRole === 'admin';
      case 'moderator':
        return userRole === 'owner' || 
               userRole === 'admin' || 
               userRole === 'moderator';
      default:
        return false;
    }
  };

  const hasRequiredPermissions = () => {
    if (!requiredPermissions.length) return true;
    if (!user.moderatorPermissions) return false;

    return requiredPermissions.every(permission => 
      user.moderatorPermissions && user.moderatorPermissions[permission as keyof typeof user.moderatorPermissions]
    );
  };

  const roleCheck = hasRequiredRole();
  const permissionCheck = hasRequiredPermissions();
  
  console.log('Role check result:', roleCheck, 'Permission check result:', permissionCheck);

  if (!roleCheck || !permissionCheck) {
    // If checks fail, redirect to dashboard
    console.log('Access denied. Redirecting to dashboard.');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 