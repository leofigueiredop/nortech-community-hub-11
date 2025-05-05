import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaving, onSave }) => {
  // @ts-expect-error: Type instantiation is excessively deep and possibly infinite.
  const { t } = useTranslation('common');
  return (
    <div className="fixed bottom-8 right-8">
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700 shadow-lg"
        translationKey={isSaving ? 'button.saving' : 'button.saveChanges'}
      />
    </div>
  );
};

export default SaveButton;
