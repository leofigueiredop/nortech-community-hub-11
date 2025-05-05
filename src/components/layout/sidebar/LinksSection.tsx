import React from 'react';
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import EditableLinks from '../EditableLinks';
import { useTranslation } from 'react-i18next';

const LinksSection: React.FC = () => {
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  // Example translation variable usage (replace with actual keys as needed)
  const linksTitle = translate('section.links');
  const androidLabel = translate('download.android');
  const iosLabel = translate('download.ios');

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{linksTitle}</SidebarGroupLabel>
      <EditableLinks className="px-4 py-2" />
    </SidebarGroup>
  );
};

export default LinksSection;
