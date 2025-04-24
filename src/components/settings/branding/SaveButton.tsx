
import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onSave }) => {
  return (
    <div className="fixed bottom-8 right-8">
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700 shadow-lg"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default SaveButton;
