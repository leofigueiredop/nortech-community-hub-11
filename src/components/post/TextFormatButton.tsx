
import React from 'react';
import { Button } from '@/components/ui/button';

interface TextFormatButtonProps {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
}

const TextFormatButton: React.FC<TextFormatButtonProps> = ({ 
  icon: Icon, 
  tooltip, 
  onClick,
  isActive
}) => (
  <Button 
    variant={isActive ? "default" : "ghost"} 
    className={`rounded-full h-10 w-10 p-0 ${isActive ? 'bg-slate-600 text-white' : ''}`}
    title={tooltip}
    onClick={onClick}
  >
    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
  </Button>
);

export default TextFormatButton;
