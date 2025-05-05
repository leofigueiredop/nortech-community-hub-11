import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Upload, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;
const Step3ProfileSetup = () => {
  /* @ts-expect-error i18next typing */
  const { t } = useTranslation();
  const { user, updateProfile, updateOnboardingStep } = useAuth();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || ''
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      ...data,
      avatar: avatarPreview || undefined
    });
    
    toast({
      // @ts-expect-error i18next typing
      title: t('profile.toastTitle'),
      // @ts-expect-error i18next typing
      description: t('profile.toastDescription'),
    });
    
    // Move to next step
    updateOnboardingStep(4);
    navigate('/auth/access-level');
  };

  const handleSkip = () => {
    // Just move to next step without updating profile
    updateOnboardingStep(4);
    navigate('/auth/access-level');
  };

  return (
    <Card className="w-full shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold text-center mb-2">{t('auth:profile.title')}</h2>
        <p className="text-center text-muted-foreground mb-6">{t('auth:profile.subtitle')}</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar upload section */}
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={avatarPreview || undefined} alt={user?.name} />
                <AvatarFallback className="bg-primary text-lg">
                  {user?.name?.charAt(0) || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              
              <label 
                htmlFor="avatar-upload" 
                className="flex items-center justify-center px-4 py-2 rounded-md bg-muted hover:bg-muted/80 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload avatar</span>
                {/* @ts-expect-error i18next typing */}
                <span>{t('profile.uploadAvatar')}</span>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth:profile.displayName')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('auth:profile.displayNamePlaceholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth:profile.bio')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      // @ts-expect-error i18next typing
                      placeholder={t('auth:profile.bioPlaceholder')}
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button 
                type="button" 
                variant="outline"
                className="sm:flex-1"
                onClick={handleSkip}
              >
                {/* @ts-expect-error i18next typing */}
                {t('profile.skip')}
              </Button>
              <Button 
                type="submit" 
                className="sm:flex-1"
              >
                {/* @ts-expect-error i18next typing */}
                {t('profile.continue')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step3ProfileSetup;
