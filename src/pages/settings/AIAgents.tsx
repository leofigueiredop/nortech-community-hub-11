
import React, { useState } from 'react';
import { 
  Edit, Mic, Activity, Users, Bot, Save,
  MessageSquare, BrainCircuit, Terminal, Sparkles,
  Zap
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SupportCTA from '@/components/settings/marketing/SupportCTA';
import { AIFeature, AIAgent } from '@/types/ai-settings';

const aiFeatures: AIFeature[] = [
  {
    id: 'content-copilot',
    title: 'Content Co-Pilot',
    description: 'Use AI to help you create, edit and repurpose high-performing posts and captions.',
    status: 'active',
    icon: <Edit className="w-4 h-4" />,
  },
  {
    id: 'transcriptions',
    title: 'Automated Transcriptions',
    description: 'All videos and audio become searchable and accessible via instant transcriptions.',
    status: 'active',
    icon: <Mic className="w-4 h-4" />,
  },
  {
    id: 'activity-scores',
    title: 'Activity Scores',
    description: 'Get member engagement scores and activity heatmaps powered by behaviour tracking.',
    status: 'active',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'matchmaker',
    title: 'AI Matchmaker',
    description: 'Enable automatic connections between users based on interests and activity patterns.',
    status: 'active',
    icon: <Users className="w-4 h-4" />,
  },
];

const customAgents: AIAgent[] = [
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    description: 'Welcomes and guides new members through initial setup.',
    icon: <MessageSquare className="w-4 h-4" />,
    status: 'coming-soon',
  },
  {
    id: 'support',
    name: 'Support Agent',
    description: 'Answers FAQs and provides instant support using platform content.',
    icon: <BrainCircuit className="w-4 h-4" />,
    status: 'coming-soon',
  },
  {
    id: 'engagement',
    name: 'Engagement Bot',
    description: 'Sends automatic follow-ups, nudges, and reminders based on behaviour.',
    icon: <Bot className="w-4 h-4" />,
    status: 'coming-soon',
  },
];

const AIAgents: React.FC = () => {
  const [activeFeatures, setActiveFeatures] = useState<string[]>(['content-copilot', 'activity-scores']);
  const [contentFrequency, setContentFrequency] = useState('weekly');
  const [contentType, setContentType] = useState('polls');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleFeature = (featureId: string) => {
    setActiveFeatures(current =>
      current.includes(featureId)
        ? current.filter(id => id !== featureId)
        : [...current, featureId]
    );
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('AI settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsLayout activeSection="ai-agents" title="Community AI Platform">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Community AI Platform</h2>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure AI-powered features to increase engagement, automate community workflows, 
          and generate valuable content with smart insights.
        </p>

        <Tabs defaultValue="features" className="w-full">
          <TabsList>
            <TabsTrigger value="features">AI Features</TabsTrigger>
            <TabsTrigger value="matchmaker">AI Matchmaker</TabsTrigger>
            <TabsTrigger value="content">Content Generator</TabsTrigger>
            <TabsTrigger value="terminal">AI Terminal</TabsTrigger>
            <TabsTrigger value="custom" disabled>
              Custom AI Agents
              <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">Soon</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <div className="grid gap-4">
              {aiFeatures.map(feature => (
                <Card key={feature.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{feature.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={activeFeatures.includes(feature.id)}
                        onCheckedChange={() => handleToggleFeature(feature.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matchmaker">
            <Card>
              <CardHeader>
                <CardTitle>AI Matchmaker</CardTitle>
                <CardDescription>
                  Connect members based on common goals, completed content and engagement. 
                  Matches update weekly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable AI Matchmaker</h4>
                      <p className="text-sm text-gray-500">Automatically suggest connections between members</p>
                    </div>
                    <Switch
                      checked={activeFeatures.includes('matchmaker')}
                      onCheckedChange={() => handleToggleFeature('matchmaker')}
                    />
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example Match</h4>
                    <p className="text-sm">
                      You and Lucas both completed 3 courses on DeFi and participated in 2 discussions.
                    </p>
                    <div className="mt-3">
                      <Badge variant="secondary" className="mr-2">DeFi Fundamentals</Badge>
                      <Badge variant="secondary">Smart Contracts</Badge>
                    </div>
                  </div>

                  <Button variant="outline">
                    View Match History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Generator</CardTitle>
                <CardDescription>
                  Generate engaging content automatically to keep your community active
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Content Generator</h4>
                      <p className="text-sm text-gray-500">Automatically generate engaging content</p>
                    </div>
                    <Switch checked={activeFeatures.includes('content')} onCheckedChange={() => handleToggleFeature('content')} />
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Generation Frequency</label>
                      <Select value={contentFrequency} onValueChange={setContentFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content Type</label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="polls">Polls</SelectItem>
                          <SelectItem value="tips">Tips</SelectItem>
                          <SelectItem value="icebreakers">Icebreakers</SelectItem>
                          <SelectItem value="qa">Q&A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button variant="outline">
                    View Sample Suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terminal">
            <Card>
              <CardHeader>
                <CardTitle>AI Terminal</CardTitle>
                <CardDescription>
                  Allow users to ask questions about your community, events, content and members.
                  Based on your uploaded content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable AI Terminal</h4>
                      <p className="text-sm text-gray-500">Let members interact with your community AI</p>
                    </div>
                    <Switch checked={activeFeatures.includes('terminal')} onCheckedChange={() => handleToggleFeature('terminal')} />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">Example questions:</p>
                    <div className="space-y-2">
                      {['How do I complete the Web3 Starter path?', 'What\'s the next event I can join?'].map((q, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Terminal className="w-4 h-4" />
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <div className="grid md:grid-cols-2 gap-4">
              {customAgents.map(agent => (
                <Card key={agent.id} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-10" />
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                        {agent.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="w-4 h-4" />
            <span>Coming soon: Zapier, Make, and N8N integration</span>
          </div>
        </div>

        <SupportCTA 
          title="Need help setting up AI features?"
          description="Book a session with our AI experts to maximize your community engagement"
        />
      </div>
    </SettingsLayout>
  );
};

export default AIAgents;
