
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { FileText, Settings, Calendar, Lock } from 'lucide-react';

const Posts: React.FC = () => {
  return (
    <SettingsLayout activeSection="posts" title="Posts Settings">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Posts Configuration</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your community posts settings, including permissions, formatting options, and default settings.
        </p>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
                <CardDescription>Configure general post settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Allow Comments</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable comments on all posts by default</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Allow Reactions</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable reactions on all posts by default</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Post Preview</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow previewing posts before publishing</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Rich Text Editor</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use rich text editor for post creation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Permissions</CardTitle>
                <CardDescription>Configure who can create and manage posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Create Posts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Who can create new posts</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                      <option>All Members</option>
                      <option>Admins Only</option>
                      <option>Moderators & Admins</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Edit Posts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Who can edit existing posts</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                      <option>Post Author</option>
                      <option>Admins Only</option>
                      <option>Moderators & Admins</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Delete Posts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Who can delete posts</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                      <option>Admins Only</option>
                      <option>Post Author</option>
                      <option>Moderators & Admins</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post Scheduling</CardTitle>
                <CardDescription>Configure post scheduling options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Enable Post Scheduling</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to schedule posts for the future</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Scheduling Time Limit</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">How far in advance posts can be scheduled</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                      <option>30 Days</option>
                      <option>60 Days</option>
                      <option>90 Days</option>
                      <option>No Limit</option>
                    </select>
                  </div>
                  
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium">Preferred Publishing Times</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Set preferred times for automatic scheduling optimization</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekdays</span>
                          <Switch />
                        </div>
                        <input 
                          type="time" 
                          className="mt-2 w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800"
                          defaultValue="10:00"
                        />
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekends</span>
                          <Switch />
                        </div>
                        <input 
                          type="time" 
                          className="mt-2 w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800"
                          defaultValue="12:00"
                        />
                      </div>
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

export default Posts;
