
import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Workflow, 
  PlusCircle, 
  User, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Link, 
  ZapOff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkflowCard from '@/components/settings/workflows/WorkflowCard';
import IntegrationCard from '@/components/settings/workflows/IntegrationCard';
import WorkflowDetailModal from '@/components/settings/workflows/WorkflowDetailModal';
import IntegrationModal from '@/components/settings/workflows/IntegrationModal';
import ComingSoonAlert from '@/components/settings/workflows/ComingSoonAlert';
import SupportCTA from '@/components/settings/marketing/SupportCTA';
import { toast } from '@/components/ui/use-toast';

// Workflow data
const workflowsData = [
  {
    id: 'onboarding',
    title: 'New Member Onboarding',
    description: 'Workflow for welcoming and onboarding new community members',
    status: 'active' as const,
    icon: <User className="h-4 w-4 text-indigo-600" />,
    iconColor: '#6366f1',
    steps: [
      { order: 1, title: 'Welcome email sent on join', day: 0, iconColor: '#6366f1', enabled: true },
      { order: 2, title: 'Community guidelines notification', day: 1, iconColor: '#6366f1', enabled: true },
      { order: 3, title: 'Profile completion reminder', day: 2, iconColor: '#6366f1', enabled: true },
      { order: 4, title: 'First discussion prompt', day: 7, iconColor: '#6366f1', enabled: true }
    ],
    impactCount: 1273,
    tags: ['Onboarding', 'Engagement']
  },
  {
    id: 'content',
    title: 'Content Engagement',
    description: 'Workflow to increase engagement with published content',
    status: 'active' as const,
    icon: <MessageSquare className="h-4 w-4 text-purple-600" />,
    iconColor: '#9333ea',
    steps: [
      { order: 1, title: 'New content notification', day: 0, iconColor: '#9333ea', enabled: true },
      { order: 2, title: 'Follow-up for non-readers', day: 3, iconColor: '#9333ea', enabled: true },
      { order: 3, title: 'Related content suggestion', day: 5, iconColor: '#9333ea', enabled: true },
      { order: 4, title: 'Feedback request', day: 7, iconColor: '#9333ea', enabled: true }
    ],
    impactCount: 856,
    tags: ['Content', 'Engagement', 'Retention']
  },
  {
    id: 'events',
    title: 'Event Reminders',
    description: 'Workflow for event notifications and follow-ups',
    status: 'paused' as const,
    icon: <Calendar className="h-4 w-4 text-blue-600" />,
    iconColor: '#2563eb',
    steps: [
      { order: 1, title: 'Event announcement', day: '-7', iconColor: '#2563eb', enabled: true },
      { order: 2, title: 'Event reminder', day: '-1', iconColor: '#2563eb', enabled: true },
      { order: 3, title: 'Last call notification', day: '-0.04', iconColor: '#2563eb', enabled: true },
      { order: 4, title: 'Post-event feedback request', day: '+1', iconColor: '#2563eb', enabled: true }
    ],
    impactCount: 492,
    tags: ['Events', 'Engagement']
  }
];

// Integration data
const integrationsData = [
  {
    id: 'zapier',
    name: 'Zapier',
    title: 'Zapier',
    description: 'Connect 6000+ apps with custom automations.',
    ctaLabel: 'Connect via Zapier',
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm-.002 18.354c-.608 0-1.1-.824-1.1-1.842s.492-1.842 1.1-1.842c.607 0 1.1.824 1.1 1.842s-.493 1.842-1.1 1.842zm4.33-8.051c-.749.698-1.495 1.913-2.585 3.973l-.039.071c-.282.505-.444.79-.627.941-.123.101-.267.154-.468.154-.48 0-.883-.428-.883-.937 0-.265.086-.566.464-1.16.839-1.316 1.334-2.035 1.67-2.433-1.044-.377-1.476-1.106-1.476-1.881 0-1.07.834-1.963 2.137-1.963 1.252 0 2.114.853 2.114 1.901 0 .489-.204.958-.307 1.171-.103.212-.52.991-.52.991-.128.237-.274.359-.446.359-.248 0-.446-.203-.446-.5 0-.2.261-.831.261-1.016 0-.527-.453-.845-.953-.845-.739 0-1.256.654-1.256 1.306 0 .506.364.883 1.116 1.139 2.631.899 2.785 1.41 2.785 2.047 0 .308-.103.615-.317.876z"/></svg>,
    color: '#FF4F00',
    instructions: 'Create a Zapier account, set up a new Zap with a webhook trigger, and paste the webhook URL here.',
    useCases: [
      'Notify Slack when a new member joins',
      'Add new members to your email marketing platform',
      'Create tasks in your project management tool when content is published',
      'Log event attendance in a spreadsheet'
    ]
  },
  {
    id: 'make',
    name: 'Make',
    title: 'Make',
    description: 'Visual workflows for powerful community logic.',
    ctaLabel: 'Explore Make Scenarios',
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.2 10.857L13.143.8a2.743 2.743 0 00-3.885 0L.801 9.257a2.743 2.743 0 000 3.885l9.457 9.457a2.743 2.743 0 003.885 0l9.057-9.057a2.743 2.743 0 000-3.686zM8.571 6.857A1.714 1.714 0 1110.286 8.571 1.714 1.714 0 018.571 6.857zm5.143 9.143a1.714 1.714 0 11-1.714-1.714 1.714 1.714 0 011.714 1.714z"/></svg>,
    color: '#4353FF',
    instructions: 'Set up a Make account, create a new scenario, add a webhook trigger, and paste the webhook URL here.',
    useCases: [
      'Build complex member onboarding flows with conditions',
      'Sync data between multiple platforms',
      'Send personalized messages based on member activity',
      'Create advanced event management workflows'
    ]
  },
  {
    id: 'n8n',
    name: 'n8n',
    title: 'n8n',
    description: 'Open-source automation – great for devs and power users.',
    ctaLabel: 'See n8n Templates',
    icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.898 14.205a3.999 3.999 0 13.205-3.205l9.205 9.205a2.266 2.266 0 11-3.205 3.205l-9.205-9.205zm-4.99-2.726v-9.07h9.069l-9.07 9.07z"/></svg>,
    color: '#6933FF',
    instructions: 'Set up n8n locally or use n8n.cloud, create a new workflow, add a webhook node, and paste the webhook URL here.',
    useCases: [
      'Self-hosted automation for complete data control',
      'Connect to databases and create custom data flows',
      'Build advanced integrations with custom code nodes',
      'Create API-based integrations with community platforms'
    ]
  }
];

const Workflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [workflowsState, setWorkflowsState] = useState(workflowsData);
  
  // Toggle workflow status
  const handleToggleWorkflowStatus = (id: string) => {
    setWorkflowsState(current =>
      current.map(workflow => {
        if (workflow.id === id) {
          const newStatus = workflow.status === 'active' ? 'paused' : 'active';
          toast({
            title: `Workflow ${newStatus}`,
            description: `${workflow.title} has been ${newStatus === 'active' ? 'activated' : 'paused'}.`,
          });
          return {
            ...workflow,
            status: newStatus as 'active' | 'paused'
          };
        }
        return workflow;
      })
    );
  };
  
  // Duplicate workflow
  const handleDuplicateWorkflow = (id: string) => {
    const workflowToDuplicate = workflowsState.find(w => w.id === id);
    if (!workflowToDuplicate) return;
    
    const duplicate = {
      ...workflowToDuplicate,
      id: `${id}-copy-${Date.now()}`,
      title: `${workflowToDuplicate.title} (Copy)`,
      status: 'paused' as const,
      impactCount: 0
    };
    
    setWorkflowsState(current => [...current, duplicate]);
    
    toast({
      title: 'Workflow duplicated',
      description: `${workflowToDuplicate.title} has been duplicated.`,
    });
  };
  
  // View workflow details
  const handleViewWorkflowDetails = (id: string) => {
    const workflow = workflowsState.find(w => w.id === id);
    if (workflow) {
      setSelectedWorkflow(workflow);
      setIsWorkflowModalOpen(true);
    }
  };
  
  // Toggle workflow step
  const handleToggleStep = (stepOrder: number) => {
    if (!selectedWorkflow) return;
    
    setSelectedWorkflow({
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.map((step: any) => 
        step.order === stepOrder 
          ? { ...step, enabled: !step.enabled } 
          : step
      )
    });
    
    toast({
      title: 'Step updated',
      description: `Workflow step has been ${
        selectedWorkflow.steps.find((s: any) => s.order === stepOrder)?.enabled ? 'disabled' : 'enabled'
      }.`,
    });
  };
  
  // Handle integration click
  const handleIntegrationClick = (id: string) => {
    const integration = integrationsData.find(i => i.id === id);
    if (integration) {
      setSelectedIntegration(integration);
      setIsIntegrationModalOpen(true);
    }
  };
  
  // Handle join waitlist
  const handleJoinWaitlist = () => {
    setIsComingSoonModalOpen(false);
    toast({
      title: 'Joined waitlist',
      description: 'You have successfully joined the Custom Workflow Builder beta waitlist.',
    });
  };

  return (
    <SettingsLayout activeSection="workflows" title="Workflow Automation">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Workflow Automation</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Automate onboarding, engagement, and retention using smart presets and integrations.
            </p>
          </div>
          <Button 
            onClick={() => setIsComingSoonModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Custom Workflow
          </Button>
        </div>
        
        <Tabs defaultValue="presets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Preset Workflows</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger 
              value="custom" 
              disabled 
              className="relative"
              onClick={() => setIsComingSoonModalOpen(true)}
            >
              Custom Workflows
              <span className="absolute -top-1 -right-1 text-xs bg-gray-200 dark:bg-gray-800 py-0.5 px-1.5 rounded-full">
                Soon
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflowsState.map((workflow) => (
                <WorkflowCard
                  key={workflow.id}
                  icon={workflow.icon}
                  title={workflow.title}
                  description={workflow.description}
                  status={workflow.status}
                  steps={workflow.steps}
                  impactCount={workflow.impactCount}
                  tags={workflow.tags}
                  onToggleStatus={() => handleToggleWorkflowStatus(workflow.id)}
                  onDuplicate={() => handleDuplicateWorkflow(workflow.id)}
                  onViewDetails={() => handleViewWorkflowDetails(workflow.id)}
                />
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Workflow Settings</h3>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow workflows to send email notifications</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">In-App Notifications</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow workflows to send in-app notifications</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">User Tagging</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow workflows to tag users in content</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">Content Creation</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Allow workflows to create content automatically</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Power Up with Integrations</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your community workflows to external platforms via trusted automation tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrationsData.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  icon={integration.icon}
                  title={integration.title}
                  description={integration.description}
                  ctaLabel={integration.ctaLabel}
                  ctaAction={() => handleIntegrationClick(integration.id)}
                  color={integration.color}
                />
              ))}
            </div>
            
            <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Link className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium">No-Code Integration Tips</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Use these automation platforms to connect your community with your favorite tools:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Create member records in your CRM when someone joins your community</li>
                <li>Send welcome messages in Slack when new members join</li>
                <li>Update spreadsheets with engagement data</li>
                <li>Create calendar events when new community events are published</li>
              </ul>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-lg mt-6 p-4 flex items-start gap-3">
                <div className="mt-0.5">
                  <ZapOff className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">Need help with integrations?</h4>
                  <p className="text-amber-700 dark:text-amber-500 text-sm mt-1">
                    Our team can help set up custom integrations or complex automation scenarios specific to your community needs.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="pt-4">
            <div className="text-center py-12">
              <div className="mx-auto bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">Custom Workflow Builder Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-6">
                Our advanced workflow builder will allow you to create personalized automations 
                tailored specifically to your community's unique needs.
              </p>
              <Button onClick={() => handleJoinWaitlist()}>Join Waitlist for Beta</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <SupportCTA 
            title="Need help setting up your workflows?" 
            description="Our automation experts can help you design the perfect workflow for your community"
          />
        </div>
      </div>
      
      {/* Modals */}
      <WorkflowDetailModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        workflow={selectedWorkflow}
        onStepToggle={handleToggleStep}
      />
      
      <IntegrationModal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        integration={selectedIntegration}
      />
      
      <ComingSoonAlert
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />
    </SettingsLayout>
  );
};

export default Workflows;
