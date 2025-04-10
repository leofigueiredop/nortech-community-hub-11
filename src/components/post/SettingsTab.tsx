
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';
import TagsInput from '@/components/library/management/form/TagsInput';
import { 
  FileText, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  FileVideo, 
  DollarSign, 
  Eye, 
  Lock, 
  Layers, 
  Clock, 
  SquareCode, 
  ChevronDown, 
  TrendingUp 
} from 'lucide-react';

interface SettingsTabProps {
  postType: string;
  setPostType: (type: string) => void;
  visibilityOption: string;
  setVisibilityOption: (option: string) => void;
  isScheduled: boolean;
  setIsScheduled: (scheduled: boolean) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  popularTags: string[];
  advancedEditorEnabled: boolean;
  setAdvancedEditorEnabled: (enabled: boolean) => void;
  monetizeWithPoints: boolean;
  setMonetizeWithPoints: (monetize: boolean) => void;
  pointsAmount: number;
  setPointsAmount: (amount: number) => void;
  linkToStoreItem: string;
  setLinkToStoreItem: (item: string) => void;
  linkToPremiumGroup: string;
  setLinkToPremiumGroup: (group: string) => void;
  storeItems: Array<{id: number, name: string}>;
  premiumGroups: Array<{id: number, name: string}>;
  formatText: (format: string) => void;
  getEstimatedReach: () => number;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  postType,
  setPostType,
  visibilityOption,
  setVisibilityOption,
  isScheduled,
  setIsScheduled,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  calendarOpen,
  setCalendarOpen,
  selectedTags,
  setSelectedTags,
  popularTags,
  advancedEditorEnabled,
  setAdvancedEditorEnabled,
  monetizeWithPoints,
  setMonetizeWithPoints,
  pointsAmount,
  setPointsAmount,
  linkToStoreItem,
  setLinkToStoreItem,
  linkToPremiumGroup,
  setLinkToPremiumGroup,
  storeItems,
  premiumGroups,
  formatText,
  getEstimatedReach
}) => {
  return (
    <div className="space-y-6 p-1">
      <div className="space-y-4">
        <h3 className="text-base font-medium text-white">Post Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <Button 
            variant={postType === 'standard' ? 'default' : 'outline'} 
            onClick={() => setPostType('standard')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <FileText size={20} />
            <span className="text-xs">Standard</span>
          </Button>
          <Button 
            variant={postType === 'event' ? 'default' : 'outline'} 
            onClick={() => setPostType('event')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <CalendarIcon size={20} />
            <span className="text-xs">Event</span>
          </Button>
          <Button 
            variant={postType === 'question' ? 'default' : 'outline'} 
            onClick={() => setPostType('question')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <MessageSquare size={20} />
            <span className="text-xs">Question</span>
          </Button>
          <Button 
            variant={postType === 'resource' ? 'default' : 'outline'} 
            onClick={() => setPostType('resource')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <FileVideo size={20} />
            <span className="text-xs">Resource</span>
          </Button>
          <Button 
            variant={postType === 'paid' ? 'default' : 'outline'} 
            onClick={() => setPostType('paid')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <DollarSign size={20} />
            <span className="text-xs">Paid</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium text-white">Visibility Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            variant={visibilityOption === 'free' ? 'default' : 'outline'} 
            onClick={() => setVisibilityOption('free')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <Eye size={20} />
            <span className="text-xs">Free (All)</span>
          </Button>
          <Button 
            variant={visibilityOption === 'premium' ? 'default' : 'outline'} 
            onClick={() => setVisibilityOption('premium')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <Lock size={20} />
            <span className="text-xs">Premium</span>
          </Button>
          <Button 
            variant={visibilityOption === 'teaser' ? 'default' : 'outline'} 
            onClick={() => setVisibilityOption('teaser')}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <Layers size={20} />
            <span className="text-xs">Public Teaser</span>
          </Button>
          <Button 
            variant={isScheduled ? 'default' : 'outline'} 
            onClick={() => setIsScheduled(!isScheduled)}
            className="flex flex-col items-center justify-center h-[70px] gap-1"
          >
            <Clock size={20} />
            <span className="text-xs">Scheduled</span>
          </Button>
        </div>
        
        {isScheduled && (
          <div className="space-y-3 pt-2 bg-gray-800 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-300">Schedule Publication</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={(date) => {
                        setScheduledDate(date);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-full sm:w-40">
                <TimePicker
                  value={scheduledTime}
                  onChange={setScheduledTime}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <h3 className="text-base font-medium text-white">Tags</h3>
        <TagsInput
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={popularTags}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-white">Advanced Editor</h3>
          <Switch 
            checked={advancedEditorEnabled} 
            onCheckedChange={setAdvancedEditorEnabled}
          />
        </div>
        
        {advancedEditorEnabled && (
          <div className="space-y-3 bg-gray-800 p-3 rounded-md">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                className="rounded-full h-10 w-10 p-0"
                title="Code/Markdown"
                onClick={() => formatText('code')}
              >
                <SquareCode className="h-5 w-5 text-gray-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-full h-10 w-10 p-0"
                title="Spoiler Block"
                onClick={() => formatText('spoiler')}
              >
                <Eye className="h-5 w-5 text-gray-400" />
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-full h-10 w-10 p-0"
                title="Collapsible Section"
                onClick={() => formatText('collapsible')}
              >
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {(visibilityOption === 'premium' || postType === 'paid') && (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-white">Monetization</h3>
          <div className="space-y-3 bg-gray-800 p-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-300">Allow redemption via points</h4>
                <p className="text-xs text-gray-400">Users can spend points to access this content</p>
              </div>
              <Switch 
                checked={monetizeWithPoints} 
                onCheckedChange={setMonetizeWithPoints}
              />
            </div>
            
            {monetizeWithPoints && (
              <div className="pt-3">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Points required ({pointsAmount})</h4>
                <Slider
                  value={[pointsAmount]}
                  min={50}
                  max={500}
                  step={10}
                  onValueChange={(value) => setPointsAmount(value[0])}
                />
              </div>
            )}
            
            <div className="pt-3 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Link to Store Item (Optional)</h4>
                <Select value={linkToStoreItem} onValueChange={setLinkToStoreItem}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select a store item" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="">None</SelectItem>
                    {storeItems.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Link to Premium Group (Optional)</h4>
                <Select value={linkToPremiumGroup} onValueChange={setLinkToPremiumGroup}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select a premium group" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="">None</SelectItem>
                    {premiumGroups.map(group => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="text-base font-medium text-white">Analytics Insights</h3>
        <div className="bg-gray-800 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-300">Estimated Reach</h4>
              <p className="text-2xl font-bold text-white">{getEstimatedReach()}</p>
              <p className="text-xs text-gray-400">Based on your selected space and visibility</p>
            </div>
            <TrendingUp size={40} className="text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
