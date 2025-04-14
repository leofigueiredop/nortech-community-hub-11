
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface OnboardingLayoutProps {
  children?: ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {children || <Outlet />}
    </div>
  );
};

export default OnboardingLayout;
