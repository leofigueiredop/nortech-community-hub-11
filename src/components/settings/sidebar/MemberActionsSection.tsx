
import React from 'react';
import { FileText, Mail, KeyRound } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';

interface MemberActionsSectionProps {
  activeSection?: string;
}

const MemberActionsSection: React.FC<MemberActionsSectionProps> = ({ activeSection }) => {
  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<FileText size={18} />} 
        label="Legal" 
        to="/settings/legal" 
        active={activeSection === "legal"} 
      />
      <SettingsMenuItem 
        icon={<Mail size={18} />} 
        label="Digest" 
        to="/settings/digest" 
        active={activeSection === "digest"} 
      />
      <SettingsMenuItem 
        icon={<KeyRound size={18} />} 
        label="SSO" 
        to="/settings/sso" 
        active={activeSection === "sso"} 
      />
    </div>
  );
};

export default MemberActionsSection;
