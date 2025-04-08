
import React, { useState } from 'react';
import { Check, Info, Users, MessageSquare, Terminal, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ContentGeneratorSettings from './ContentGeneratorSettings';
import AITerminalSettings from './AITerminalSettings';

interface AISettingsFormValues {
  contentCoPilotEnabled: boolean;
  transcriptionsEnabled: boolean;
  activityScoresEnabled: boolean;
  aiMatchmakerEnabled: boolean;
  matchFrequency: string;
  matchActiveOnly: boolean;
  matchCompletedCourseOnly: boolean;
}

const CommunityAISettings: React.FC = () => {
  const form = useForm<AISettingsFormValues>({
    defaultValues: {
      contentCoPilotEnabled: true,
      transcriptionsEnabled: true,
      activityScoresEnabled: true,
      aiMatchmakerEnabled: false,
      matchFrequency: 'weekly',
      matchActiveOnly: true,
      matchCompletedCourseOnly: false,
    },
  });

  const watchAiMatchmaker = form.watch('aiMatchmakerEnabled');

  const onSubmit = (data: AISettingsFormValues) => {
    console.log('Saved AI Settings:', data);
    // In a real implementation, this would save to an API
  };

  return (
    <Tabs defaultValue="features" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="features">AI Features</TabsTrigger>
        <TabsTrigger value="matchmaker">AI Matchmaker</TabsTrigger>
        <TabsTrigger value="content-generator">Content Generator</TabsTrigger>
        <TabsTrigger value="terminal">AI Terminal</TabsTrigger>
      </TabsList>

      <TabsContent value="features">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl">Community AI</CardTitle>
            </div>
            <CardDescription>
              Build and scale your community with the power of AI in Nortech.
              <a href="#" className="text-blue-400 hover:underline ml-1">Learn more</a>
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contentCoPilotEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div>
                          <FormLabel className="font-medium">Content co-pilot</FormLabel>
                          <FormDescription className="text-gray-500 dark:text-gray-400">
                            Helps you write, edit, and repurpose highly engaging content
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="transcriptionsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div>
                          <FormLabel className="font-medium">Automated transcriptions</FormLabel>
                          <FormDescription className="text-gray-500 dark:text-gray-400">
                            Make all your videos searchable and accessible
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="activityScoresEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div>
                          <FormLabel className="font-medium">Activity scores</FormLabel>
                          <FormDescription className="text-gray-500 dark:text-gray-400">
                            Help you measure and improve community engagement
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="aiMatchmakerEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                        <div>
                          <FormLabel className="font-medium">AI Matchmaker</FormLabel>
                          <FormDescription className="text-gray-500 dark:text-gray-400">
                            Suggest meaningful connections between community members
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Save Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="matchmaker">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-xl">AI Matchmaker</CardTitle>
            </div>
            <CardDescription>
              Connect your community members based on shared interests and goals. The AI will analyze profiles, 
              completed content, and activity patterns to suggest meaningful connections.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="aiMatchmakerEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable AI Matchmaker</FormLabel>
                        <FormDescription>
                          Automatically suggest connections between members
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {watchAiMatchmaker && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        AI Matchmaker analyzes member profiles, completed content, and interaction patterns to
                        suggest meaningful connections. Members will receive personalized connection
                        suggestions with context on why they might want to connect.
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="matchFrequency"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Suggestion Frequency</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type="single"
                              value={field.value}
                              onValueChange={(value) => {
                                if (value) field.onChange(value);
                              }}
                              className="justify-start"
                            >
                              <ToggleGroupItem value="daily" aria-label="Daily" className="text-sm">
                                Daily
                              </ToggleGroupItem>
                              <ToggleGroupItem value="weekly" aria-label="Weekly" className="text-sm">
                                Weekly
                              </ToggleGroupItem>
                              <ToggleGroupItem value="monthly" aria-label="Monthly" className="text-sm">
                                Monthly
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How often should we suggest new connections to members
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="matchActiveOnly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active members only</FormLabel>
                            <FormDescription>
                              Only suggest connections with members active in the last 30 days
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="matchCompletedCourseOnly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Course completion filter</FormLabel>
                            <FormDescription>
                              Only match members who have completed at least one course
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Save Settings
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="content-generator">
        <ContentGeneratorSettings />
      </TabsContent>

      <TabsContent value="terminal">
        <AITerminalSettings />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityAISettings;
