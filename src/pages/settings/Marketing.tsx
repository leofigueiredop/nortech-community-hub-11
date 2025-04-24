
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MegaphoneIcon } from 'lucide-react';
import EmailCampaigns from '@/components/settings/marketing/EmailCampaigns';
import Automations from '@/components/settings/marketing/Automations';
import SMTPConfiguration from '@/components/settings/marketing/SMTPConfiguration';
import MarketingAnalytics from '@/components/settings/marketing/MarketingAnalytics';
import SupportCTA from '@/components/settings/marketing/SupportCTA';

const Marketing: React.FC = () => {
  return (
    <SettingsLayout activeSection="marketing" title="Marketing">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Marketing Settings</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your marketing campaigns, automations, email delivery settings, and analyze performance.
        </p>

        <Tabs defaultValue="email-campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="email-campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email-campaigns">
            <EmailCampaigns />
          </TabsContent>
          
          <TabsContent value="automations">
            <Automations />
          </TabsContent>
          
          <TabsContent value="smtp">
            <SMTPConfiguration />
          </TabsContent>
          
          <TabsContent value="analytics">
            <MarketingAnalytics />
          </TabsContent>
        </Tabs>
        
        {/* Support CTA Footer */}
        <div className="mt-10 sticky bottom-0 bg-white dark:bg-slate-900 py-4 border-t border-gray-200 dark:border-gray-700 -mx-3 px-3 md:-mx-5 md:px-5">
          <SupportCTA />
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Marketing;
