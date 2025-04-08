
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const IntegrationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Connect Your Services</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Integrate with various third-party services to enhance your community experience.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IntegrationCard 
          title="Payment Gateways" 
          description="Connect with Stripe, PayPal, or crypto payment processors."
          integrations={[
            { name: "Stripe", connected: false },
            { name: "PayPal", connected: false },
            { name: "Coinbase Commerce", connected: false }
          ]}
        />
        
        <IntegrationCard 
          title="CRM Systems" 
          description="Connect your customer relationship management tools."
          integrations={[
            { name: "Hubspot", connected: false },
            { name: "Salesforce", connected: false },
            { name: "Zoho CRM", connected: false }
          ]}
        />
        
        <IntegrationCard 
          title="Email Marketing" 
          description="Connect email marketing platforms to sync your community members."
          integrations={[
            { name: "Mailchimp", connected: false },
            { name: "ConvertKit", connected: false },
            { name: "ActiveCampaign", connected: false }
          ]}
        />
        
        <IntegrationCard 
          title="Calendar & Events" 
          description="Sync your community events with calendar services."
          integrations={[
            { name: "Google Calendar", connected: false },
            { name: "Microsoft Outlook", connected: false },
            { name: "iCalendar", connected: false }
          ]}
        />
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Get API credentials to build custom integrations with your community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Generate API Keys</Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface Integration {
  name: string;
  connected: boolean;
}

interface IntegrationCardProps {
  title: string;
  description: string;
  integrations: Integration[];
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ title, description, integrations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {integrations.map((integration, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{integration.name}</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                Connect <ExternalLink size={14} />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default IntegrationSettings;
