import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslation } from 'react-i18next';

interface ChecklistItem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  completed: boolean;
  path: string;
}

const SetupChecklist: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [items, setItems] = useState<ChecklistItem[]>([]);

  // Dynamically update items when language changes
  useEffect(() => {
    setItems([
      {
        id: 'basics',
        title: t('common:dashboard.setupChecklist.basics.title'),
        emoji: '📋',
        description: t('common:dashboard.setupChecklist.basics.description'),
        completed: true,
        path: '/settings/general'
      },
      {
        id: 'spaces',
        title: t('common:dashboard.setupChecklist.spaces.title'),
        emoji: '🧩',
        description: t('common:dashboard.setupChecklist.spaces.description'),
        completed: false,
        path: '/create-space'
      },
      {
        id: 'paywall',
        title: t('common:dashboard.setupChecklist.paywall.title'),
        emoji: '💰',
        description: t('common:dashboard.setupChecklist.paywall.description'),
        completed: false,
        path: '/settings/paywall'
      },
      {
        id: 'members',
        title: t('common:dashboard.setupChecklist.members.title'),
        emoji: '👥',
        description: t('common:dashboard.setupChecklist.members.description'),
        completed: false,
        path: '/settings/integration'
      },
      {
        id: 'post',
        title: t('common:dashboard.setupChecklist.post.title'),
        emoji: '✏️',
        description: t('common:dashboard.setupChecklist.post.description'),
        completed: false,
        path: '/create-post'
      },
      {
        id: 'join',
        title: t('common:dashboard.setupChecklist.join.title'),
        emoji: '🤝',
        description: t('common:dashboard.setupChecklist.join.description'),
        completed: false,
        path: '/settings/general'
      }
    ]);
  }, [t, i18n.language]);

  const toggleItemCompletion = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const completedSteps = items.filter(item => item.completed).length;
  const totalSteps = items.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleNavigate = (item: ChecklistItem) => {
    // Navigate logic here (would use react-router-dom's useNavigate in a real app)
    console.log(`Navigating to ${item.path}`);
    window.location.href = item.path;
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
          {t('common:dashboard.setupChecklist.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{completedSteps}/{totalSteps} {t('common:dashboard.setupChecklist.stepsComplete')}</span>
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
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
                <h3 className="font-medium flex items-center gap-2">
                  <span>{item.emoji}</span> {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="mt-2 flex">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-nortech-purple border-nortech-purple/30 hover:bg-nortech-purple/10"
                    onClick={() => handleNavigate(item)}
                  >
                    {t('common:dashboard.setupChecklist.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Collapsible className="ml-2">
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="link" 
                        className="text-nortech-purple p-0 h-auto mt-1"
                        size="sm"
                      >
                        {t('common:dashboard.setupChecklist.learnMore')}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="text-sm mt-2 text-muted-foreground">
                      {t('dashboard.setupChecklist.additionalDetails', {
                         defaultValue: '0',
                         item: item.title.toLowerCase(),
                       })}  
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default SetupChecklist;
