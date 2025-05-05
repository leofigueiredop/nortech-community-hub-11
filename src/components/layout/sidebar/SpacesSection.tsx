import React from 'react';
import { PlusCircle } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';
import { useTranslation } from 'react-i18next';

const SpacesSection: React.FC = () => {
  // @ts-expect-error: i18next type inference issue
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  // Example translation variable usage (replace with actual keys as needed)
  const spacesTitle = translate('section.spaces');

  return (
    <SidebarSection title={spacesTitle}>
      <SidebarLink 
        to="/create-space" 
        icon={<PlusCircle size={18} />} 
        label="Create Space" 
      />
    </SidebarSection>
  );
};

export default SpacesSection;
