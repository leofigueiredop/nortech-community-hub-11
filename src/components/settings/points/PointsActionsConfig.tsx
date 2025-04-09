
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { POINTS_VALUES } from '@/context/PointsContext';

const pointsActions = [
  {
    id: 'login',
    name: 'Daily Login',
    description: 'Points awarded for logging in daily',
    defaultPoints: POINTS_VALUES.login
  },
  {
    id: 'comment',
    name: 'Comments',
    description: 'Points for posting a comment on content',
    defaultPoints: POINTS_VALUES.comment
  },
  {
    id: 'like',
    name: 'Likes',
    description: 'Points for liking content',
    defaultPoints: POINTS_VALUES.like
  },
  {
    id: 'course_completion',
    name: 'Course Completion',
    description: 'Points for completing a course',
    defaultPoints: POINTS_VALUES.course_completion
  },
  {
    id: 'event_participation',
    name: 'Event Participation',
    description: 'Points for participating in an event',
    defaultPoints: POINTS_VALUES.event_participation
  },
  {
    id: 'referral',
    name: 'User Referral',
    description: 'Points for referring a new user',
    defaultPoints: POINTS_VALUES.referral
  }
];

const PointsActionsConfig: React.FC = () => {
  const { toast } = useToast();
  const [actionSettings, setActionSettings] = React.useState(() => 
    pointsActions.reduce((acc, action) => ({
      ...acc,
      [action.id]: {
        enabled: true,
        points: action.defaultPoints
      }
    }), {})
  );

  const handleToggleAction = (actionId: string) => {
    setActionSettings(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        enabled: !prev[actionId].enabled
      }
    }));
  };

  const handlePointsChange = (actionId: string, value: string) => {
    const points = parseInt(value) || 0;
    setActionSettings(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        points
      }
    }));
  };

  const handleSave = () => {
    // Here we would save the settings to the backend
    console.log('Saving points action settings:', actionSettings);
    
    toast({
      title: "Settings saved",
      description: "Points action configuration has been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points Actions</CardTitle>
        <CardDescription>
          Configure which actions earn points and how many points each action is worth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {pointsActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium">{action.name}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{action.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-20">
                  <Label htmlFor={`points-${action.id}`} className="sr-only">
                    Points for {action.name}
                  </Label>
                  <Input
                    id={`points-${action.id}`}
                    type="number"
                    min="0"
                    value={actionSettings[action.id].points}
                    onChange={(e) => handlePointsChange(action.id, e.target.value)}
                    disabled={!actionSettings[action.id].enabled}
                    className="text-right"
                  />
                </div>
                
                <Switch
                  checked={actionSettings[action.id].enabled}
                  onCheckedChange={() => handleToggleAction(action.id)}
                />
              </div>
            </div>
          ))}
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsActionsConfig;
