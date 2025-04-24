
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Send, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface StepFourProps {
  data: {
    name: string;
    scheduledDate: Date | null;
    timeZone: string;
  };
  updateData: (data: Partial<typeof data>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const StepFour: React.FC<StepFourProps> = ({ data, updateData, onComplete, onBack }) => {
  const [sendingOption, setSendingOption] = useState('now');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      updateData({ scheduledDate: date });
    }
  };
  
  const handleSendNow = () => {
    updateData({ scheduledDate: new Date() });
    setConfirmDialogOpen(true);
  };
  
  const handleSchedule = () => {
    // If using the scheduled option but no date is selected, don't proceed
    if (sendingOption === 'schedule' && !data.scheduledDate) {
      return;
    }
    
    // If scheduling, combine date and time
    if (sendingOption === 'schedule' && data.scheduledDate) {
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const scheduledDateTime = new Date(data.scheduledDate);
      scheduledDateTime.setHours(hours, minutes);
      updateData({ scheduledDate: scheduledDateTime });
    }
    
    setConfirmDialogOpen(true);
  };
  
  const handleSaveAsDraft = () => {
    updateData({ scheduledDate: null });
    onComplete();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Delivery Options</Label>
        <RadioGroup 
          value={sendingOption} 
          onValueChange={setSendingOption}
        >
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="now" id="send-now" />
            <Label htmlFor="send-now" className="flex-1 cursor-pointer">Send Immediately</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="schedule" id="schedule" />
            <Label htmlFor="schedule" className="cursor-pointer">Schedule for later</Label>
          </div>
        </RadioGroup>
      </div>
      
      {sendingOption === 'schedule' && (
        <div className="space-y-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.scheduledDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.scheduledDate ? format(data.scheduledDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.scheduledDate || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="flex items-center border rounded-md">
                <Clock className="ml-3 h-4 w-4 text-gray-500" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="flex-1 p-2 bg-transparent outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select 
                value={data.timeZone} 
                onValueChange={(value) => updateData({ timeZone: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Central European (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-6">
          <h3 className="text-blue-800 dark:text-blue-300 font-medium">Campaign Summary</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li><strong>Name:</strong> {data.name || "Untitled Campaign"}</li>
            <li><strong>Status:</strong> {sendingOption === 'now' ? 'Ready to send immediately' : 
              data.scheduledDate ? `Scheduled for ${format(data.scheduledDate, "PPP")} at ${scheduledTime}` : 
              'Not scheduled yet'}</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveAsDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          {sendingOption === 'now' ? (
            <Button onClick={handleSendNow} className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Send Now
            </Button>
          ) : (
            <Button 
              onClick={handleSchedule} 
              disabled={!data.scheduledDate}
            >
              Schedule Campaign
            </Button>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {sendingOption === 'now' ? 'Send Campaign Now?' : 'Schedule Campaign?'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {sendingOption === 'now' ? 
                'This will immediately send your campaign to all selected recipients. This action cannot be undone.' : 
                `Your campaign will be scheduled for ${data.scheduledDate ? format(data.scheduledDate, "PPP") : ''} at ${scheduledTime} ${data.timeZone}. You can cancel it anytime before it sends.`
              }
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onComplete} className={sendingOption === 'now' ? 'bg-green-600 hover:bg-green-700' : ''}>
              {sendingOption === 'now' ? 'Send Now' : 'Confirm Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepFour;
