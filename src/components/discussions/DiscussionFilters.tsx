
import React from 'react';
import { Filter, Search, Tag, Clock, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDiscussions } from '@/hooks/useDiscussions';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DiscussionFilter } from '@/types/discussion';

interface DiscussionFiltersProps {
  topicId: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: DiscussionFilter[]) => void;
  activeFilters: DiscussionFilter[];
}

const DiscussionFilters: React.FC<DiscussionFiltersProps> = ({ 
  topicId, 
  searchQuery, 
  onSearchChange, 
  onFilterChange,
  activeFilters
}) => {
  const { getTrendingTags } = useDiscussions();
  const trendingTags = getTrendingTags();

  const handleFilterToggle = (filter: DiscussionFilter) => {
    const isActive = activeFilters.some(f => 
      f.type === filter.type && f.value === filter.value
    );
    
    let newFilters: DiscussionFilter[];
    
    if (isActive) {
      // Remove the filter if it's already active
      newFilters = activeFilters.filter(f => 
        !(f.type === filter.type && f.value === filter.value)
      );
    } else {
      // Add the filter if it's not active
      newFilters = [...activeFilters, filter];
    }
    
    onFilterChange(newFilters);
  };

  const removeFilter = (filter: DiscussionFilter) => {
    const newFilters = activeFilters.filter(f => 
      !(f.type === filter.type && f.value === filter.value)
    );
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar discussões..." 
              value={searchQuery} 
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filtrar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtros</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Formato</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'format', value: 'question', label: 'Perguntas' })}
                className="flex items-center gap-2"
              >
                Perguntas
                {activeFilters.some(f => f.type === 'format' && f.value === 'question') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'format', value: 'discussion', label: 'Discussões' })}
                className="flex items-center gap-2"
              >
                Discussões
                {activeFilters.some(f => f.type === 'format' && f.value === 'discussion') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Status</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'status', value: 'hot', label: 'Em alta' })}
                className="flex items-center gap-2"
              >
                Em alta
                {activeFilters.some(f => f.type === 'status' && f.value === 'hot') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'status', value: 'answered', label: 'Resolvidas' })}
                className="flex items-center gap-2"
              >
                Resolvidas
                {activeFilters.some(f => f.type === 'status' && f.value === 'answered') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'status', value: 'unanswered', label: 'Não resolvidas' })}
                className="flex items-center gap-2"
              >
                Não resolvidas
                {activeFilters.some(f => f.type === 'status' && f.value === 'unanswered') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Período</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'time', value: 'today', label: 'Hoje' })}
                className="flex items-center gap-2"
              >
                Hoje
                {activeFilters.some(f => f.type === 'time' && f.value === 'today') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleFilterToggle({ type: 'time', value: 'week', label: 'Esta semana' })}
                className="flex items-center gap-2"
              >
                Esta semana
                {activeFilters.some(f => f.type === 'time' && f.value === 'week') && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-purple-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge 
              key={`${filter.type}-${filter.value}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => removeFilter(filter)}
            >
              {filter.label}
              <span className="ml-1 text-xs">×</span>
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-6 px-2"
              onClick={() => onFilterChange([])}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}
      
      {/* Trending tags */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center">
          <Tag size={14} className="mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">Tags populares</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map(({ tag, count }) => (
            <Badge 
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => handleFilterToggle({ type: 'tag', value: tag, label: tag })}
            >
              {tag}
              <span className="ml-1 text-xs opacity-70">({count})</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionFilters;
