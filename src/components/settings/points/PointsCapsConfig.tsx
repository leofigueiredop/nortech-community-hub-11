
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';

const PointsCapsConfig: React.FC = () => {
  const { toast } = useToast();
  const [dailyCapsEnabled, setDailyCapsEnabled] = React.useState(true);
  const [weeklyCapsEnabled, setWeeklyCapsEnabled] = React.useState(true);
  const [monthlyCapsEnabled, setMonthlyCapsEnabled] = React.useState(false);
  
  const [caps, setCaps] = React.useState({
    daily: {
      login: 5,
      comment: 15,
      like: 10,
      course_completion: 100,
      event_participation: 50,
      referral: 50,
      total: 200
    },
    weekly: {
      login: 35,
      comment: 75,
      like: 50,
      course_completion: 300,
      event_participation: 150,
      referral: 125,
      total: 500
    },
    monthly: {
      login: 150,
      comment: 300,
      like: 200,
      course_completion: 500,
      event_participation: 400,
      referral: 500,
      total: 2000
    }
  });

  const handleCapChange = (period: 'daily' | 'weekly' | 'monthly', action: string, value: string) => {
    const points = parseInt(value) || 0;
    setCaps(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [action]: points
      }
    }));
  };

  const handleSave = () => {
    // Here we would save the settings to the backend
    console.log('Saving point caps:', {
      dailyCapsEnabled,
      weeklyCapsEnabled,
      monthlyCapsEnabled,
      caps
    });
    
    toast({
      title: "Settings saved",
      description: "Points caps configuration has been saved successfully.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Point Caps</CardTitle>
        <CardDescription>
          Set maximum limits for how many points users can earn in a given time period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="daily">Daily Caps</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Caps</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Caps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Daily Point Caps</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="daily-caps-toggle" className="text-sm text-muted-foreground">
                  Enable Daily Caps
                </Label>
                <Switch
                  id="daily-caps-toggle"
                  checked={dailyCapsEnabled}
                  onCheckedChange={setDailyCapsEnabled}
                />
              </div>
            </div>
            
            {dailyCapsEnabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daily-login-cap">Daily Login Cap</Label>
                    <Input 
                      id="daily-login-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.login}
                      onChange={(e) => handleCapChange('daily', 'login', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-comment-cap">Comments Cap</Label>
                    <Input 
                      id="daily-comment-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.comment}
                      onChange={(e) => handleCapChange('daily', 'comment', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-like-cap">Likes Cap</Label>
                    <Input 
                      id="daily-like-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.like}
                      onChange={(e) => handleCapChange('daily', 'like', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-course-cap">Course Completion Cap</Label>
                    <Input 
                      id="daily-course-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.course_completion}
                      onChange={(e) => handleCapChange('daily', 'course_completion', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-event-cap">Event Participation Cap</Label>
                    <Input 
                      id="daily-event-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.event_participation}
                      onChange={(e) => handleCapChange('daily', 'event_participation', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-referral-cap">Referral Cap</Label>
                    <Input 
                      id="daily-referral-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.referral}
                      onChange={(e) => handleCapChange('daily', 'referral', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="daily-total-cap">Total Daily Points Cap</Label>
                    <Input 
                      id="daily-total-cap" 
                      type="number" 
                      min="0"
                      value={caps.daily.total}
                      onChange={(e) => handleCapChange('daily', 'total', e.target.value)}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum total points a user can earn per day across all activities
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Weekly Point Caps</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="weekly-caps-toggle" className="text-sm text-muted-foreground">
                  Enable Weekly Caps
                </Label>
                <Switch
                  id="weekly-caps-toggle"
                  checked={weeklyCapsEnabled}
                  onCheckedChange={setWeeklyCapsEnabled}
                />
              </div>
            </div>
            
            {weeklyCapsEnabled && (
              <div className="space-y-4">
                {/* Similar structure to daily caps */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Weekly cap controls */}
                  <div className="space-y-2">
                    <Label htmlFor="weekly-login-cap">Weekly Login Cap</Label>
                    <Input 
                      id="weekly-login-cap" 
                      type="number" 
                      min="0"
                      value={caps.weekly.login}
                      onChange={(e) => handleCapChange('weekly', 'login', e.target.value)}
                    />
                  </div>
                  {/* More controls... */}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="weekly-total-cap">Total Weekly Points Cap</Label>
                    <Input 
                      id="weekly-total-cap" 
                      type="number" 
                      min="0"
                      value={caps.weekly.total}
                      onChange={(e) => handleCapChange('weekly', 'total', e.target.value)}
                      className="max-w-xs"
                    />
                    <p className="text-sm text-muted-foreground">
                      Maximum total points a user can earn per week across all activities
                    </p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Monthly Point Caps</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="monthly-caps-toggle" className="text-sm text-muted-foreground">
                  Enable Monthly Caps
                </Label>
                <Switch
                  id="monthly-caps-toggle"
                  checked={monthlyCapsEnabled}
                  onCheckedChange={setMonthlyCapsEnabled}
                />
              </div>
            </div>
            
            {monthlyCapsEnabled && (
              <div className="space-y-4">
                {/* Monthly cap controls */}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="pt-6 flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsCapsConfig;
