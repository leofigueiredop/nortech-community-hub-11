
import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AITerminal from './AITerminal';

interface FloatingAITerminalProps {
  terminalName?: string;
}

const FloatingAITerminal: React.FC<FloatingAITerminalProps> = ({ 
  terminalName = "Nortech AI"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleTerminal = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {isOpen && !isMinimized && (
        <div className="fixed bottom-20 right-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <AITerminal 
            terminalName={terminalName} 
            onClose={handleClose} 
            onMinimize={handleMinimize} 
          />
        </div>
      )}
      
      <Button 
        onClick={toggleTerminal}
        className={`fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-all z-50 flex items-center justify-center ${
          isMinimized ? 'animate-pulse' : ''
        }`}
        size="icon"
      >
        <Terminal className="h-5 w-5" />
      </Button>
    </>
  );
};

export default FloatingAITerminal;
