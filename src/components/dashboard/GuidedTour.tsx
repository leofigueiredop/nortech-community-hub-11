
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Image, Layout, BookOpen, PlayCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: {
    label: string;
    path: string;
  };
}

const GuidedTour: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showVideoOption, setShowVideoOption] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is the first time visiting dashboard after onboarding
    const completedOnboarding = localStorage.getItem('selectedTemplate') && 
                              localStorage.getItem('selectedPlan');
    const tourCompleted = localStorage.getItem('guidedTourCompleted') === 'true';
    
    if (completedOnboarding && !tourCompleted) {
      // Small delay to let dashboard render first
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSkip = () => {
    localStorage.setItem('guidedTourCompleted', 'true');
    setOpen(false);
  };

  const handleGoToStep = (path: string) => {
    localStorage.setItem('guidedTourCompleted', 'true');
    setOpen(false);
    navigate(path);
  };
  
  const tourSteps: TourStep[] = [
    {
      id: 'branding',
      title: 'Customize Your Brand',
      description: 'Upload your logo and set your community colors to match your brand identity.',
      icon: <Image className="h-10 w-10 text-purple-500" />,
      action: {
        label: 'Customize Branding',
        path: '/settings/branding'
      }
    },
    {
      id: 'space',
      title: 'Create Your First Space',
      description: 'Spaces help organize your community content into dedicated areas for different topics or purposes.',
      icon: <Layout className="h-10 w-10 text-blue-500" />,
      action: {
        label: 'Create a Space',
        path: '/create-space'
      }
    },
    {
      id: 'content',
      title: 'Create Your First Content',
      description: 'Share updates, start discussions, or create educational content for your community.',
      icon: <BookOpen className="h-10 w-10 text-green-500" />,
      action: {
        label: 'Create Content',
        path: '/create-post'
      }
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 bg-gradient-to-r from-nortech-purple to-purple-700 text-white">
          <DialogTitle className="text-2xl">Welcome to Your Community Dashboard</DialogTitle>
          <DialogDescription className="text-gray-100">
            Let's get you started with a few quick steps to set up your community.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="steps" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="steps" className="flex-1">Quick Start Guide</TabsTrigger>
              {showVideoOption && (
                <TabsTrigger value="video" className="flex-1">Video Walkthrough</TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="steps" className="pt-2 px-6 pb-6">
            <div className="space-y-6 mt-2">
              {tourSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className="flex gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-nortech-purple text-white text-sm rounded-full">
                        {index + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <Button 
                      onClick={() => handleGoToStep(step.action.path)}
                      className="bg-nortech-purple hover:bg-nortech-purple/90"
                    >
                      {step.action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {showVideoOption && (
            <TabsContent value="video" className="px-6 pb-6">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 text-nortech-purple mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Video walkthrough would be embedded here
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
        
        <DialogFooter className="p-4 bg-gray-50 border-t flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleSkip} className="gap-1">
                  <X className="h-4 w-4" />
                  Skip Tour
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>You can always access this guide later from help menu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="space-x-2">
            {showVideoOption && (
              <Button 
                variant="outline" 
                onClick={() => setShowVideoOption(false)}
              >
                Hide Video Option
              </Button>
            )}
            {!showVideoOption && (
              <Button 
                variant="outline" 
                onClick={() => setShowVideoOption(true)}
              >
                Show Video Walkthrough
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuidedTour;
