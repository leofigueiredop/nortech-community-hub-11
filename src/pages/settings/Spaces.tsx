
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout, Users, Settings, Lock } from 'lucide-react';

const Spaces: React.FC = () => {
  return (
    <SettingsLayout activeSection="spaces" title="Spaces Settings">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Spaces Configuration</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure community spaces settings, including permissions, visibility, and default configurations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Space Settings</CardTitle>
              <CardDescription>Configure default settings for new spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-space-name">Default Space Name Prefix</Label>
                <Input id="default-space-name" placeholder="e.g., Community" defaultValue="Community" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Auto-join for New Members</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">New members automatically join general spaces</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Enable Private Spaces</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow creation of invitation-only spaces</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Enable Space Discovery</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to discover and join available spaces</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Space Creation Permissions</CardTitle>
              <CardDescription>Control who can create and manage spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium">Create Spaces</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Who can create new spaces</p>
                  </div>
                </div>
                <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                  <option>Admins Only</option>
                  <option>Moderators & Admins</option>
                  <option>All Members</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium">Space Management</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Who can edit space settings</p>
                  </div>
                </div>
                <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                  <option>Space Creator</option>
                  <option>Admins Only</option>
                  <option>Moderators & Admins</option>
                  <option>Custom</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <h4 className="font-medium">Member Management</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Who can manage space members</p>
                  </div>
                </div>
                <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                  <option>Space Creator</option>
                  <option>Space Moderators</option>
                  <option>Admins Only</option>
                  <option>Custom</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Space Categories</CardTitle>
              <CardDescription>Manage space categories for organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">General</h4>
                    <Settings className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">General community spaces</p>
                </div>
                
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Learning</h4>
                    <Settings className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Educational spaces</p>
                </div>
                
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Social</h4>
                    <Settings className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Community interaction spaces</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Input placeholder="New category name" />
                <Button>Add Category</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Spaces;
