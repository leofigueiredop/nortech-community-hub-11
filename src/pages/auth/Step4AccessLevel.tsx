
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Lock, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Step4AccessLevel: React.FC = () => {
  const { user, updateProfile, updateOnboardingStep, communityContext } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectFree = () => {
    updateProfile({ accessLevel: 'free' });
    
    toast({
      title: "Free membership selected",
      description: "You now have access to the community's free content",
    });
    
    // Move to next step
    updateOnboardingStep(5);
    navigate('/auth/interests');
  };

  const handleSelectPremium = () => {
    updateProfile({ accessLevel: 'premium' });
    
    toast({
      title: "🎉 Premium membership activated!",
      description: "You now have full access to all premium content",
    });
    
    // Move to next step
    updateOnboardingStep(5);
    navigate('/auth/interests');
  };
  
  // If user already has premium access from invite link
  if (user?.accessLevel === 'premium' || communityContext?.entryType === 'premium') {
    return (
      <Card className="w-full shadow-lg animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-sm">
              <Star className="h-4 w-4 mr-2" /> Premium Access Granted
            </Badge>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            Premium Access Activated
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            You have full access to all premium content and features
          </p>
          
          <div className="border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Your Premium Benefits:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Exclusive premium content access
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Priority support from community leaders
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Access to mentorship and premium events
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Exclusive badges and rewards
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={() => {
              updateOnboardingStep(5);
              navigate('/auth/interests');
            }}
            className="w-full"
          >
            Continue to Next Step <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Choose Your Access Level
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Select the type of membership that works for you
        </p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          {/* Free Option */}
          <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
            <div className="mb-4">
              <Badge>Free</Badge>
            </div>
            <h3 className="text-lg font-medium mb-2">Free Member</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join the community and access free content
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Access to free forums
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Basic content library
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Earn XP and badges
              </li>
            </ul>
            <Button 
              onClick={handleSelectFree}
              className="w-full"
              variant="outline"
            >
              Join for Free
            </Button>
          </div>
          
          {/* Premium Option */}
          <div className="border rounded-lg p-4 bg-muted/30 border-primary cursor-pointer transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
              Recommended
            </div>
            <div className="mb-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Premium</Badge>
            </div>
            <h3 className="text-lg font-medium mb-2">Premium Member</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get full access to all premium content and features
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                All free features included
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Exclusive premium content
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Mentorship access
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Exclusive events and workshops
              </li>
            </ul>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  Upgrade Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upgrade to Premium</DialogTitle>
                  <DialogDescription>
                    Get full access to all premium content and features for {communityContext?.communityName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Monthly Membership</h3>
                    <p className="text-2xl font-bold mb-1">$9.99<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
                    <p className="text-sm text-muted-foreground mb-4">Cancel anytime</p>
                    <Button onClick={handleSelectPremium} className="w-full">
                      Subscribe
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">
                      Best Value
                    </div>
                    <h3 className="font-medium mb-2">Annual Membership</h3>
                    <p className="text-2xl font-bold mb-1">$99.99<span className="text-sm font-normal text-muted-foreground"> / year</span></p>
                    <p className="text-sm text-muted-foreground mb-4">Save 16% compared to monthly</p>
                    <Button onClick={handleSelectPremium} className="w-full">
                      Subscribe & Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            You can always upgrade later from your profile settings
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4AccessLevel;
