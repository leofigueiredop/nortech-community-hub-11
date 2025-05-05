import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Star, Sparkles, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const PremiumContentUpgrade: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation('common');
  const translate = t as (key: string) => string;
  
  const handleUpgradeClick = () => {
    toast({
      title: translate('feed.premium.upgradeNow'),
      description: translate('feed.premium.unlockDesc'),
    });
  };
  
  return (
    <Card className="overflow-hidden border border-purple-200 dark:border-purple-900 shadow-sm">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
        <Lock className="w-12 h-12 mx-auto text-white mb-2" />
        <CardTitle className="text-2xl font-bold text-white text-center">
          {translate('feed.premium.unlockTitle')}
        </CardTitle>
        <CardDescription className="text-base text-purple-100 text-center">
          {translate('feed.premium.unlockDesc')}
        </CardDescription>
      </div>
      <CardContent className="space-y-6 pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Star className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{translate('feed.premium.exclusive')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {translate('feed.premium.exclusiveDesc')}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Sparkles className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{translate('feed.premium.early')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {translate('feed.premium.earlyDesc')}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{translate('feed.premium.support')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {translate('feed.premium.supportDesc')}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <Lock className="text-nortech-purple mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{translate('feed.premium.groups')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {translate('feed.premium.groupsDesc')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <Button 
          onClick={handleUpgradeClick}
          className="bg-nortech-purple hover:bg-nortech-purple/90 text-white font-semibold px-8 py-2"
        >
          {translate('feed.premium.upgradeNow')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumContentUpgrade;
