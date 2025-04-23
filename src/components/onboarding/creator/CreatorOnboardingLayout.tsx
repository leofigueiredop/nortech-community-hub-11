
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface CreatorOnboardingLayoutProps {
  children: React.ReactNode;
}

const CreatorOnboardingLayout: React.FC<CreatorOnboardingLayoutProps> = ({ children }) => {
  const handleTalkToSales = () => {
    window.open('https://calendly.com/your-sales-team', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950 relative">
      <Button
        variant="outline"
        onClick={handleTalkToSales}
        className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg border-purple-200 hover:border-purple-300 hover:bg-purple-50"
      >
        <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
        Talk to Sales Team
      </Button>
      
      {children}
    </div>
  );
};

export default CreatorOnboardingLayout;
