import React, { useState, useMemo } from 'react';
import { FileText, MessageSquare, Calendar, Users, Trophy, Library, PlusCircle } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarLink from './SidebarLink';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const ContentSection: React.FC = () => {
  const { toast } = useToast();
  // @ts-expect-error: i18next type inference issue
  const { t } = useTranslation('navigation');
  const translate = t as (key: string) => string;

  // Translation variables
  // @ts-expect-error: i18next type inference issue
  const contentTitle = t('section.content') as string;
  // @ts-expect-error: i18next type inference issue
  const manageLabel = t('section.manage') as string;
  // @ts-expect-error: i18next type inference issue
  const createPostLabel = t('main.createPost') as string;
  // @ts-expect-error: i18next type inference issue
  const createSpaceLabel = t('main.createSpace') as string;
  // @ts-expect-error: i18next type inference issue
  const createEventLabel = t('main.createEvent') as string;

  // Track deleted item IDs if you want to support deletion
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Generate contentItems on language change
  const contentItems = useMemo(() => [
    { id: '1', to: '/feed', icon: <FileText size={18} />, label: translate('main.posts'), additionalPaths: ['/create-post'] },
    { id: '2', to: '/discussions', icon: <MessageSquare size={18} />, label: translate('main.discussions') },
    { id: '3', to: '/library', icon: <Library size={18} />, label: translate('main.contentLibrary') },
    { id: '4', to: '/events', icon: <Calendar size={18} />, label: translate('main.events'), additionalPaths: ['/events/weekly', '/events/calendar'] },
    { id: '5', to: '/matchmaker', icon: <Users size={18} />, label: translate('main.matchmaker') },
    { id: '6', to: '/points', icon: <Trophy size={18} />, label: translate('main.points'), additionalPaths: ['/leaderboard', '/points/store'] },
  ], [translate, i18n.language]);

  // Filter out deleted items
  const visibleItems = contentItems.filter(item => !deletedIds.includes(item.id));

  const handleDeleteItem = (id: string) => {
    setDeletedIds(prev => [...prev, id]);
    toast({
      title: "Content Item Removed",
      description: "The item has been removed from your sidebar.",
    });
  };

  return (
    <SidebarSection title={contentTitle}>
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">{manageLabel}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <PlusCircle size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <a href="/create-post">{createPostLabel}</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/create-space">{createSpaceLabel}</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/events/create">{createEventLabel}</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {visibleItems.map((item) => (
        <SidebarLink 
          key={item.id}
          to={item.to} 
          icon={item.icon} 
          label={item.label} 
          additionalPaths={item.additionalPaths}
          canDelete={true}
          onDelete={() => handleDeleteItem(item.id)}
        />
      ))}
    </SidebarSection>
  );
};

export default ContentSection;
