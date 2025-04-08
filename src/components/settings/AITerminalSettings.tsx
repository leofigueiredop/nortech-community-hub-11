
import React from 'react';
import { useForm } from 'react-hook-form';
import { Terminal, Database, BookOpen, Calendar, Users, MessageSquare, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AITerminalFormValues {
  terminalEnabled: boolean;
  exposedData: string[];
  suggestionsEnabled: boolean;
  terminalName: string;
  terminalPersonality: string;
  memberAccess: string;
  logQueries: boolean;
}

const AITerminalSettings: React.FC = () => {
  const form = useForm<AITerminalFormValues>({
    defaultValues: {
      terminalEnabled: false,
      exposedData: ['events', 'courses'],
      suggestionsEnabled: true,
      terminalName: 'Nortech AI',
      terminalPersonality: 'helpful',
      memberAccess: 'all',
      logQueries: true,
    },
  });

  const watchTerminalEnabled = form.watch('terminalEnabled');

  const dataTypes = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'profiles', label: 'Member Profiles', icon: Users },
    { id: 'resources', label: 'Resources', icon: Layers },
  ];

  const personalityOptions = [
    { value: 'helpful', label: 'Helpful & Informative' },
    { value: 'friendly', label: 'Friendly & Conversational' },
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'enthusiastic', label: 'Enthusiastic & Energetic' },
  ];

  const onSubmit = (data: AITerminalFormValues) => {
    console.log('Saved AI Terminal Settings:', data);
    // In a real implementation, this would save to an API
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-600" />
          <CardTitle className="text-xl">AI Terminal</CardTitle>
        </div>
        <CardDescription>
          Configure an AI assistant that can answer questions about your community's content and help members navigate resources.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="terminalEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable AI Terminal</FormLabel>
                    <FormDescription>
                      Allow members to interact with an AI trained on your community's content
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {watchTerminalEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="terminalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Terminal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Nortech AI" {...field} />
                        </FormControl>
                        <FormDescription>
                          What members will see as the name of your AI assistant
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terminalPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Personality</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a personality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {personalityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How should the AI assistant communicate with members
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="memberAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Member Access</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All members</SelectItem>
                          <SelectItem value="paid">Paid members only</SelectItem>
                          <SelectItem value="premium">Premium members only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Control which members can access the AI Terminal
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Data Access</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-3 flex items-start gap-3">
                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Select which community data the AI Terminal can access to answer member questions
                    </p>
                  </div>
                  <div className="space-y-3 border rounded-md p-4">
                    {dataTypes.map((dataType) => (
                      <FormField
                        key={dataType.id}
                        control={form.control}
                        name="exposedData"
                        render={({ field }) => (
                          <FormItem key={dataType.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(dataType.id)}
                                onCheckedChange={(checked) => {
                                  const updatedData = checked
                                    ? [...field.value, dataType.id]
                                    : field.value?.filter((value) => value !== dataType.id);
                                  field.onChange(updatedData);
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <div className="flex items-center gap-1.5">
                                <dataType.icon className="h-4 w-4 text-gray-600" />
                                <FormLabel className="font-medium">{dataType.label}</FormLabel>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="suggestionsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Proactive suggestions</FormLabel>
                        <FormDescription>
                          Allow AI to proactively suggest courses, posts, and connections to members
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
                  name="logQueries"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Log member queries</FormLabel>
                        <FormDescription>
                          Record questions asked by members to improve AI responses over time
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
            
            <div className="flex justify-between items-center">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                Save Settings
              </Button>
              
              {watchTerminalEnabled && (
                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <span>Preview AI Terminal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AITerminalSettings;
