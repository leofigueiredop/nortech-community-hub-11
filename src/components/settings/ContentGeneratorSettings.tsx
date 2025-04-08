
import React from 'react';
import { Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ContentGeneratorFormValues {
  contentGeneratorEnabled: boolean;
  postFrequency: string;
  contentTypes: string[];
  toneSetting: string;
  categoryFilters: string[];
  autoApprove: boolean;
  engagementLearning: boolean;
}

const ContentGeneratorSettings: React.FC = () => {
  const form = useForm<ContentGeneratorFormValues>({
    defaultValues: {
      contentGeneratorEnabled: false,
      postFrequency: 'weekly',
      contentTypes: ['questions', 'polls'],
      toneSetting: 'friendly',
      categoryFilters: [],
      autoApprove: false,
      engagementLearning: true,
    },
  });

  const watchContentGenerator = form.watch('contentGeneratorEnabled');
  
  const onSubmit = (data: ContentGeneratorFormValues) => {
    console.log('Saved Content Generator Settings:', data);
    // In a real implementation, this would save to an API
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Community AI Content Generator</CardTitle>
        </div>
        <CardDescription>
          Automatically generate discussion prompts, polls, and content ideas to boost engagement in your community.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contentGeneratorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Content Generator</FormLabel>
                    <FormDescription>
                      Let AI suggest engaging content for your community
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {watchContentGenerator && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    The AI Content Generator will analyze your community's interests and activity to suggest
                    engaging content. You can review suggestions before they're posted or set them to auto-approve.
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="postFrequency"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Posting Frequency</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        How often should we generate new content suggestions
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contentTypes"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Types</FormLabel>
                      <FormDescription>
                        Select the types of content you want the AI to generate
                      </FormDescription>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant={field.value.includes('questions') ? "default" : "outline"}
                            onClick={() => {
                              const newValue = field.value.includes('questions')
                                ? field.value.filter(v => v !== 'questions')
                                : [...field.value, 'questions'];
                              field.onChange(newValue);
                            }}
                            className="flex items-center gap-2"
                          >
                            Open Questions
                          </Button>
                          <Button
                            type="button"
                            variant={field.value.includes('polls') ? "default" : "outline"}
                            onClick={() => {
                              const newValue = field.value.includes('polls')
                                ? field.value.filter(v => v !== 'polls')
                                : [...field.value, 'polls'];
                              field.onChange(newValue);
                            }}
                            className="flex items-center gap-2"
                          >
                            Polls
                          </Button>
                          <Button
                            type="button"
                            variant={field.value.includes('trending') ? "default" : "outline"}
                            onClick={() => {
                              const newValue = field.value.includes('trending')
                                ? field.value.filter(v => v !== 'trending')
                                : [...field.value, 'trending'];
                              field.onChange(newValue);
                            }}
                            className="flex items-center gap-2"
                          >
                            Trending Topics
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toneSetting"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Tone</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                          className="justify-start"
                        >
                          <ToggleGroupItem value="professional" aria-label="Professional" className="text-sm">
                            Professional
                          </ToggleGroupItem>
                          <ToggleGroupItem value="friendly" aria-label="Friendly" className="text-sm">
                            Friendly
                          </ToggleGroupItem>
                          <ToggleGroupItem value="casual" aria-label="Casual" className="text-sm">
                            Casual
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormDescription>
                        Set the tone for generated content
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="autoApprove"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto-approve content</FormLabel>
                        <FormDescription>
                          Automatically publish AI-generated content without review
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
                  name="engagementLearning"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Learn from engagement</FormLabel>
                        <FormDescription>
                          AI will learn from which posts get the most engagement
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
  );
};

export default ContentGeneratorSettings;
