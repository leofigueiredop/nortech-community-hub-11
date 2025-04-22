
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, BookOpen, Calendar, Users, Target, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EngagementAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xp: number;
  badge?: string;
}

const ENGAGEMENT_ACTIONS: EngagementAction[] = [
  {
    id: 'profile',
    title: 'Complete your profile',
    description: 'Add a photo and bio to let others know who you are',
    icon: <CheckCircle className="h-10 w-10 text-green-500" />,
    xp: 15,
    badge: 'Profile Pioneer'
  },
  {
    id: 'intro',
    title: 'Introduce yourself',
    description: 'Post a quick introduction in the community forum',
    icon: <Users className="h-10 w-10 text-indigo-500" />,
    xp: 10
  },
  {
    id: 'library',
    title: 'Explore the library',
    description: 'Check out the first recommended content for you',
    icon: <BookOpen className="h-10 w-10 text-amber-500" />,
    xp: 5
  },
  {
    id: 'event',
    title: 'RSVP to your first event',
    description: 'Join an upcoming community gathering or webinar',
    icon: <Calendar className="h-10 w-10 text-blue-500" />,
    xp: 10
  },
  {
    id: 'challenge',
    title: 'Join a weekly challenge',
    description: 'Participate in the current community challenge',
    icon: <Target className="h-10 w-10 text-rose-500" />,
    xp: 15
  }
];

const Step6Engagement: React.FC = () => {
  const { user, communityContext, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  
  const toggleAction = (actionId: string) => {
    setSelectedActions(current => 
      current.includes(actionId)
        ? current.filter(id => id !== actionId)
        : [...current, actionId]
    );
  };

  const totalXp = selectedActions.reduce((sum, actionId) => {
    const action = ENGAGEMENT_ACTIONS.find(a => a.id === actionId);
    return sum + (action?.xp || 0);
  }, 0);

  const handleSubmit = () => {
    // In a real app, we'd store these selected actions to guide the user after onboarding
    
    // Show toast with XP earned
    toast({
      title: `${totalXp} XP earned!`,
      description: `You've selected ${selectedActions.length} action${selectedActions.length !== 1 ? 's' : ''} to complete`,
    });
    
    // Move to final step
    updateOnboardingStep(7);
    navigate('/auth/completion');
  };

  const handleSkip = () => {
    // Just move to final step without selecting actions
    updateOnboardingStep(7);
    navigate('/auth/completion');
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Get Started with First Steps
        </h2>
        <p className="text-center text-muted-foreground mb-6">
          Choose actions to kickstart your journey in the community
        </p>
        
        <div className="space-y-4 mb-6">
          {ENGAGEMENT_ACTIONS.map((action) => (
            <div
              key={action.id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                selectedActions.includes(action.id)
                  ? 'bg-primary/10 border-primary border'
                  : 'border border-border hover:bg-muted/50'
              }`}
              onClick={() => toggleAction(action.id)}
            >
              <div className="flex-shrink-0 mr-4">
                {action.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{action.title}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="text-sm font-medium">{action.xp} XP</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                {action.badge && (
                  <Badge variant="outline" className="mt-2 bg-primary/5">
                    {action.badge} Badge
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted mb-6">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-1" />
            <span className="font-bold">{totalXp} XP</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="sm:flex-1"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            className="sm:flex-1"
            onClick={handleSubmit}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step6Engagement;
