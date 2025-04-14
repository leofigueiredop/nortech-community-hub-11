
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Workflow, PlusCircle, Play, Pause, Settings, MessageSquare, User, Calendar } from 'lucide-react';

const Workflows: React.FC = () => {
  return (
    <SettingsLayout activeSection="workflows" title="Workflow Automation">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Community Workflows</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Automate your community processes with powerful, customizable workflows. Create sequences for member onboarding, engagement, and other critical community operations.
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Active Workflows</h3>
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Create Workflow</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <span>New Member Onboarding</span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Active</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Workflow for welcoming and onboarding new community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="bg-indigo-100 text-indigo-600 h-6 w-6 rounded-full flex items-center justify-center">1</div>
                  <span>Welcome email sent on join</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="bg-indigo-100 text-indigo-600 h-6 w-6 rounded-full flex items-center justify-center">2</div>
                  <span>Community guidelines notification</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="bg-indigo-100 text-indigo-600 h-6 w-6 rounded-full flex items-center justify-center">3</div>
                  <span>Profile completion reminder (Day 2)</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="bg-indigo-100 text-indigo-600 h-6 w-6 rounded-full flex items-center justify-center">4</div>
                  <span>First engagement check (Day 7)</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Duplicate</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span>Content Engagement</span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">Active</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Workflow to increase engagement with published content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-purple-500 pl-3 py-1">
                  <div className="bg-purple-100 text-purple-600 h-6 w-6 rounded-full flex items-center justify-center">1</div>
                  <span>New content notification</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-purple-500 pl-3 py-1">
                  <div className="bg-purple-100 text-purple-600 h-6 w-6 rounded-full flex items-center justify-center">2</div>
                  <span>Follow-up for non-readers (Day 3)</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-purple-500 pl-3 py-1">
                  <div className="bg-purple-100 text-purple-600 h-6 w-6 rounded-full flex items-center justify-center">3</div>
                  <span>Related content suggestion</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-purple-500 pl-3 py-1">
                  <div className="bg-purple-100 text-purple-600 h-6 w-6 rounded-full flex items-center justify-center">4</div>
                  <span>Feedback request (Day 7)</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Duplicate</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Event Reminders</span>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">Paused</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Workflow for event notifications and follow-ups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-3 py-1">
                  <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center">1</div>
                  <span>Event announcement (1 week before)</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-3 py-1">
                  <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center">2</div>
                  <span>Event reminder (1 day before)</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-3 py-1">
                  <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center">3</div>
                  <span>Last call notification (1 hour before)</span>
                </div>
                <div className="flex items-center gap-2 border-l-2 border-blue-500 pl-3 py-1">
                  <div className="bg-blue-100 text-blue-600 h-6 w-6 rounded-full flex items-center justify-center">4</div>
                  <span>Post-event feedback request</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Duplicate</Button>
              </div>
            </CardContent>
          </Card>
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
      </div>
    </SettingsLayout>
  );
};

export default Workflows;
