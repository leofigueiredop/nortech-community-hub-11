import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Settings, Moon, Palette, Keyboard, Eye, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SettingsPopover: React.FC = () => {
  const { t } = useTranslation('common');
  const translate = t as (key: string) => string;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-white">
          <span className="font-semibold">{translate('feed.settings.community')}</span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
        <div className="p-0">
          <div className="flex flex-col">
            <Link 
              to="/settings/general" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Settings size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.settings')}</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/theme" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Moon size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.switchTheme')}</span>
            </Link>
            
            <Link 
              to="/settings/customize" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Palette size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.customize')}</span>
            </Link>
            
            <Link 
              to="/settings/shortcuts" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Keyboard size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.shortcuts')}</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/view-as" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Eye size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.viewAs')}</span>
            </Link>
            
            <Link 
              to="/settings/invite" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">{translate('feed.settings.invite')}</span>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SettingsPopover;
