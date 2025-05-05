import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getContentTypes, getAccessTypes } from './filterConstants';

interface FilterOption {
  id: string;
  name: string;
}

interface FilterDropdownProps {
  contentFilter: string;
  setContentFilter: (filter: string) => void;
  accessFilter: string;
  setAccessFilter: (filter: string) => void;
  // contentTypes: FilterOption[];
  // accessTypes: FilterOption[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  contentFilter,
  setContentFilter,
  accessFilter,
  setAccessFilter,
  // contentTypes,
  // accessTypes
}) => {
  const { t } = useTranslation('common');
  const translate = t as (key: string) => string;
  const contentTypes = getContentTypes(translate);
  const accessTypes = getAccessTypes(translate);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Filter size={16} />
          <span>{translate('feed.filters.filter')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{translate('feed.filters.contentType')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {contentTypes.map(type => (
            <DropdownMenuItem 
              key={type.id}
              onClick={() => setContentFilter(type.id)}
              className="flex justify-between items-center"
            >
              <span>{type.name}</span>
              {contentFilter === type.id && <Check size={16} className="text-purple-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuLabel className="mt-2">{translate('feed.filters.accessLevel')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {accessTypes.map(type => (
            <DropdownMenuItem 
              key={type.id}
              onClick={() => setAccessFilter(type.id)}
              className="flex justify-between items-center"
            >
              <span>{type.name}</span>
              {accessFilter === type.id && <Check size={16} className="text-purple-600" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
