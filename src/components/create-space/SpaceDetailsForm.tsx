
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SpaceDetailsFormProps {
  spaceType: {
    type: string;
    title: string;
    description: string;
    icon: React.ReactNode;
  } | null;
  spaceName: string;
  spaceDescription: string;
  onSpaceNameChange: (value: string) => void;
  onSpaceDescriptionChange: (value: string) => void;
  onGoBack: () => void;
  onCreateSpace: () => void;
}

const SpaceDetailsForm: React.FC<SpaceDetailsFormProps> = ({ 
  spaceType, 
  spaceName, 
  spaceDescription, 
  onSpaceNameChange, 
  onSpaceDescriptionChange, 
  onGoBack, 
  onCreateSpace 
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onGoBack}
          className="mb-4"
        >
          ← Back to space types
        </Button>
        
        <h1 className="text-2xl font-bold mb-2">Create {spaceType?.title} Space</h1>
        <p className="text-gray-500 dark:text-gray-400">{spaceType?.description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Space Details</CardTitle>
          <CardDescription>Configure the basic information for your new space.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Space name *</Label>
            <Input 
              id="name" 
              placeholder="Enter a name for your space" 
              value={spaceName}
              onChange={(e) => onSpaceNameChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Provide a short description of what this space is about" 
              className="min-h-[100px]"
              value={spaceDescription}
              onChange={(e) => onSpaceDescriptionChange(e.target.value)}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              className="w-full"
              onClick={onCreateSpace}
            >
              Create Space
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaceDetailsForm;
