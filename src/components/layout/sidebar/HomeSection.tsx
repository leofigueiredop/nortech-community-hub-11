
import React from 'react';
import { Home, Gauge } from 'lucide-react';
import { SidebarLink } from './SidebarLink';
import { useTranslation } from 'react-i18next';

const HomeSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <SidebarLink to="/" icon={<Home size={18} />} label={t('sidebar.home')} />
      <SidebarLink to="/dashboard" icon={<Gauge size={18} />} label="Dashboard" />
    </>
  );
};

export default HomeSection;
