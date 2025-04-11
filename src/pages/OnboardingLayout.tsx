
import React, { ReactNode } from 'react';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
};

export default OnboardingLayout;
