import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ViewTypeSwitcherProps {
  viewType: string;
  onViewTypeChange: (viewType: string) => void;
  selectedDate?: Date;
  onDateClear?: () => void;
}

const ViewTypeSwitcher: React.FC<ViewTypeSwitcherProps> = ({
  viewType,
  onViewTypeChange,
  selectedDate,
  onDateClear
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant={viewType === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewTypeChange('grid')}
        >
          <Grid className="h-4 w-4 mr-2" />
          Grid
        </Button>
        <Button
          variant={viewType === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewTypeChange('list')}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>
        <Button
          variant={viewType === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewTypeChange('calendar')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>
      
      {selectedDate && onDateClear && (
        <Badge 
          variant="secondary" 
          className="flex gap-1 items-center ml-auto"
        >
          Events on {format(selectedDate, 'dd/MM/yyyy')}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 rounded-full ml-1"
            onClick={onDateClear}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear date filter</span>
          </Button>
        </Badge>
      )}
    </div>
  );
};

export default ViewTypeSwitcher; 