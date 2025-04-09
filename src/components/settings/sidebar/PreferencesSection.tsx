
import React from 'react';
import { Palette, Smartphone, Layout, Globe, MessageSquare } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface PreferencesSectionProps {
  activeSection?: string;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<Palette size={18} />} 
        label="Branding" 
        to="/settings/branding" 
        active={activeSection === "branding"} 
      />
      <SettingsMenuItem 
        icon={<Smartphone size={18} />} 
        label="Mobile" 
        to="/settings/mobile" 
        active={activeSection === "mobile"} 
      />
      <SettingsMenuItem 
        icon={<Layout size={18} />} 
        label="Defaults" 
        to="/settings/defaults" 
        active={activeSection === "defaults"} 
      />
      <SettingsMenuItem 
        icon={<Globe size={18} />} 
        label="Domain" 
        to="/settings/domain" 
        active={activeSection === "domain"} 
      />
      <SettingsMenuItem 
        icon={<MessageSquare size={18} />} 
        label="Messaging" 
        to="/settings/messaging" 
        active={activeSection === "messaging"} 
      />
    </div>
  );
};

export default PreferencesSection;
