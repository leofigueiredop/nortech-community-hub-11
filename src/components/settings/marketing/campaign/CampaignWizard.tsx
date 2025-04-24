
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';

interface CampaignWizardProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

const CampaignWizard: React.FC<CampaignWizardProps> = ({ isOpen, onClose, campaignId }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('1');
  const [campaignData, setCampaignData] = useState({
    name: '',
    audience: 'all',
    tag: '',
    subject: '',
    previewText: '',
    content: '',
    scheduledDate: null as Date | null,
    timeZone: 'UTC'
  });
  
  const handleNext = () => {
    const nextStep = String(Number(currentStep) + 1);
    setCurrentStep(nextStep);
  };
  
  const handlePrevious = () => {
    const prevStep = String(Number(currentStep) - 1);
    setCurrentStep(prevStep);
  };
  
  const handleSave = () => {
    toast({
      title: "Campaign Saved",
      description: campaignData.scheduledDate ? "Your campaign has been scheduled." : "Your campaign has been saved as a draft.",
    });
    onClose();
  };
  
  const updateCampaignData = (data: Partial<typeof campaignData>) => {
    setCampaignData({...campaignData, ...data});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {campaignId ? 'Edit Campaign' : 'Create New Campaign'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentStep} className="pt-2">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1" disabled>1. Campaign Info</TabsTrigger>
            <TabsTrigger value="2" disabled>2. Build Email</TabsTrigger>
            <TabsTrigger value="3" disabled>3. Preview & Test</TabsTrigger>
            <TabsTrigger value="4" disabled>4. Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="1" className="pt-6">
            <StepOne 
              data={campaignData}
              updateData={updateCampaignData}
              onNext={handleNext}
            />
          </TabsContent>
          
          <TabsContent value="2" className="pt-6">
            <StepTwo 
              data={campaignData}
              updateData={updateCampaignData}
              onNext={handleNext}
              onBack={handlePrevious}
            />
          </TabsContent>
          
          <TabsContent value="3" className="pt-6">
            <StepThree 
              data={campaignData}
              updateData={updateCampaignData}
              onNext={handleNext}
              onBack={handlePrevious}
            />
          </TabsContent>
          
          <TabsContent value="4" className="pt-6">
            <StepFour 
              data={campaignData}
              updateData={updateCampaignData}
              onComplete={handleSave}
              onBack={handlePrevious}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignWizard;
