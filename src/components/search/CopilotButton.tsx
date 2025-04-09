
import React from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CopilotButtonProps {
  onClick: () => void;
}

const CopilotButton: React.FC<CopilotButtonProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClick} 
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ask AI Copilot</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopilotButton;
