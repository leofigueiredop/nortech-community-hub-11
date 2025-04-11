
import React from 'react';
import LibraryHeader from './LibraryHeader';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface LibraryHeaderSectionProps {
  premiumContentCount: number;
  theme: string;
  onToggleFilters: () => void;
  onToggleTheme: () => void;
}

const LibraryHeaderSection: React.FC<LibraryHeaderSectionProps> = ({
  premiumContentCount,
  theme,
  onToggleFilters,
  onToggleTheme,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <LibraryHeader 
        premiumContentCount={premiumContentCount} 
        onToggleFilters={onToggleFilters}
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleTheme} 
        className="rounded-full"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </div>
  );
};

export default LibraryHeaderSection;
