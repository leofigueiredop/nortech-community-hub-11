
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface CreatorOnboardingLayoutProps {
  children: React.ReactNode;
}

const CreatorOnboardingLayout: React.FC<CreatorOnboardingLayoutProps> = ({ children }) => {
  const handleTalkToSales = () => {
    // Here you would integrate with your CRM or open Calendly
    window.open('https://calendly.com/your-sales-team', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Button
        variant="outline"
        className="fixed top-4 right-4 hover:bg-white/90"
        onClick={handleTalkToSales}
      >
        💼 Scale faster? Talk to Sales
        <ArrowUpRight className="ml-2 h-4 w-4" />
      </Button>
      
      {children}
    </div>
  );
};

export default CreatorOnboardingLayout;
