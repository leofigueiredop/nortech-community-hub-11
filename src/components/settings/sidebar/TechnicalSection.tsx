
import React from 'react';
import { ExternalLink, ArrowRightLeft, Monitor, Code, Settings, Users } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface TechnicalSectionProps {
  activeSection?: string;
}

const TechnicalSection: React.FC<TechnicalSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<Users size={18} />} 
        label="Audience" 
        to="/settings/audience" 
        active={activeSection === "audience"} 
      />
      <SettingsMenuItem 
        icon={<ExternalLink size={18} />} 
        label="Integration" 
        to="/settings/integration" 
        active={activeSection === "integration"} 
      />
      <SettingsMenuItem 
        icon={<ArrowRightLeft size={18} />} 
        label="Migration" 
        to="/settings/migration" 
        active={activeSection === "migration"} 
      />
      <SettingsMenuItem 
        icon={<Monitor size={18} />} 
        label="Site" 
        to="/settings/site" 
        active={activeSection === "site"} 
      />
      <SettingsMenuItem 
        icon={<Code size={18} />} 
        label="Developers" 
        to="/settings/developers" 
        active={activeSection === "developers"} 
      />
      <SettingsMenuItem 
        icon={<Settings size={18} />} 
        label="Settings" 
        to="/settings/general" 
        active={activeSection === "general"} 
      />
    </div>
  );
};

export default TechnicalSection;
