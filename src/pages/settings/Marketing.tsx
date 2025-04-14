
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MegaphoneIcon, MessageSquare, Users, Mail } from 'lucide-react';

const Marketing: React.FC = () => {
  return (
    <SettingsLayout activeSection="marketing" title="Marketing">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MegaphoneIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Marketing Settings</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your community marketing settings, including email campaigns, social media integration, and promotion tools.
        </p>

        <Tabs defaultValue="campaigns">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaigns</CardTitle>
                <CardDescription>Create and manage email marketing campaigns for your community.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                    <Mail className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">Create New Campaign</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Start designing a new email campaign to engage your members
                    </p>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">
                      Create Campaign
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Integration</CardTitle>
                <CardDescription>Connect and manage your social media accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                        <Users size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium">Facebook</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                      </div>
                    </div>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Connect</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-sky-400 text-white p-2 rounded-full mr-3">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium">Twitter</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Not connected</p>
                      </div>
                    </div>
                    <button className="bg-sky-400 text-white px-3 py-1 rounded text-sm">Connect</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="automations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Automations</CardTitle>
                <CardDescription>Configure automated marketing workflows.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2">Welcome Email Sequence</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Send a series of emails to new members automatically.
                    </p>
                    <div className="flex justify-end">
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Configure</button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2">Re-engagement Campaign</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Automatically reach out to inactive members.
                    </p>
                    <div className="flex justify-end">
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Configure</button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
};

export default Marketing;
