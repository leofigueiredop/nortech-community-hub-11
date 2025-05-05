import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, MessageSquare, Layers, Users, Image, Book, HelpCircle, Inbox } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

type SpaceType = 'posts' | 'events' | 'chat' | 'course' | 'members' | 'images' | 'support' | 'faq';

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const CreateSpaceDialog: React.FC<CreateSpaceDialogProps> = ({ 
  open, 
  onOpenChange,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<SpaceType | null>(null);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation('common');
  
  const handleNext = () => {
    if (step === 1) {
      if (selectedType) {
        setStep(2);
      }
    } else if (step === 2) {
      if (spaceName.trim()) {
        // In a real implementation, this would create the space with the selected type and details
        console.log(`Creating space of type: ${selectedType}, name: ${spaceName}, description: ${spaceDescription}`);
        toast({
          title: "Space created",
          description: `Your ${selectedType} space "${spaceName}" has been created successfully.`,
        });
        onComplete?.();
        resetAndClose();
      } else {
        toast({
          title: "Missing information",
          description: "Please enter a name for your space.",
          variant: "destructive"
        });
      }
    }
  };
  
  const resetAndClose = () => {
    setStep(1);
    setSelectedType(null);
    setSpaceName('');
    setSpaceDescription('');
    onOpenChange(false);
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const spaceTypes = [
    { type: 'posts' as SpaceType, icon: <FileText className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.posts.label'), description: t('common:dashboard.createSpaceDialog.posts.description') },
    { type: 'events' as SpaceType, icon: <Calendar className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.events.label'), description: t('common:dashboard.createSpaceDialog.events.description') },
    { type: 'chat' as SpaceType, icon: <MessageSquare className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.chat.label'), description: t('common:dashboard.createSpaceDialog.chat.description') },
    { type: 'course' as SpaceType, icon: <Layers className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.course.label'), description: t('common:dashboard.createSpaceDialog.course.description') },
    { type: 'members' as SpaceType, icon: <Users className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.members.label'), description: t('common:dashboard.createSpaceDialog.members.description') },
    { type: 'images' as SpaceType, icon: <Image className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.images.label'), description: t('common:dashboard.createSpaceDialog.images.description') },
    { type: 'support' as SpaceType, icon: <Inbox className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.support.label'), description: t('common:dashboard.createSpaceDialog.support.description') },
    { type: 'faq' as SpaceType, icon: <HelpCircle className="h-5 w-5" />, label: t('common:dashboard.createSpaceDialog.faq.label'), description: t('common:dashboard.createSpaceDialog.faq.description') },
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-700">
        <DialogTitle className="text-xl font-semibold mb-4">
          {step === 1 ? t('common:dashboard.createSpaceDialog.chooseType') : t('common:dashboard.createSpaceDialog.spaceDetails')}
        </DialogTitle>
        
        {step === 1 && (
          <>
            <DialogDescription className="text-gray-300 mb-4">
              {t('common:dashboard.createSpaceDialog.selectType')}
            </DialogDescription>
            
            <div className="grid grid-cols-2 gap-3">
              {spaceTypes.map((space) => (
                <button
                  key={space.type}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md border transition-colors
                    ${selectedType === space.type
                      ? 'border-nortech-purple bg-nortech-purple/20'
                      : 'border-gray-700 hover:border-gray-600'
                    }`}
                  onClick={() => setSelectedType(space.type)}
                >
                  {space.icon}
                  <span>{space.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t('common:dashboard.createSpaceDialog.spaceName')}</Label>
              <Input 
                id="name" 
                placeholder={t('common:dashboard.createSpaceDialog.enterSpaceName')}
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">{t('common:dashboard.createSpaceDialog.descriptionOptional')}</Label>
              <Textarea 
                id="description" 
                placeholder={t('common:dashboard.createSpaceDialog.describeSpace')}
                value={spaceDescription}
                onChange={(e) => setSpaceDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex gap-2">
          {step === 2 && (
            <Button 
              variant="outline"
              className="py-6 text-base font-medium rounded-full border-white text-white hover:bg-white/20"
              onClick={handleBack}
            >
              {t('common:dashboard.createSpaceDialog.back')}
            </Button>
          )}
          
          <Button 
            className="flex-1 py-6 text-base font-medium rounded-full bg-white text-black hover:bg-gray-200"
            onClick={handleNext}
            disabled={step === 1 && !selectedType}
          >
            {step === 1 ? t('common:dashboard.createSpaceDialog.next') : t('common:dashboard.createSpaceDialog.createSpace')}
          </Button>
        </div>
        
        <DialogClose className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceDialog;
