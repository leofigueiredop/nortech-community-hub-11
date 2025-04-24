
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Award, Calendar, ChevronRight, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MarketingWaitlistDialog from './MarketingWaitlistDialog';
import AutomationConfigDialog from './AutomationConfigDialog';
import { useToast } from '@/hooks/use-toast';

const AutomationCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: number;
  active: boolean;
  onToggle: () => void;
  onConfigure: () => void;
}> = ({ title, description, icon, steps, active, onToggle, onConfigure }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={active ? "default" : "outline"} className={
              active ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400" : 
                      "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }>
              {active ? "Active" : "Inactive"}
            </Badge>
            <Switch id={`${title}-switch`} checked={active} onCheckedChange={onToggle} />
          </div>
        </div>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {steps} email{steps !== 1 ? 's' : ''} in sequence
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            onClick={onConfigure}
          >
            Configure <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Automations: React.FC = () => {
  const [automations, setAutomations] = React.useState([
    {
      id: 1,
      title: "Welcome Email Sequence",
      description: "Introduce new members to your community",
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
      steps: 3,
      active: true,
    },
    {
      id: 2,
      title: "Re-engagement Campaign",
      description: "Bring inactive members back to your community",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      steps: 2,
      active: false,
    },
    {
      id: 3,
      title: "Course Completion",
      description: "Send congratulations and next steps after course completion",
      icon: <Award className="h-5 w-5 text-green-500" />,
      steps: 1,
      active: true,
    },
    {
      id: 4,
      title: "Event Reminder",
      description: "Send reminders before community events",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      steps: 2,
      active: false,
    },
  ]);

  const [showWaitlist, setShowWaitlist] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<any>(null);
  const { toast } = useToast();

  const handleToggle = (id: number) => {
    setAutomations(prev =>
      prev.map(automation =>
        automation.id === id
          ? { ...automation, active: !automation.active }
          : automation
      )
    );
    
    toast({
      title: "Automation Updated",
      description: "The automation status has been updated.",
    });
  };

  const handleConfigure = (automation: any) => {
    setSelectedAutomation(automation);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Email Automations</h2>
        <Button variant="outline" onClick={() => setShowWaitlist(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Automation
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map(automation => (
          <AutomationCard 
            key={automation.id}
            title={automation.title}
            description={automation.description}
            icon={automation.icon}
            steps={automation.steps}
            active={automation.active}
            onToggle={() => handleToggle(automation.id)}
            onConfigure={() => handleConfigure(automation)}
          />
        ))}
      </div>

      <MarketingWaitlistDialog 
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onJoinWaitlist={() => {
          toast({
            title: "Waitlist Joined",
            description: "You'll be notified when new automation features are available.",
          });
          setShowWaitlist(false);
        }}
      />

      {selectedAutomation && (
        <AutomationConfigDialog
          isOpen={!!selectedAutomation}
          onClose={() => setSelectedAutomation(null)}
          automation={selectedAutomation}
        />
      )}
    </div>
  );
};

export default Automations;
