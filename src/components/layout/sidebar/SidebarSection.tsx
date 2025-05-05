import React from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  const { isMobile } = useIsMobile();
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  // Try to translate the title if it matches a known key, otherwise fallback
  let translatedTitle = title;
  // List of known section keys
  const knownSectionKeys = [
    'section.getStarted',
    'section.spaces',
    'section.content',
    'section.community',
    'section.links',
    'section.manage'
  ];
  if (knownSectionKeys.includes(title)) {
    translatedTitle = translate(title);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={`uppercase tracking-wider font-normal text-xs text-purple-500/60 dark:text-purple-400/60 pb-0.5 ${isMobile ? 'text-[10px]' : ''}`}>
        {translatedTitle}
      </SidebarGroupLabel>
      <SidebarMenu className={`space-y-1 text-xs ${isMobile ? 'space-y-0.5' : ''}`}>
        {children}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarSection;
