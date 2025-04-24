
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Save, Plus, MessageCircle, GraduationCap, Heart, Users, Flag, Award } from 'lucide-react';
import { toast } from 'sonner';
import { POINTS_VALUES } from '@/context/PointsContext';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { PointAction, ActionCategory } from '@/types/points-config';

const pointsActions: PointAction[] = [
  {
    id: 'login',
    name: 'Daily Login',
    description: 'Points awarded for logging in daily',
    defaultPoints: POINTS_VALUES.login,
    category: 'engagement',
    icon: <Flag className="h-4 w-4" />
  },
  {
    id: 'comment',
    name: 'Comments',
    description: 'Points for posting a comment on content',
    defaultPoints: POINTS_VALUES.comment,
    category: 'social',
    icon: <MessageCircle className="h-4 w-4" />
  },
  {
    id: 'like',
    name: 'Likes',
    description: 'Points for liking content',
    defaultPoints: POINTS_VALUES.like,
    category: 'social',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: 'course_completion',
    name: 'Course Completion',
    description: 'Points for completing a course',
    defaultPoints: POINTS_VALUES.course_completion,
    category: 'education',
    icon: <GraduationCap className="h-4 w-4" />
  },
  {
    id: 'event_participation',
    name: 'Event Participation',
    description: 'Points for participating in an event',
    defaultPoints: POINTS_VALUES.event_participation,
    category: 'engagement',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'referral',
    name: 'User Referral',
    description: 'Points for referring a new user',
    defaultPoints: POINTS_VALUES.referral,
    category: 'social',
    icon: <Award className="h-4 w-4" />
  }
];

const categoryColors: Record<ActionCategory, string> = {
  engagement: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  education: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  social: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};

const PointsActionsConfig: React.FC = () => {
  const [actionSettings, setActionSettings] = React.useState(() => 
    pointsActions.reduce((acc, action) => ({
      ...acc,
      [action.id]: {
        enabled: true,
        points: action.defaultPoints
      }
    }), {})
  );
  
  const [selectedCategory, setSelectedCategory] = React.useState<ActionCategory | 'all'>('all');
  const [showAddAction, setShowAddAction] = React.useState(false);
  const [newAction, setNewAction] = React.useState({
    name: '',
    description: '',
    points: 5,
    category: 'engagement' as ActionCategory
  });

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
    
    toast.success("Points action configuration has been saved successfully.");
  };

  const handleAddNewAction = () => {
    // In a real implementation, this would add the new action to the backend
    toast.success(`New action "${newAction.name}" added successfully`);
    setShowAddAction(false);
    setNewAction({
      name: '',
      description: '',
      points: 5,
      category: 'engagement'
    });
  };

  const filteredActions = selectedCategory === 'all' 
    ? pointsActions 
    : pointsActions.filter(action => action.category === selectedCategory);

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
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'} 
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Actions
            </Badge>
            <Badge 
              variant={selectedCategory === 'engagement' ? 'default' : 'outline'} 
              className={`cursor-pointer ${selectedCategory === 'engagement' ? '' : categoryColors.engagement}`}
              onClick={() => setSelectedCategory('engagement')}
            >
              Engagement
            </Badge>
            <Badge 
              variant={selectedCategory === 'education' ? 'default' : 'outline'} 
              className={`cursor-pointer ${selectedCategory === 'education' ? '' : categoryColors.education}`}
              onClick={() => setSelectedCategory('education')}
            >
              Education
            </Badge>
            <Badge 
              variant={selectedCategory === 'social' ? 'default' : 'outline'} 
              className={`cursor-pointer ${selectedCategory === 'social' ? '' : categoryColors.social}`}
              onClick={() => setSelectedCategory('social')}
            >
              Social
            </Badge>
          </div>
          
          {filteredActions.map((action) => (
            <div key={action.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${categoryColors[action.category]}`}>
                    {action.icon}
                  </div>
                  <h3 className="text-base font-medium">{action.name}</h3>
                  <Badge variant="outline" className={categoryColors[action.category]}>
                    {action.category}
                  </Badge>
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
          
          <Dialog open={showAddAction} onOpenChange={setShowAddAction}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Add New Action
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Point Action</DialogTitle>
                <DialogDescription>
                  Create a new action that users can earn points from.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="action-name">Action Name</Label>
                  <Input 
                    id="action-name" 
                    value={newAction.name} 
                    onChange={(e) => setNewAction({...newAction, name: e.target.value})} 
                    placeholder="e.g. Quiz Completion"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action-description">Description</Label>
                  <Input 
                    id="action-description" 
                    value={newAction.description} 
                    onChange={(e) => setNewAction({...newAction, description: e.target.value})} 
                    placeholder="e.g. Points for completing a quiz"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action-points">Points</Label>
                  <Input 
                    id="action-points" 
                    type="number" 
                    min="0"
                    value={newAction.points} 
                    onChange={(e) => setNewAction({...newAction, points: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action-category">Category</Label>
                  <select
                    id="action-category"
                    value={newAction.category}
                    onChange={(e) => setNewAction({...newAction, category: e.target.value as ActionCategory})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="education">Education</option>
                    <option value="social">Social</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddAction(false)}>Cancel</Button>
                <Button onClick={handleAddNewAction}>Add Action</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
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
