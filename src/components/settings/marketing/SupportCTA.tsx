
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headset, MessageSquare } from 'lucide-react';

interface SupportCTAProps {
  title?: string;
  description?: string;
}

const SupportCTA: React.FC<SupportCTAProps> = ({ 
  title = "Need help configuring your community settings?",
  description = "Book a session with our Community Experts or get live assistance"
}) => {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <h3 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">{title}</h3>
        <p className="text-indigo-600/80 dark:text-indigo-400 text-sm mt-1">
          {description}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="border-indigo-300 hover:bg-indigo-100 dark:border-indigo-600 dark:hover:bg-indigo-800">
          <Headset className="mr-2 h-4 w-4" />
          Schedule a Call
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat Support
        </Button>
      </div>
    </div>
  );
};

export default SupportCTA;
