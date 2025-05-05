import React from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';
import { useTranslation } from 'react-i18next';

const CommunitySection: React.FC = () => {
  // @ts-expect-error: i18next type inference issue
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  const communityTitle = translate('section.community');

  return (
    <SidebarSection title={communityTitle}>
      <SidebarLink 
        to="/members" 
        icon={<Users size={18} />} 
        label={translate('label.members')} 
      />
      <SidebarLink 
        to="/analytics" 
        icon={<BarChart3 size={18} />} 
        label={translate('label.analytics')} 
      />
      <SidebarLink 
        to="/settings" 
        icon={<Settings size={18} />} 
        label={translate('label.settings')} 
        additionalPaths={['/settings/']}
      />
    </SidebarSection>
  );
};

export default CommunitySection;
