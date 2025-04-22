
import React, { useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader } from 'lucide-react';

const OnboardingLayout: React.FC = () => {
  const { communityId } = useParams();
  const { user, isLoading, communityContext, currentOnboardingStep } = useAuth();
  const navigate = useNavigate();
  
  // Calculate progress
  const totalSteps = 7;
  const progressPercentage = (currentOnboardingStep / totalSteps) * 100;
  
  // Dynamic styles based on community branding
  const brandColors = {
    primaryColor: communityContext?.branding?.primaryColor || '#8B5CF6',
    textColor: '#FFFFFF'
  };
  
  const gradientBg = {
    background: `linear-gradient(to bottom, ${brandColors.primaryColor}33, ${brandColors.primaryColor}11)`
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={gradientBg}>
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4" style={gradientBg}>
      <div className="w-full max-w-md mx-auto">
        {/* Branding header */}
        {communityContext && (
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md overflow-hidden mb-2">
              {communityContext.branding.logo ? (
                <img 
                  src={communityContext.branding.logo} 
                  alt={`${communityContext.communityName} logo`}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center font-bold text-3xl"
                  style={{ backgroundColor: brandColors.primaryColor, color: brandColors.textColor }}
                >
                  {communityContext.communityName.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-center mb-1">{communityContext.communityName}</h1>
            <p className="text-sm text-muted-foreground">by {communityContext.creatorName}</p>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="w-full mb-6">
          <Progress value={progressPercentage} className="h-2 w-full" />
          <p className="text-xs text-center text-muted-foreground mt-1">
            Step {currentOnboardingStep} of {totalSteps}
          </p>
        </div>
        
        {/* Onboarding step content */}
        <div className="w-full">
          <Outlet />
        </div>
        
        {/* Achievement badge when completing steps */}
        {currentOnboardingStep > 1 && (
          <div className="fixed bottom-10 right-10 animate-bounce">
            <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingLayout;
