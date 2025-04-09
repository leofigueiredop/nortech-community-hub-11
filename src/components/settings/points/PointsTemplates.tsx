
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'balanced',
    name: 'Balanced Engagement',
    description: 'A balanced approach that rewards all activities equally',
    features: [
      'Daily login: 5 points',
      'Comments: 3 points',
      'Likes: 1 point',
      'Course completion: 50 points',
      'Event participation: 20 points',
      'Referrals: 25 points'
    ],
    recommended: true
  },
  {
    id: 'content-creation',
    name: 'Content Creation Focus',
    description: 'Prioritize content creation and meaningful engagement',
    features: [
      'Daily login: 3 points',
      'Comments: 10 points',
      'Likes: 1 point',
      'Course completion: 30 points',
      'Event participation: 15 points',
      'Referrals: 20 points'
    ]
  },
  {
    id: 'community-growth',
    name: 'Community Growth',
    description: 'Emphasis on growing the community through referrals',
    features: [
      'Daily login: 3 points',
      'Comments: 5 points',
      'Likes: 1 point',
      'Course completion: 25 points',
      'Event participation: 20 points',
      'Referrals: 50 points'
    ]
  }
];

const PointsTemplates: React.FC = () => {
  const { toast } = useToast();
  
  const handleApplyTemplate = (templateId: string) => {
    // Here we would apply the template configuration
    console.log('Applying template:', templateId);
    
    const templateName = templates.find(t => t.id === templateId)?.name;
    
    toast({
      title: "Template applied",
      description: `The "${templateName}" template has been applied successfully.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={template.recommended ? 'border-purple-300 dark:border-purple-800' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.recommended && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Recommended
                  </Badge>
                )}
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <ul className="text-sm space-y-1">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleApplyTemplate(template.id)} 
                variant={template.recommended ? "default" : "outline"}
                className="w-full"
              >
                Apply Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PointsTemplates;
