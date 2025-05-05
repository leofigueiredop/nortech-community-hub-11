import React from 'react';
import { Layout } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';
import { useTranslation } from 'react-i18next';

const GetStartedSection: React.FC = () => {
  // @ts-expect-error: i18next type inference issue
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  const getStartedTitle = translate('section.getStarted');

  return (
    <SidebarSection title={getStartedTitle}>
      <SidebarLink 
        to="/dashboard" 
        icon={<Layout size={18} />} 
        label="Dashboard" 
      />
    </SidebarSection>
  );
};

export default GetStartedSection;
