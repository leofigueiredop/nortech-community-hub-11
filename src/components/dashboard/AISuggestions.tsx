import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Suggestion {
  id: number;
  title: string;
  tips: string[];
  action: string;
  path: string;
}

const AISuggestions: React.FC = () => {
  const { t } = useTranslation('common');
  const suggestions: Suggestion[] = [
    {
      id: 1,
      title: t('common:dashboard.aiSuggestions.basedOnSetup'),
      tips: [
        t('common:dashboard.aiSuggestions.createWelcomePost'),
        t('common:dashboard.aiSuggestions.sendEmailToInactive'),
        t('common:dashboard.aiSuggestions.addRewardToStore')
      ],
      action: t('common:dashboard.aiSuggestions.tryNow'),
      path: "/create-post"
    },
    {
      id: 2,
      title: t('common:dashboard.aiSuggestions.engagementOpportunities'),
      tips: [
        t('common:dashboard.aiSuggestions.hostLiveQA'),
        t('common:dashboard.aiSuggestions.createChallenge'),
        t('common:dashboard.aiSuggestions.startDiscussion')
      ],
      action: t('common:dashboard.aiSuggestions.exploreIdeas'),
      path: "/events/create"
    },
    {
      id: 3,
      title: t('common:dashboard.aiSuggestions.growthSuggestions'),
      tips: [
        t('common:dashboard.aiSuggestions.shareOnSocial'),
        t('common:dashboard.aiSuggestions.offerFreeTier'),
        t('common:dashboard.aiSuggestions.createReferral')
      ],
      action: t('common:dashboard.aiSuggestions.growNow'),
      path: "/settings/marketing"
    }
  ];
  
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  
  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
  };
  
  const prevSuggestion = () => {
    setCurrentSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };
  
  const suggestion = suggestions[currentSuggestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          {t('common:dashboard.aiSuggestions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="min-h-32">
            <div className="flex items-start gap-2">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-medium text-lg">{suggestion.title}</h3>
                <ul className="mt-2 space-y-1">
                  {suggestion.tips.map((tip, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-nortech-purple rounded-full"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="mt-4 bg-nortech-purple hover:bg-nortech-purple/90"
                  onClick={() => window.location.href = suggestion.path}
                >
                  {suggestion.action}
                </Button>
              </div>
            </div>
          </div>
          
          {suggestions.length > 1 && (
            <div className="flex justify-center mt-2 gap-1">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={prevSuggestion}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {suggestions.map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className={`h-2 w-2 rounded-full p-0 ${i === currentSuggestion ? 'bg-nortech-purple' : 'bg-muted'}`}
                  onClick={() => setCurrentSuggestion(i)}
                />
              ))}
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={nextSuggestion}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
