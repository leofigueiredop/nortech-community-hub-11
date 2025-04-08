
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const SetupChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'basics',
      title: 'Basics',
      description: 'Complete your community profile, add branding elements, and configure basic settings.',
      completed: false
    },
    {
      id: 'spaces',
      title: 'Set up your spaces',
      description: 'Create spaces for different topics, courses, or communities within your platform.',
      completed: false
    },
    {
      id: 'paywall',
      title: 'Setup a paywall',
      description: 'Configure membership plans and payment options for premium content.',
      completed: false
    },
    {
      id: 'members',
      title: 'Invite your first members',
      description: 'Start growing your community by inviting your first members.',
      completed: false
    },
    {
      id: 'engagement',
      title: 'Kickstart engagement',
      description: 'Create your first posts and encourage members to participate.',
      completed: false
    },
    {
      id: 'join',
      title: 'Join the Nortech community',
      description: 'Connect with other community creators for tips and best practices.',
      completed: false
    }
  ]);

  const toggleItemCompletion = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h.01" />
            <path d="M15 9h.01" />
            <path d="M9 15h.01" />
            <path d="M15 15h.01" />
          </svg>
          Setup checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Separator />}
            <div className="flex items-start gap-3 py-2">
              <button 
                onClick={() => toggleItemCompletion(item.id)}
                className="mt-0.5 text-nortech-purple"
              >
                {item.completed ? (
                  <CheckCircle size={20} className="fill-nortech-purple text-white" />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-nortech-purple p-0 h-auto mt-1"
                    >
                      Learn more
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="text-sm mt-2 text-muted-foreground">
                    Additional details and instructions for {item.title.toLowerCase()} will be shown here.
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default SetupChecklist;
