
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, MessageSquare, AlertTriangle, Flag, Users } from 'lucide-react';

const Moderation: React.FC = () => {
  return (
    <SettingsLayout activeSection="moderation" title="Moderation Settings">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Community Moderation</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure moderation settings to keep your community safe and engaged. Set up automated content filtering, manage reports, and set moderation team permissions.
        </p>

        <Tabs defaultValue="filters">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="filters">Content Filters</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="team">Moderation Team</TabsTrigger>
            <TabsTrigger value="actions">Automated Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="filters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Filtering</CardTitle>
                <CardDescription>Configure automatic content filtering for your community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <div>
                        <h4 className="font-medium">AI Content Moderation</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Use AI to detect inappropriate content</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Profanity Filter</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically filter profanity in posts and comments</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-medium">Blocked Words</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Add specific words that should be filtered</p>
                    
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md mb-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center">
                          inappropriate
                          <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center">
                          offensive
                          <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center">
                          explicit
                          <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input placeholder="Add a blocked word" />
                      <Button>Add</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Link Filtering</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review posts containing external links</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Management</CardTitle>
                <CardDescription>Configure how content reports are handled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      <div>
                        <h4 className="font-medium">Enable Member Reporting</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to report inappropriate content</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Report Threshold</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Number of reports before content is auto-flagged</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                      <option>3 Reports</option>
                      <option>5 Reports</option>
                      <option>10 Reports</option>
                      <option>No Auto-flagging</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Notify Moderators</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications about new reports</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Flag className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium">Report Categories</h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Categories members can select when reporting content</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Inappropriate Content</span>
                        <button className="text-red-500 text-sm">Remove</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Harassment</span>
                        <button className="text-red-500 text-sm">Remove</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Spam</span>
                        <button className="text-red-500 text-sm">Remove</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>Misinformation</span>
                        <button className="text-red-500 text-sm">Remove</button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Input placeholder="New report category" />
                      <Button>Add</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Team</CardTitle>
                <CardDescription>Manage your community moderators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Current Moderators</h4>
                    <Button>Add Moderator</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                          <Users size={18} />
                        </div>
                        <div>
                          <h5 className="font-medium">Sarah Johnson</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Senior Moderator</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Remove</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                          <Users size={18} />
                        </div>
                        <div>
                          <h5 className="font-medium">Michael Chen</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Content Moderator</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Remove</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-3">Moderator Permissions</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="delete-content">Delete Content</Label>
                        <Switch id="delete-content" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ban-users">Ban Users</Label>
                        <Switch id="ban-users" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="edit-content">Edit User Content</Label>
                        <Switch id="edit-content" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="approve-content">Approve Flagged Content</Label>
                        <Switch id="approve-content" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Moderation Actions</CardTitle>
                <CardDescription>Configure actions taken for moderated content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Auto-hide Reported Content</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hide content after it reaches the report threshold</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Spam Detection</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically remove content identified as spam</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">New Member Restrictions</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Apply additional moderation to new members</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium mb-3">Action for Repeat Offenders</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">First Offense</span>
                          <p className="text-xs text-gray-500">Warning message</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Second Offense</span>
                          <p className="text-xs text-gray-500">24 hour timeout</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Third Offense</span>
                          <p className="text-xs text-gray-500">1 week ban</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Fourth+ Offense</span>
                          <p className="text-xs text-gray-500">Permanent ban</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
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

export default Moderation;
