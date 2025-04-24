
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface StepOneData {
  name: string;
  audience: string;
  tag: string;
}

interface StepOneProps {
  data: StepOneData;
  updateData: (data: Partial<StepOneData>) => void;
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ data, updateData, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name</Label>
        <Input 
          id="campaign-name"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="e.g. Monthly Newsletter - June 2023"
          required
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This is for your internal reference only.
        </p>
      </div>
      
      <div className="space-y-3">
        <Label>Choose Audience</Label>
        <RadioGroup 
          value={data.audience} 
          onValueChange={(value) => updateData({ audience: value })}
        >
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="all" id="all-members" />
            <Label htmlFor="all-members" className="flex-1 cursor-pointer">All Members</Label>
            <span className="text-sm text-gray-500">1,245 recipients</span>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="active" id="active-members" />
            <Label htmlFor="active-members" className="flex-1 cursor-pointer">Active Members Only</Label>
            <span className="text-sm text-gray-500">876 recipients</span>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3">
            <RadioGroupItem value="inactive" id="inactive-members" />
            <Label htmlFor="inactive-members" className="flex-1 cursor-pointer">Inactive Members</Label>
            <span className="text-sm text-gray-500">369 recipients</span>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="campaign-tag">Campaign Tag (Optional)</Label>
        <Input 
          id="campaign-tag"
          value={data.tag}
          onChange={(e) => updateData({ tag: e.target.value })}
          placeholder="e.g. newsletter, product-launch"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tags help you organize and filter campaigns in reports.
        </p>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit">Continue to Content</Button>
      </div>
    </form>
  );
};

export default StepOne;
