import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ChevronDown, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface ViewControlsProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreatePost: () => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ 
  currentView, 
  onViewChange, 
  onCreatePost 
}) => {
  const { isMobile } = useIsMobile();
  //  @ts-expect-error: Type instantiation is excessively deep and possibly infinite.
  const { t } = useTranslation('common');

  // @ts-expect-error: i18next type inference issue
  const viewAll = t('view.all') as string;
  // @ts-expect-error: i18next type inference issue
  const viewFree = t('view.free') as string;
  // @ts-expect-error: i18next type inference issue
  const viewPremium = t('view.premium') as string;
  // @ts-expect-error: i18next type inference issue
  const viewMentor = t('view.mentor') as string;
  // @ts-expect-error: i18next type inference issue
  const viewLabel = t('view.label') as string;

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Eye size={16} />
            {!isMobile ? (
              <>
                {currentView === 'all' ? viewAll : 
                 currentView === 'free' ? viewFree : 
                 currentView === 'premium' ? viewPremium : 
                 viewMentor}
              </>
            ) : (
              <span>{viewLabel}</span>
            )}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DropdownMenuItem onClick={() => onViewChange('all')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {viewAll}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('free')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {viewFree}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('premium')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {viewPremium}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('mentor')} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            {viewMentor}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        onClick={onCreatePost}
        className="bg-purple-600 hover:bg-purple-700 text-white flex gap-2"
        size={isMobile ? "sm" : "default"}
        translationKey={isMobile ? 'button.post' : 'button.createPost'}
      >
        <PlusCircle size={isMobile ? 16 : 18} />
      </Button>
    </div>
  );
};

export default ViewControls;
