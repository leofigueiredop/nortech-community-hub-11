
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, ArrowRight, Star, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  memberLimit: string;
  buttonText: string;
}

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

const CommunityTemplatesForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template-1');
  const [communityType, setCommunityType] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [currentStep, setCurrentStep] = useState<'templates' | 'plans'>('templates');

  useEffect(() => {
    // Get the community type from localStorage
    const storedType = localStorage.getItem('communityType');
    setCommunityType(storedType);
  }, []);

  const getRecommendedPlan = (type: string | null): string => {
    switch (type) {
      case 'education':
        return 'growth';
      case 'mastermind':
        return 'professional';
      case 'product':
        return 'professional';
      case 'internal':
        return 'growth';
      default:
        return 'free';
    }
  };

  const getTypeLabel = (type: string | null): string => {
    switch (type) {
      case 'education':
        return 'education/courses';
      case 'mastermind':
        return 'mastermind/mentorship';
      case 'product':
        return 'product/SaaS';
      case 'internal':
        return 'internal team';
      default:
        return 'custom';
    }
  };

  const handleContinue = () => {
    // Store the selected template and plan
    localStorage.setItem('selectedTemplate', selectedTemplate);
    localStorage.setItem('selectedPlan', selectedPlan || 'free');
    localStorage.setItem('onboardingStep', '4');
    
    // Show achievement badge
    setShowBadge(true);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Community setup completed (+25 XP) - 66% completed!",
      duration: 3000,
    });
    
    // In a real app, you would process payment for paid plans here
    if (selectedPlan && selectedPlan !== 'free') {
      // Using the standard toast instead of toast.success
      toast({
        title: "Plan selected!",
        description: "In a real app, you would go to checkout now.",
        duration: 3000,
      });
    }
    
    setTimeout(() => {
      // Navigate to member invites
      navigate('/onboarding/invite-members');
    }, 1500);
  };

  const templates: TemplateOption[] = [
    {
      id: 'template-1',
      title: 'Standard Template',
      description: 'A complete setup with all the essential features',
      imageSrc: '/placeholder.svg',
    },
    {
      id: 'template-2',
      title: 'Minimal Setup',
      description: 'Start with the basics and add features as you grow',
      imageSrc: '/placeholder.svg',
    },
    {
      id: 'blank',
      title: 'Blank Community',
      description: 'Start from scratch and build your community your way',
      imageSrc: '/placeholder.svg',
    },
  ];

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for small communities just getting started',
      memberLimit: 'Up to 100 members',
      features: [
        'Basic discussion forums',
        'Simple events calendar',
        'Community announcements',
        'Email notifications'
      ],
      recommended: getRecommendedPlan(communityType) === 'free',
      buttonText: 'Start for Free'
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$49',
      description: 'For growing communities with more engagement needs',
      memberLimit: 'Up to 1,000 members',
      features: [
        'Advanced discussion features',
        'Content library & courses',
        'Custom branding',
        'Analytics dashboard',
        'Advanced moderation tools'
      ],
      recommended: getRecommendedPlan(communityType) === 'growth',
      buttonText: 'Choose Growth'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$89',
      description: 'For established communities needing premium features',
      memberLimit: 'Up to 10,000 members',
      features: [
        'White-label solution',
        'API access',
        'SSO integration',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      recommended: getRecommendedPlan(communityType) === 'professional',
      buttonText: 'Choose Professional'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      description: 'For large communities with advanced requirements',
      memberLimit: 'Unlimited members',
      features: [
        'Dedicated account manager',
        'Custom feature development',
        'Advanced security',
        'Multiple admin roles',
        'Enterprise SLAs',
        'Onboarding assistance'
      ],
      recommended: getRecommendedPlan(communityType) === 'enterprise',
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <Card className="w-full max-w-5xl mx-auto relative">
      {showBadge && (
        <div className="absolute -top-5 -right-5 bg-nortech-purple text-white p-2 rounded-full animate-bounce shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={66.6} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 4 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Set up your community</h2>
        
        {communityType && (
          <p className="text-center text-muted-foreground mb-4">
            Based on your choice of a {getTypeLabel(communityType)} community, we recommend the {plans.find(p => p.recommended)?.name} Plan.
          </p>
        )}
        
        <Tabs defaultValue="templates" value={currentStep} onValueChange={(value) => setCurrentStep(value as 'templates' | 'plans')} className="mt-8">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="templates" className="flex-1">1. Choose a Template</TabsTrigger>
            <TabsTrigger value="plans" className="flex-1">2. Select a Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? 'ring-2 ring-nortech-purple' : ''
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    toast({
                      title: "Template selected",
                      description: `You've selected the ${template.title} template.`,
                      duration: 1500,
                    });
                  }}
                >
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                    <img src={template.imageSrc} alt={template.title} className="h-32 w-auto" />
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 bg-nortech-purple text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => navigate('/onboarding/community-type')}
              >
                Previous
              </Button>
              
              <Button 
                variant="default"
                className="bg-nortech-purple hover:bg-nortech-purple/90"
                onClick={() => {
                  setCurrentStep('plans');
                  toast({
                    title: "+10 XP Earned!",
                    description: "Template selected successfully",
                    duration: 1500,
                  });
                }}
              >
                Continue to Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg p-6 relative cursor-pointer hover:shadow-md ${
                    selectedPlan === plan.id ? 'ring-2 ring-nortech-purple' : ''
                  } ${plan.recommended ? 'bg-slate-50' : ''}`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    toast({
                      title: "Plan selected",
                      description: `You've selected the ${plan.name} plan.`,
                      duration: 1500,
                    });
                  }}
                >
                  {plan.recommended && (
                    <div className="absolute -top-2 -right-2 bg-nortech-purple text-white text-xs px-2 py-1 rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="text-2xl font-bold mb-2">{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="text-sm font-medium mb-1">{plan.memberLimit}</div>
                  
                  <ul className="mt-4 space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep('templates')}
              >
                Previous
              </Button>
              
              <Button 
                variant="default"
                className="bg-nortech-purple hover:bg-nortech-purple/90"
                onClick={handleContinue}
                disabled={!selectedPlan}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CommunityTemplatesForm;
