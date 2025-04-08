
import React from 'react';
import { Moon, Palette, Keyboard } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface PreferencesSectionProps {
  activeSection?: string;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<Moon size={18} />} 
        label="Switch to light mode" 
        to="/settings/theme" 
        active={activeSection === "theme"} 
      />
      <SettingsMenuItem 
        icon={<Palette size={18} />} 
        label="Customize theme" 
        to="/settings/customize" 
        active={activeSection === "customize"} 
      />
      <SettingsMenuItem 
        icon={<Keyboard size={18} />} 
        label="Keyboard shortcuts" 
        to="/settings/shortcuts" 
        active={activeSection === "shortcuts"} 
      />
    </div>
  );
};

export default PreferencesSection;
