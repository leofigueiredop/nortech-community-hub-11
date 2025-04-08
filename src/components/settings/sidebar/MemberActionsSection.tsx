
import React from 'react';
import { Eye, UserPlus } from 'lucide-react';
import SettingsMenuItem from '../SettingsMenuItem';
import { useViewContext } from '@/components/layout/MainLayout';

interface MemberActionsSectionProps {
  activeSection?: string;
}

const MemberActionsSection: React.FC<MemberActionsSectionProps> = ({ activeSection }) => {
  const { viewAs } = useViewContext();
  const isViewingAsMember = viewAs !== 'admin';

  return (
    <div className="space-y-1 px-2">
      <SettingsMenuItem 
        icon={<Eye size={18} className={isViewingAsMember ? "text-purple-600" : ""} />} 
        label="View as" 
        to="/settings/view-as" 
        active={activeSection === "view-as" || isViewingAsMember} 
        badge={isViewingAsMember ? "Active" : undefined}
      />
      <SettingsMenuItem 
        icon={<UserPlus size={18} />} 
        label="Invite member" 
        to="/settings/invite" 
        active={activeSection === "invite"} 
      />
    </div>
  );
};

export default MemberActionsSection;
