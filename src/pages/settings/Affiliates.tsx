
import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Share, Users, DollarSign, Link, Settings, Award } from 'lucide-react';

const Affiliates: React.FC = () => {
  return (
    <SettingsLayout activeSection="affiliates" title="Affiliate Program">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Share className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Affiliate Program Settings</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your community's affiliate program, including commission rates, tracking, and affiliate management.
        </p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">Program Status</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Affiliate program is currently active</p>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="settings">Program Settings</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
                <CardDescription>Configure commission rates and structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Month Commission
                      </label>
                      <div className="flex">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="30" 
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                          %
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recurring Commission
                      </label>
                      <div className="flex">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="15" 
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cookie Duration
                    </label>
                    <div className="flex">
                      <Input 
                        type="number" 
                        min="1" 
                        defaultValue="30" 
                        className="rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                        Days
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      How long the referral link will be valid after a user clicks it
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium">Two-Tier Affiliate Program</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Allow affiliates to earn from sub-affiliates they refer</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Eligibility & Requirements</CardTitle>
                <CardDescription>Set requirements for affiliate program participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Auto-Approve Affiliates</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically approve all affiliate applications</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Require Minimum Content</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Affiliate must have published content to qualify</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Community Member Requirement</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Affiliate must be a community member for minimum time period</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Member Duration
                    </label>
                    <div className="flex">
                      <Input 
                        type="number" 
                        min="0" 
                        defaultValue="30" 
                        className="rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                        Days
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Materials</CardTitle>
                <CardDescription>Configure resources available to affiliates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">Provide Banner Ads</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Offer promotional banner ads to affiliates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Email Templates</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Provide email copy templates for affiliates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Social Media Content</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Provide social media post templates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Button>Manage Materials</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="affiliates" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Affiliate Management</h3>
              <Button>Invite Affiliates</Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Active Affiliates</CardTitle>
                  <div className="flex items-center text-sm font-medium text-indigo-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>46 Total Affiliates</span>
                  </div>
                </div>
                <CardDescription>Manage your program affiliates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Affiliate
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Referrals
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Earnings
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                JD
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium">John Doe</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">john@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            42
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            $1,248.00
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                MS
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium">Maria Smith</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">maria@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            37
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            $962.50
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                                RJ
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium">Robert Johnson</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">robert@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Pending
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            0
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            $0.00
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button variant="outline">View All Affiliates</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Incentives</CardTitle>
                <CardDescription>Reward high-performing affiliates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Tiered Commission Rates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Increase rates based on performance</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Bonuses for Milestones</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Offer one-time bonuses for reaching goals</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="px-4 pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-3">Commission Tiers</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Bronze Tier</span>
                          <p className="text-xs text-gray-500">0-10 referrals/month</p>
                        </div>
                        <span className="text-sm font-medium">15% commission</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Silver Tier</span>
                          <p className="text-xs text-gray-500">11-30 referrals/month</p>
                        </div>
                        <span className="text-sm font-medium">20% commission</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">Gold Tier</span>
                          <p className="text-xs text-gray-500">31+ referrals/month</p>
                        </div>
                        <span className="text-sm font-medium">25% commission</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Configure affiliate payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Payout Amount
                    </label>
                    <div className="flex">
                      <div className="bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-l-md">
                        $
                      </div>
                      <Input 
                        type="number" 
                        min="0" 
                        defaultValue="50" 
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum amount required for payout
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payout Schedule
                    </label>
                    <select className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800">
                      <option>Monthly</option>
                      <option>Bi-weekly</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-3">Payment Methods</h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                          <span>PayPal</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Stripe</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Bank Transfer</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium">Automatic Payouts</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Process payouts automatically on schedule</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Payouts</span>
                  <span className="text-sm font-normal text-gray-500">Next payout: May 1, 2025</span>
                </CardTitle>
                <CardDescription>Review and approve pending payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Affiliate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                              JD
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">John Doe</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          $236.50
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            <span>PayPal</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="outline" size="sm" className="mr-2">Approve</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Hold</Button>
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                              MS
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">Maria Smith</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          $142.25
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                            <span>Stripe</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="outline" size="sm" className="mr-2">Approve</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Hold</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">Total pending: $378.75</span>
                  <Button>Process All Payouts</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
};

export default Affiliates;
