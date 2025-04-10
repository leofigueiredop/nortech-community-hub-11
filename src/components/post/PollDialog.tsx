
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';

interface PollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pollQuestion: string;
  setPollQuestion: (question: string) => void;
  pollOptions: string[];
  setPollOptions: (options: string[]) => void;
  allowSeeResults: boolean;
  setAllowSeeResults: (allow: boolean) => void;
  setEndDate: boolean;
  setSetEndDate: (set: boolean) => void;
  onSavePoll: () => void;
}

const PollDialog: React.FC<PollDialogProps> = ({
  open,
  onOpenChange,
  pollQuestion,
  setPollQuestion,
  pollOptions,
  setPollOptions,
  allowSeeResults,
  setAllowSeeResults,
  setEndDate,
  setSetEndDate,
  onSavePoll
}) => {
  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Insert a poll</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a poll for community engagement
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium mb-2">Ask a question</h3>
            <Input
              placeholder="Type your question here"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Options</h3>
            {pollOptions.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mb-2"
              />
            ))}
            
            <Button 
              variant="outline" 
              className="border-dashed border-gray-600 text-gray-400 w-full mt-2"
              onClick={handleAddPollOption}
            >
              <PlusCircle size={16} className="mr-2" /> Add option
            </Button>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Settings</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allow-results" 
                  checked={allowSeeResults}
                  onCheckedChange={(checked) => setAllowSeeResults(checked as boolean)} 
                />
                <label htmlFor="allow-results" className="text-sm">
                  Allow members to see results
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="end-date" 
                  checked={setEndDate}
                  onCheckedChange={(checked) => setSetEndDate(checked as boolean)} 
                />
                <label htmlFor="end-date" className="text-sm">
                  Set an end date
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            className="border-gray-700 text-gray-300"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-nortech-purple hover:bg-nortech-purple/90"
            onClick={onSavePoll}
            disabled={!pollQuestion || pollOptions.some(opt => !opt.trim())}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PollDialog;
