import React from 'react';
import { Rss } from 'lucide-react';
import SidebarLink from './SidebarLink';
import { useTranslation } from 'react-i18next';

const HomeSection: React.FC = () => {
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  const homeTitle = translate('main.home');

  return (
    <SidebarLink 
      to="/feed" 
      icon={<Rss size={16} className="text-purple-600" />} 
      label={homeTitle} 
      additionalPaths={["/"]}
    />
  );
};

export default HomeSection;
