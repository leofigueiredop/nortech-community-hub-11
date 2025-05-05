import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Upload, Users, Sparkles, BookOpen, Image, PenLine, Calendar, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/ApiClient';
import { UUID } from '@/types/common';

const FinalStepForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create community and save settings
  useEffect(() => {
    const setupCommunity = async () => {
      try {
        setIsCreating(true);
        
        // Add detailed user object logging
        console.log("Current user object:", user);
        console.log("User authentication state:", {
          isAuthenticated: !!user,
          userId: user?.id,
          email: user?.email
        });
        
        // Check if user is authenticated
        if (!user) {
          navigate('/onboarding/creator');
          toast({
            title: "Authentication required",
            description: "Please create an account or sign in first",
            variant: "destructive"
          });
          return;
        }
        
        // Ensure user exists and has an ID
        if (!user.id) {
          console.error("User object exists but ID is missing:", user);
          throw new Error("User information is missing. Please log in again.");
        }
        
        // Get data from localStorage
        const communityType = localStorage.getItem('communityType') || 'education';
        const communityName = localStorage.getItem('communityName') || 'My Community';
        const communityDescription = localStorage.getItem('communityDescription');
        const selectedFeatures = JSON.parse(localStorage.getItem('selectedFeatures') || '[]');
        const membershipPlans = JSON.parse(localStorage.getItem('membershipPlans') || '[]');
        
        // Ensure the creator_id is properly typed as UUID and log it
        const creator_id = user.id as UUID;
        console.log("User object:", user);
        console.log("User ID (raw):", user.id);
        console.log("Creator ID (typed as UUID):", creator_id);
        console.log("Creator ID type:", typeof creator_id);
        
        const communityData = {
          name: communityName,
          description: communityDescription || `A new ${communityType} community`,
          creator_id: creator_id,
          status: 'active',
          is_private: communityType === 'internal',
          category: communityType || 'general',
          member_count: 0,
          domain: null,
          // Let the trigger handle slug generation
          slug: null,
          // Optional fields
          theme_config: null,
          api_keys: null,
          logo_url: null,
          banner_url: null
        };
        
        console.log("Final community data being sent:", communityData);
        console.log("Final community data creator_id type:", typeof communityData.creator_id);
        
        // Create community in Supabase with explicit type
        const createCommunityResult = await api.community.createCommunity(communityData);
        
        if (!createCommunityResult.ok) {
          console.error("API error response:", createCommunityResult.error);
          const errorMessage = createCommunityResult.error?.message || "Failed to create community";
          throw new Error(`Failed to create community: ${errorMessage}`);
        }
        
        const community = createCommunityResult.data;
        
        if (!community || !community.id) {
          throw new Error("Failed to retrieve community data after creation");
        }
        
        console.log("Community created successfully:", community);
        
        // Store data in localStorage instead of updating user profile
        // This avoids potential issues with profile table relationship
        localStorage.setItem('communityId', community.id);
        localStorage.setItem('communityName', community.name);
        localStorage.setItem('isOnboarded', 'true');
        
        // Also store selected features and membership plans
        localStorage.setItem('selectedFeatures', JSON.stringify(selectedFeatures));
        localStorage.setItem('membershipPlans', JSON.stringify(membershipPlans));
        
        // Award final achievement and mark onboarding complete
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('onboardingStep', 'complete');
        
        // Trigger confetti and show success
        launchConfetti();
        setIsCreating(false);
        setLoaded(true);
        
        setTimeout(() => {
          toast({
            title: "🎖️ Achievement Unlocked!",
            description: "🎉 Pioneer Creator Badge Earned (+50 XP)",
            duration: 5000,
          });
        }, 1000);
      } catch (err) {
        console.error("Error creating community:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setIsCreating(false);
        
        toast({
          title: "Error Creating Community",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    };
    
    if (user) {
      setupCommunity();
    } else {
      setError("You must be logged in to create a community");
      setIsCreating(false);
    }
  }, [user]);
  
  const launchConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Use different colors
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#7E69AB', '#4C9AFF', '#36B37E', '#FF5630', '#FFAB00'],
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#7E69AB', '#4C9AFF', '#36B37E', '#FF5630', '#FFAB00'],
      });
    }, 250);
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  if (isCreating) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-4xl font-bold">N</span>
            </div>
            
            <div className="w-full mb-6">
              <Progress value={95} className="h-2 w-full" />
              <p className="text-xs text-center text-muted-foreground mt-1">Setting up your community...</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-3">Creating Your Community</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              We're setting up your community and preparing everything for you. This will just take a moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-4xl font-bold">N</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="text-2xl font-bold mb-3 text-red-600">Something Went Wrong</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              We encountered an error while setting up your community: {error}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={100} className="h-2 w-full bg-green-100" />
            <p className="text-xs text-center text-green-600 font-medium mt-1">Setup Complete!</p>
          </div>
        </div>
        
        <div className={`text-center transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-2">Your Community Is Live! 🎉</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Congratulations on setting up your Nortech community! Here are some next steps to make it even better.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card className="border-2 hover:border-purple-600/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/settings/branding')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-1">Upload Your Logo & Brand</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your community's look and feel
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-purple-600/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/create-post')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <PenLine className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Create Your First Post</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome your members with your first update
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-purple-600/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/library')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-1">Add Content to the Library</h3>
                <p className="text-sm text-muted-foreground">
                  Upload courses, videos, or articles
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-purple-600/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/create-event')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-1">Schedule Your First Event</h3>
                <p className="text-sm text-muted-foreground">
                  Plan a workshop or interactive session
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            onClick={handleGetStarted} 
            className="bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalStepForm;
