
import React from 'react';
import { Settings, Palette, RefreshCw, Trophy } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface TechnicalSectionProps {
  activeSection?: string;
}

const TechnicalSection: React.FC<TechnicalSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<Settings size={18} />} 
        label="General" 
        to="/settings/general" 
        active={activeSection === "general"} 
      />
      <SettingsMenuItem 
        icon={<Palette size={18} />} 
        label="Branding" 
        to="/settings/branding" 
        active={activeSection === "branding"} 
      />
      <SettingsMenuItem 
        icon={<RefreshCw size={18} />} 
        label="Migration" 
        to="/settings/migration" 
        active={activeSection === "migration"} 
      />
      <SettingsMenuItem 
        icon={<Trophy size={18} />} 
        label="Points Configuration" 
        to="/settings/points-configuration" 
        active={activeSection === "points-configuration"} 
      />
    </div>
  );
};

export default TechnicalSection;
