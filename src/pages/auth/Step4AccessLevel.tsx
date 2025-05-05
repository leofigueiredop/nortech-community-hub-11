import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Lock, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

const Step4AccessLevel: React.FC = () => {
  const { t } = useTranslation('auth');
  const { user, updateProfile, updateOnboardingStep, communityContext } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectFree = () => {
    updateProfile({ accessLevel: 'free' });
    
    toast({
      // @ts-expect-error i18next typing
      title: t('accessLevel.free.toastTitle'),
      // @ts-expect-error i18next typing
      description: t('accessLevel.free.toastDescription'),
    });
    
    // Move to next step
    updateOnboardingStep(5);
    navigate('/auth/interests');
  };

  const handleSelectPremium = () => {
    updateProfile({ accessLevel: 'premium' });
    
    toast({
      // @ts-expect-error i18next typing
      title: t('accessLevel.premium.toastTitle'),
      // @ts-expect-error i18next typing
      description: t('accessLevel.premium.toastDescription'),
    });
    
    // Move to next step
    updateOnboardingStep(5);
    navigate('/auth/interests');
  };
  
  // If user already has premium access from invite link
  if (user?.accessLevel === 'premium' || communityContext?.entryType === 'premium') {
    return (
      <Card className="w-full shadow-lg animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 text-sm">
              <Star className="h-4 w-4 mr-2" />
              {/* @ts-expect-error i18next typing */}
              {t('accessLevel.premium.granted')}
            </Badge>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.activated')}</h2>
          <p className="text-center text-muted-foreground mb-8">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.activatedDescription')}</p>
          
          <div className="border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2 flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefitsTitle')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit1')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit2')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit3')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit4')}
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={() => {
              updateOnboardingStep(5);
              navigate('/auth/interests');
            }}
            className="w-full"
          >
            {/* @ts-expect-error i18next typing */}{t('accessLevel.continue')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.title')}</h2>
        <p className="text-center text-muted-foreground mb-6">{/* @ts-expect-error i18next typing */}{t('accessLevel.subtitle')}</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
          {/* Free Option */}
          <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
            <div className="mb-4">
              <Badge>{/* @ts-expect-error i18next typing */}{t('accessLevel.free.badge')}</Badge>
            </div>
            <h3 className="text-lg font-medium mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.free.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {/* @ts-expect-error i18next typing */}{t('accessLevel.free.description')}
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.free.benefit1')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.free.benefit2')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.free.benefit3')}
              </li>
            </ul>
            <Button 
              onClick={handleSelectFree}
              className="w-full"
              variant="outline"
            >
              {/* @ts-expect-error i18next typing */}{t('accessLevel.free.button')}
            </Button>
          </div>
          
          {/* Premium Option */}
          <div className="border rounded-lg p-4 bg-muted/30 border-primary cursor-pointer transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
              {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.recommended')}
            </div>
            <div className="mb-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.badge')}</Badge>
            </div>
            <h3 className="text-lg font-medium mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.description')}
            </p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit1')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit2')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit3')}
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.benefit4')}
              </li>
            </ul>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.button')}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.dialogTitle')}</DialogTitle>
                  <DialogDescription>{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.dialogDescription', { community: communityContext?.communityName })}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.monthlyTitle')}</h3>
                    <p className="text-2xl font-bold mb-1">$9.99<span className="text-sm font-normal text-muted-foreground"> / {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.month')}</span></p>
                    <p className="text-sm text-muted-foreground mb-4">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.cancelAnytime')}</p>
                    <Button onClick={handleSelectPremium} className="w-full">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.subscribe')}</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl">
                      {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.bestValue')}
                    </div>
                    <h3 className="font-medium mb-2">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.annualTitle')}</h3>
                    <p className="text-2xl font-bold mb-1">$99.99<span className="text-sm font-normal text-muted-foreground"> / {/* @ts-expect-error i18next typing */}{t('accessLevel.premium.year')}</span></p>
                    <p className="text-sm text-muted-foreground mb-4">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.saveCompared')}</p>
                    <Button onClick={handleSelectPremium} className="w-full">{/* @ts-expect-error i18next typing */}{t('accessLevel.premium.subscribeSave')}</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {/* @ts-expect-error i18next typing */}{t('accessLevel.upgradeLater')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4AccessLevel;
