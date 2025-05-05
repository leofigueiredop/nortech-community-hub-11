import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { api } from '../../api';

const formSchema = z.object({
  communityName: z.string().min(2, 'Community name must be at least 2 characters'),
  communitySlug: z.string().min(2, 'URL must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'URL can only contain lowercase letters, numbers, and hyphens')
});

type FormData = z.infer<typeof formSchema>;

const CommunityForm: React.FC = () => {
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityName: '',
      communitySlug: '',
    },
  });

  const updateSlug = (value: string) => {
    const slug = value.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    form.setValue('communitySlug', slug);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a community",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the community in Supabase
      const { error: communityError } = await api.supabase
        .from('communities')
        .insert([{
          name: data.communityName,
          description: 'A new learning community',
          creator_id: user.id,
          domain: data.communitySlug,
          status: 'active',
          theme_config: {}, // Initialize empty theme config
          api_keys: {}, // Initialize empty API keys
          is_private: false // Default to public community
        }]);

      if (communityError) {
        console.error('Community creation error:', communityError);
        throw communityError;
      }
      
      // Store community data in localStorage
      localStorage.setItem('communityName', data.communityName);
      localStorage.setItem('communityDescription', 'A new learning community');
      localStorage.setItem('onboardingStep', '3');
      
      // Show achievement badge
      setShowBadge(true);
      
      // Show achievement toast
      toast({
        title: "🎖️ Achievement Unlocked!",
        description: "Community named (+15 XP) - 50% completed!",
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate('/onboarding/features');
      }, 1500);
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create community",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto relative">
      {showBadge && (
        <div className="absolute -top-5 -right-5 bg-purple-600 text-white p-2 rounded-full animate-bounce shadow-lg">
          <Sparkles className="h-6 w-6" />
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
          
          <div className="w-full mb-6">
            <Progress value={50} className="h-2 w-full" />
            <p className="text-xs text-center text-muted-foreground mt-1">Step 3 of 6</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Name your community</h2>
        <p className="text-center text-muted-foreground mb-8">
          Choose a name that reflects your community's purpose
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="communityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Community Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="e.g. Design Masters" 
                      onChange={(e) => {
                        field.onChange(e);
                        updateSlug(e.target.value);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="communitySlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community URL</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="bg-gray-100 dark:bg-gray-800 border border-r-0 rounded-l-md px-3 flex items-center text-gray-500">
                        <span className="text-sm">nortech.app/</span>
                      </div>
                      <Input 
                        {...field}
                        placeholder="your-community" 
                        className="rounded-l-none"
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">You can always change this later.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommunityForm;
