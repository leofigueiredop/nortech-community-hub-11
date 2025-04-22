
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Award, ArrowRight, Download, BookOpen, User, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const Step7Completion: React.FC = () => {
  const { user, communityContext, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Trigger confetti animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    
    // Mark user as onboarded
    updateProfile({ isOnboarded: true });
    
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    // Navigate to the main dashboard
    navigate('/dashboard');
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
              <Star className="h-4 w-4" />
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome to {communityContext?.communityName}!
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Your account is all set up and ready to go
        </p>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-sm text-muted-foreground">
                {user?.accessLevel === 'premium' ? 'Premium Member' : 'Community Member'}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-primary/5 flex items-center">
              <Award className="h-3 w-3 mr-1" /> New Member
            </Badge>
            {user?.accessLevel === 'premium' && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 flex items-center">
                <Star className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
            <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 flex items-center">
              <BookOpen className="h-3 w-3 mr-1" /> Early Adopter
            </Badge>
          </div>
          
          <div className="text-sm mb-2">Earned:</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-amber-500 mr-1" />
              <span className="font-bold">50 XP</span>
            </div>
            <div>
              <Badge variant="outline" className="bg-primary/10">Onboarding Complete</Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <Button
            className="w-full"
            onClick={handleExplore}
          >
            Explore the Community <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" /> Get the Mobile App
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium mb-2">What's Next?</div>
          <div className="flex justify-center space-x-5 text-muted-foreground text-sm">
            <div className="flex flex-col items-center">
              <BookOpen className="h-5 w-5 mb-1" />
              <span>Explore content</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="h-5 w-5 mb-1" />
              <span>Join discussions</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-5 w-5 mb-1" />
              <span>Attend events</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step7Completion;
