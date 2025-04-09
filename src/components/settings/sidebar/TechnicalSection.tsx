
import React from 'react';
import { Gauge, Settings, Shield, RefreshCw, Trophy } from 'lucide-react';
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
        icon={<Gauge size={18} />} 
        label="Branding" 
        to="/settings/branding" 
        active={activeSection === "branding"} 
      />
      <SettingsMenuItem 
        icon={<Shield size={18} />} 
        label="SSO" 
        to="/settings/sso" 
        active={activeSection === "sso"} 
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
        to="/settings/points" 
        active={activeSection === "points"} 
      />
    </div>
  );
};

export default TechnicalSection;
