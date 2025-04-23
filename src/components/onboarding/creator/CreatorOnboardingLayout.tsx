
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface CreatorOnboardingLayoutProps {
  children: React.ReactNode;
}

const CreatorOnboardingLayout: React.FC<CreatorOnboardingLayoutProps> = ({ children }) => {
  const handleTalkToSales = () => {
    window.open('https://calendly.com/your-sales-team', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950">
      <div 
        onClick={handleTalkToSales}
        className="fixed top-6 right-6 z-50 cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200 rounded-lg px-6 py-3 shadow-xl hover:shadow-2xl group"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600 group-hover:text-purple-500" />
          <span className="font-medium text-gray-800 dark:text-gray-200">Talk to Sales Team</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CreatorOnboardingLayout;
