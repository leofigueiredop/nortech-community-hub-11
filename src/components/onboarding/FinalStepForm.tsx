
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Upload, Users, Sparkles, BookOpen, Image, PenLine, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';

const FinalStepForm: React.FC = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  
  // Trigger confetti effect when component mounts
  useEffect(() => {
    // Small delay to ensure the component is fully rendered
    setTimeout(() => {
      launchConfetti();
      setLoaded(true);
    }, 500);
    
    // Award final achievement
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('onboardingStep', 'complete');
    
    setTimeout(() => {
      toast({
        title: "🎖️ Achievement Unlocked!",
        description: "🎉 Pioneer Creator Badge Earned (+50 XP)",
        duration: 5000,
      });
    }, 1000);
  }, []);
  
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
      
      // Since particles fall down, start a bit higher
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2) }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2) }
      });
    }, 250);
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center mb-4">
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
            <Card className="border-2 hover:border-nortech-purple/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/settings/branding')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Image className="h-6 w-6 text-nortech-purple" />
                </div>
                <h3 className="font-medium mb-1">Upload Your Logo & Brand</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your community's look and feel
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-nortech-purple/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/create-post')}>
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
            
            <Card className="border-2 hover:border-nortech-purple/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/create-space')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-1">Set Up Your First Space</h3>
                <p className="text-sm text-muted-foreground">
                  Create a dedicated area for specific content
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-nortech-purple/50 hover:shadow-md transition-all cursor-pointer" onClick={() => navigate('/events/create')}>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-1">Schedule Your First Event</h3>
                <p className="text-sm text-muted-foreground">
                  Plan a kickoff call or member meetup
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-lg mx-auto">
            <h3 className="font-medium text-lg mb-2 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
              Pioneer Creator Badge Earned!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've completed the onboarding process and earned your first achievement. 
              Find this and other badges in your creator profile.
            </p>
            <div className="bg-gray-100 p-3 rounded-md text-center">
              <p className="text-sm font-medium">+100 XP Awarded</p>
            </div>
          </div>
          
          <div className="bg-nortech-purple/10 p-6 rounded-lg mb-8 max-w-lg mx-auto">
            <h3 className="font-medium text-lg mb-2">Need help getting started?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Book a free 15-minute setup call with a Nortech community expert
            </p>
            <Button variant="outline" className="bg-white">
              Schedule a Call
            </Button>
          </div>
          
          <Button 
            className="bg-nortech-purple hover:bg-nortech-purple/90 w-full max-w-lg"
            size="lg"
            onClick={handleGoToDashboard}
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinalStepForm;
