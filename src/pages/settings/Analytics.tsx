
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { BarChart3, LineChart, PieChart, UserPlus, ArrowUpRight, ArrowDownRight, Settings, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <SettingsLayout activeSection="analytics" title="Analytics Settings">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Analytics Configuration</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your community analytics, customize tracking preferences, and manage data collection settings.
        </p>

        <Tabs defaultValue="tracking">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="tracking">Tracking Settings</TabsTrigger>
            <TabsTrigger value="reports">Report Configuration</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Collection</CardTitle>
                <CardDescription>Configure what data is collected for analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Member Growth Tracking</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track new members and retention rates</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Engagement Metrics</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track member engagement with content</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Feature Usage</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track which features are most used</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Revenue Tracking</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track subscription revenue and conversions</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Configure analytics privacy settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Data Anonymization</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Anonymize personal data in analytics</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">IP Address Collection</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Store IP addresses with analytics data</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Cookie Tracking</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use cookies for enhanced tracking</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Default Reports</CardTitle>
                <CardDescription>Configure which reports to show by default</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Growth Report</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">New Members</span>
                          <span className="text-green-600 flex items-center text-xs font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            12%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">247</span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Churn Rate</span>
                          <span className="text-red-600 flex items-center text-xs font-medium">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            2.4%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">3.8%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Engagement Report</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</span>
                          <span className="text-green-600 flex items-center text-xs font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            8%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">1,893</span>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Session</span>
                          <span className="text-green-600 flex items-center text-xs font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            4.2%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">12.3m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-green-500" />
                        <h4 className="font-medium">Revenue Report</h4>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</span>
                          <span className="text-green-600 flex items-center text-xs font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            15%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">$12,847</span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Conversion</span>
                          <span className="text-green-600 flex items-center text-xs font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            2.1%
                          </span>
                        </div>
                        <span className="text-2xl font-bold">5.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Settings</CardTitle>
                <CardDescription>Configure report delivery and scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">Weekly Analytics Email</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Send weekly analytics summary via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Monthly Detailed Report</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Generate detailed monthly analytics report</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Real-time Dashboard Updates</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Update dashboard analytics in real-time</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Export Capabilities</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow exporting analytics data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Integrations</CardTitle>
                <CardDescription>Connect to third-party analytics platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">
                        GA
                      </div>
                      <div>
                        <h5 className="font-medium">Google Analytics</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track detailed user behavior</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-medium">Connected</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-300">
                        FB
                      </div>
                      <div>
                        <h5 className="font-medium">Facebook Pixel</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track conversions from Facebook ads</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-sm font-medium">Disconnected</span>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-green-600 dark:text-green-300">
                        HJ
                      </div>
                      <div>
                        <h5 className="font-medium">Hotjar</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track user experience with heatmaps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-medium">Connected</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300">
                        MS
                      </div>
                      <div>
                        <h5 className="font-medium">Mixpanel</h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track user flows and conversion funnels</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-sm font-medium">Disconnected</span>
                      <Switch />
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

export default Analytics;
