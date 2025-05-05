import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, PenLine, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  
  return (
    <Card className="bg-gradient-to-r from-nortech-purple to-purple-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-amber-200">✨</span> 
          {t('common:dashboard.welcome.title')}
        </CardTitle>
        <CardDescription className="text-gray-200">
          {t('common:dashboard.welcome.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6 flex items-center">
        <span className="mr-2">🚀</span>
          {t('common:dashboard.welcome.guide')}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => navigate('/settings/branding')}
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2"
          >
            <Image size={16} />
            {t('common:dashboard.welcome.customizeBranding')}
          </Button>
          <Button 
            onClick={() => navigate('/create-post')}
            className="bg-white text-nortech-purple hover:bg-white/90 flex items-center gap-2"
          >
            <PenLine size={16} />
            {t('common:dashboard.welcome.createFirstPost')}
          </Button>
          <Button 
            onClick={() => navigate('/settings')}
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-2"
          >
            <Settings size={16} />
            {t('common:dashboard.welcome.allSettings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
