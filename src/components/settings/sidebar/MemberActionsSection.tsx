
import React from 'react';
import { FileText } from 'lucide-react';
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
    </div>
  );
};

export default MemberActionsSection;
