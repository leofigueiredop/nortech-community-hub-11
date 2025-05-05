import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FeatureItem {
  id: string;
  name: string;
  category: 'Core' | 'Community' | 'Education' | 'Engagement' | 'Monetization' | 'Marketing' | 'Analytics';
  checked: boolean;
  icon: React.ReactNode;
}

const badgeColorMap = {
  Core: 'bg-blue-100 text-blue-800',
  Community: 'bg-green-100 text-green-800',
  Education: 'bg-purple-100 text-purple-800',
  Engagement: 'bg-yellow-100 text-yellow-800',
  Monetization: 'bg-pink-100 text-pink-800',
  Marketing: 'bg-orange-100 text-orange-800',
  Analytics: 'bg-indigo-100 text-indigo-800',
};

const FeaturesForm: React.FC = () => {
  const [showBadge, setShowBadge] = useState(false);
  const [features, setFeatures] = useState<FeatureItem[]>([
    { id: 'feed', name: 'Feed', category: 'Core', checked: true, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"/><path d="M14 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"/><path d="M4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"/><path d="M14 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1z"/></svg> },
    { id: 'discussions', name: 'Discussions', category: 'Community', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg> },
    { id: 'content-library', name: 'Content Library', category: 'Core', checked: true, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { id: 'courses', name: 'Courses', category: 'Education', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { id: 'events', name: 'Events', category: 'Community', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> },
    { id: 'matchmaker', name: 'Matchmaker', category: 'Community', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'points-rewards', name: 'Points & Rewards', category: 'Engagement', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> },
    { id: 'members', name: 'Members', category: 'Community', checked: true, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'analytics', name: 'Analytics', category: 'Analytics', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'settings', name: 'Settings', category: 'Core', checked: true, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> },
    { id: 'affiliates', name: 'Affiliates', category: 'Monetization', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/></svg> },
    { id: 'support', name: 'Support', category: 'Core', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z"/></svg> },
    { id: 'marketplace', name: 'Marketplace', category: 'Monetization', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/></svg> },
    { id: 'newsletter', name: 'Newsletter', category: 'Marketing', checked: false, icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2"/><path d="M22 6v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6"/><path d="M2 6l10 7 10-7"/></svg> },
  ]);
  
  const navigate = useNavigate();

  const handleFeatureClick = (id: string) => {
    // Don't allow toggling off the Settings feature
    if (id === 'settings') return;
    
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => 
        feature.id === id ? { ...feature, checked: !feature.checked } : feature
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store feature selection
    localStorage.setItem('selectedFeatures', JSON.stringify(features.filter(f => f.checked).map(f => f.id)));
    localStorage.setItem('onboardingStep', '4');
    
    // Show achievement badge
    setShowBadge(true);
    
    // Show achievement toast
    toast({
      title: "🎖️ Achievement Unlocked!",
      description: "Features selected (+15 XP) - 67% completed!",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/onboarding/membership-plans');
    }, 1500);
  };
  
  const handleSkip = () => {
    // Default selection
    localStorage.setItem('selectedFeatures', JSON.stringify(features.filter(f => f.checked).map(f => f.id)));
    localStorage.setItem('onboardingStep', '4');
    
    navigate('/onboarding/membership-plans');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto relative">
      {showBadge && (
        <div className="absolute -top-5 -right-5 bg-purple-600 text-white p-2 rounded-full animate-bounce shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={67} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 4 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">What features would you like to start with?</h2>
        <p className="text-center text-muted-foreground mb-8">
          You can activate more later from your settings panel
        </p>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => {
              // Precompute this outside the JSX to avoid potential re-render issues
              const isDisabled = feature.id === 'settings';
              
              return (
                <div 
                  key={feature.id}
                  className="flex items-center space-x-3 border rounded-lg p-4 hover:border-purple-600/50 cursor-pointer"
                  onClick={() => !isDisabled && handleFeatureClick(feature.id)}
                >
                  <div className="flex-shrink-0 text-purple-600">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor={`feature-${feature.id}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {feature.name}
                      </Label>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-normal ${badgeColorMap[feature.category]}`}
                      >
                        {feature.category}
                      </Badge>
                    </div>
                  </div>
                  {/* Use a div with styling to show the checkbox state instead of the actual Checkbox component */}
                  <div className={`h-4 w-4 rounded-sm border ${
                    feature.checked 
                      ? 'bg-purple-600 border-purple-600 flex items-center justify-center text-white' 
                      : 'border-primary'
                  } ${isDisabled ? 'opacity-50' : ''}`}>
                    {feature.checked && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-8 flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
            
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-sm text-muted-foreground text-center">
          <p>Need custom modules or support for large communities?</p>
          <a href="https://nortech.app/support" className="text-purple-600 hover:underline">Talk to our team</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesForm;
