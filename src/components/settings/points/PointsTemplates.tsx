
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BookCheck, Users, Trophy, Eye, Settings } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import { PointTemplate } from '@/types/points-config';

const pointsTemplates: PointTemplate[] = [
  {
    id: 'educational',
    name: 'Educational Community',
    description: 'Optimized for learning platforms with course completion rewards',
    type: 'educational',
    icon: <BookCheck className="h-8 w-8 text-green-500" />,
    recommendedFor: 'Course platforms, bootcamps, and learning communities',
    pointValues: {
      login: 2,
      comment: 5,
      like: 1,
      course_completion: 50,
      event_participation: 20,
      referral: 30
    },
    caps: {
      daily: { login: 2, comment: 20, like: 10, course_completion: 200, event_participation: 40, referral: 60, total: 250 },
      weekly: { login: 14, comment: 75, like: 50, course_completion: 500, event_participation: 100, referral: 150, total: 750 },
      monthly: { login: 60, comment: 300, like: 200, course_completion: 2000, event_participation: 400, referral: 600, total: 3000 }
    }
  },
  {
    id: 'social',
    name: 'Social Community',
    description: 'Perfect for discussion-based communities that value engagement',
    type: 'social',
    icon: <Users className="h-8 w-8 text-blue-500" />,
    recommendedFor: 'Forums, discussion groups, and social networks',
    pointValues: {
      login: 1,
      comment: 10,
      like: 2,
      course_completion: 25,
      event_participation: 30,
      referral: 50
    },
    caps: {
      daily: { login: 1, comment: 50, like: 20, course_completion: 100, event_participation: 60, referral: 100, total: 200 },
      weekly: { login: 7, comment: 200, like: 100, course_completion: 300, event_participation: 150, referral: 200, total: 500 },
      monthly: { login: 30, comment: 800, like: 400, course_completion: 1000, event_participation: 600, referral: 500, total: 2000 }
    }
  },
  {
    id: 'gaming',
    name: 'Gamified Community',
    description: 'High-engagement system with rich rewards and achievements',
    type: 'gaming',
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
    recommendedFor: 'Gaming communities, challenges and contest platforms',
    pointValues: {
      login: 5,
      comment: 5,
      like: 1,
      course_completion: 100,
      event_participation: 50,
      referral: 100
    },
    caps: {
      daily: { login: 5, comment: 25, like: 15, course_completion: 300, event_participation: 150, referral: 200, total: 500 },
      weekly: { login: 35, comment: 100, like: 70, course_completion: 700, event_participation: 350, referral: 500, total: 1500 },
      monthly: { login: 150, comment: 400, like: 300, course_completion: 2500, event_participation: 1500, referral: 2000, total: 5000 }
    }
  }
];

interface PointsTemplatesProps {
  onApplyTemplate: (template: PointTemplate) => void;
}

const PointsTemplates: React.FC<PointsTemplatesProps> = ({ onApplyTemplate }) => {
  const [previewTemplate, setPreviewTemplate] = React.useState<PointTemplate | null>(null);

  const handleApplyTemplate = (template: PointTemplate) => {
    onApplyTemplate(template);
    toast.success(`Applied ${template.name} template successfully`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pointsTemplates.map((template) => (
        <Card key={template.id} className="overflow-hidden relative hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                {template.icon}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 cursor-help">
                      Recommended
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    <p className="text-sm">{template.recommendedFor}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardTitle className="mt-2">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Login:</span>
                <span className="font-medium">{template.pointValues.login} points</span>
              </div>
              <div className="flex justify-between">
                <span>Comment:</span>
                <span className="font-medium">{template.pointValues.comment} points</span>
              </div>
              <div className="flex justify-between">
                <span>Course completion:</span>
                <span className="font-medium">{template.pointValues.course_completion} points</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" onClick={() => setPreviewTemplate(template)}>
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{template.name} Preview</DialogTitle>
                  <DialogDescription>
                    See how this template would configure your points system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <h4 className="font-medium">Point Values</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(template.pointValues).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{value} points</span>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="font-medium pt-2">Daily Caps</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(template.caps.daily).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key === 'total' ? 'Daily Total' : key.replace('_', ' ')}:</span>
                        <span className="font-medium">{value} points max</span>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={() => handleApplyTemplate(template)} className="w-full">
              <Settings className="w-4 h-4 mr-2" /> Customize
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PointsTemplates;
