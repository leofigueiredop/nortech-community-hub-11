
import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Share, Users, DollarSign, Link, Settings, Award, Star, Percent, Mail, Upload } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import InviteAffiliateDialog from '@/components/settings/affiliates/modals/InviteAffiliateDialog';
import AffiliateDetailsDialog from '@/components/settings/affiliates/modals/AffiliateDetailsDialog';
import ManageBannersDialog from '@/components/settings/affiliates/modals/ManageBannersDialog';
import EditEmailTemplatesDialog from '@/components/settings/affiliates/modals/EditEmailTemplatesDialog';
import ManageSocialPostsDialog from '@/components/settings/affiliates/modals/ManageSocialPostsDialog';

const Affiliates: React.FC = () => {
  const [programEnabled, setProgramEnabled] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [bannersDialogOpen, setBannersDialogOpen] = useState(false);
  const [emailTemplatesDialogOpen, setEmailTemplatesDialogOpen] = useState(false);
  const [socialPostsDialogOpen, setSocialPostsDialogOpen] = useState(false);

  return (
    <SettingsLayout activeSection="affiliates" title="Affiliate Program">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Affiliate Program Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {programEnabled ? 'Program is active' : 'Program is inactive'}
            </span>
            <Switch 
              checked={programEnabled} 
              onCheckedChange={setProgramEnabled} 
            />
          </div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Configure your community's affiliate program, including commission rules, eligibility, and promotional materials.
        </p>
        
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
                <CardDescription>Configure commission rates and referral tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Month Commission
                      </label>
                      <div className="relative flex">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="30" 
                          className="rounded-r-none pr-4"
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                          %
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Percentage received by affiliate on the first subscription payment.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recurring Commission
                      </label>
                      <div className="relative flex">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="15" 
                          className="rounded-r-none pr-4"
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                          %
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Percentage received on renewals while the user stays subscribed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cookie Duration
                    </label>
                    <div className="relative flex">
                      <Input 
                        type="number" 
                        min="1" 
                        defaultValue="30" 
                        className="rounded-r-none pr-4"
                      />
                      <div className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-300 dark:border-gray-700 px-3 flex items-center rounded-r-md">
                        Days
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      How long a referral link remains valid after a user clicks it.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium">Two-Tier Affiliate Program</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enable to allow affiliates to earn from referrals made by their sub-affiliates (level 2).
                      </p>
                    </div>
                    <Switch defaultChecked />
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically approve all affiliate applications.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Require Minimum Content</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Affiliate must have published content to qualify.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Community Member Requirement</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Affiliate must be a community member for minimum time period.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Minimum Member Duration
                    </label>
                    <div className="relative flex">
                      <Input 
                        type="number" 
                        min="0" 
                        defaultValue="30" 
                        className="rounded-r-none pr-4"
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
                    <div className="flex items-center gap-2">
                      <Upload size={18} className="text-purple-500" />
                      <div>
                        <h4 className="font-medium">Provide Banner Ads</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Offer promotional banner ads to affiliates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setBannersDialogOpen(true)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-purple-500" />
                      <div>
                        <h4 className="font-medium">Email Templates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Provide email copy templates for affiliates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEmailTemplatesDialogOpen(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-purple-500" />
                      <div>
                        <h4 className="font-medium">Social Media Content</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Provide social media post templates
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSocialPostsDialogOpen(true)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                    <Button 
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Settings size={16} /> Preview Affiliate Page
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Link size={16} /> Copy Default Referral Link
                    </Button>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Increase rates based on affiliate performance
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <div>
                        <h4 className="font-medium">Bonuses for Milestones</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Offer one-time bonuses for reaching referral goals
                        </p>
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
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex w-full justify-end gap-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Save Settings
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="affiliates" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Affiliate Management</h3>
              <Button 
                onClick={() => setInviteDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Invite Affiliates
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Active Affiliates</CardTitle>
                  <div className="flex items-center text-sm font-medium text-purple-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>46 Total Affiliates</span>
                  </div>
                </div>
                <CardDescription>Manage your program affiliates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Referrals</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              JD
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">John Doe</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">john@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>42</TableCell>
                        <TableCell>$1,248.00</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAffiliate({
                                name: "John Doe",
                                email: "john@example.com",
                                id: "1"
                              });
                              setDetailsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              MS
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">Maria Smith</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">maria@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        </TableCell>
                        <TableCell>37</TableCell>
                        <TableCell>$962.50</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAffiliate({
                                name: "Maria Smith",
                                email: "maria@example.com",
                                id: "2"
                              });
                              setDetailsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              RJ
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">Robert Johnson</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">robert@example.com</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>$0.00</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAffiliate({
                                name: "Robert Johnson",
                                email: "robert@example.com",
                                id: "3"
                              });
                              setDetailsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline">View All Affiliates</Button>
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
                    <div className="relative flex">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Process payouts automatically on schedule
                      </p>
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
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead>Affiliate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              JD
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">John Doe</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">$236.50</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            <span>PayPal</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">Approve</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Hold</Button>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
                              MS
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium">Maria Smith</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">$142.25</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                            <span>Stripe</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">Approve</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Hold</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium">Total pending: $378.75</span>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Process All Payouts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <InviteAffiliateDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />

      {selectedAffiliate && (
        <AffiliateDetailsDialog 
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          affiliate={selectedAffiliate}
        />
      )}

      <ManageBannersDialog 
        open={bannersDialogOpen}
        onOpenChange={setBannersDialogOpen}
      />

      <EditEmailTemplatesDialog 
        open={emailTemplatesDialogOpen}
        onOpenChange={setEmailTemplatesDialogOpen}
      />

      <ManageSocialPostsDialog 
        open={socialPostsDialogOpen}
        onOpenChange={setSocialPostsDialogOpen}
      />
    </SettingsLayout>
  );
};

export default Affiliates;
