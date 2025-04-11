
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, BookOpen, Brain, Puzzle, Briefcase, Target } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  communityType: z.enum(['education', 'mastermind', 'product', 'internal', 'other']),
  rememberChoice: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

interface CommunityTypeOption {
  value: 'education' | 'mastermind' | 'product' | 'internal' | 'other';
  label: string;
  icon: React.ReactNode;
  description: string;
}

const CommunityTypeForm: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityType: undefined,
      rememberChoice: true,
    },
  });

  const communityTypes: CommunityTypeOption[] = [
    {
      value: 'education',
      label: '🧑‍🏫 Education / Courses',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      description: 'For teaching courses, sharing learning materials, and engaging students.'
    },
    {
      value: 'mastermind',
      label: '🧠 Mastermind or Mentorship',
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      description: 'For coaching groups, accountability circles, and expert communities.'
    },
    {
      value: 'product',
      label: '🧩 Product or SaaS Community',
      icon: <Puzzle className="h-6 w-6 text-green-500" />,
      description: 'For product users, customers, and fans of your brand or service.'
    },
    {
      value: 'internal',
      label: '💼 Internal Team / Private Workspace',
      icon: <Briefcase className="h-6 w-6 text-amber-500" />,
      description: 'For company teams, organizations, and private collaboration spaces.'
    },
    {
      value: 'other',
      label: '🎯 Other (custom)',
      icon: <Target className="h-6 w-6 text-red-500" />,
      description: 'Design your own community from scratch for specific needs.'
    },
  ];

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
    // Store the community type selection in localStorage
    localStorage.setItem('communityType', data.communityType);
    // Go to next step (community setup)
    navigate('/onboarding/community');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">N</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">What type of community are you building?</h2>
        <p className="text-center text-muted-foreground mb-8">
          This helps us personalize your setup experience with relevant templates
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="communityType"
              render={({ field }) => (
                <FormItem className="space-y-5">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 gap-4"
                  >
                    {communityTypes.map((type) => (
                      <FormItem key={type.value} className="flex">
                        <FormControl>
                          <RadioGroupItem
                            value={type.value}
                            id={type.value}
                            className="peer sr-only"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={type.value}
                          className="flex flex-1 items-start space-x-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:border-primary"
                        >
                          <div className="flex-shrink-0">
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rememberChoice"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Remember my choice to suggest templates later
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-nortech-purple hover:bg-nortech-purple/90"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CommunityTypeForm;
