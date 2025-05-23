
import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SupportCTA from '@/components/settings/marketing/SupportCTA';
import { 
  Shield, 
  MessageSquare, 
  AlertTriangle, 
  Flag, 
  Users,
  Download,
  Upload,
  Info,
  RefreshCw,
  Plus,
  Search,
  Bell,
  FileText,
  User,
  Clock,
  Zap,
  Ban
} from 'lucide-react';

const Moderation: React.FC = () => {
  const [pendingReports, setPendingReports] = useState(3);
  const [selectedTab, setSelectedTab] = useState('auto-moderation');
  
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
        
        {/* Quick Action Bar */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Rule</span>
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Flag className="h-4 w-4 text-red-500" />
                  <span>Pending Reports</span>
                  {pendingReports > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      {pendingReports}
                    </Badge>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>Add Moderator</span>
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span>Export Logs</span>
                </Button>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search moderation history..." className="pl-9 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="auto-moderation" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
            <TabsTrigger value="auto-moderation">Auto-Moderation</TabsTrigger>
            <TabsTrigger value="report-management">Report Management</TabsTrigger>
            <TabsTrigger value="team">Moderation Team</TabsTrigger>
            <TabsTrigger value="actions">Automated Actions</TabsTrigger>
          </TabsList>
          
          {/* Auto-Moderation Tab (formerly Content Filters) */}
          <TabsContent value="auto-moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Moderation Settings</CardTitle>
                <CardDescription>Configure automatic rules for content filtering using AI and keyword rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <CardTitle className="text-base">AI Content Moderation</CardTitle>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <CardDescription>Use AI to detect inappropriate content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Sensitivity Level</p>
                          <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm">
                            <option>Standard</option>
                            <option>High</option>
                            <option>Low</option>
                            <option>Custom</option>
                          </select>
                        </div>
                        <Button variant="outline" size="sm" className="self-start">
                          <Info className="mr-2 h-4 w-4" /> View Examples
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 rounded-md">
                            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <CardTitle className="text-base">Profanity Filter</CardTitle>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <CardDescription>Automatically filter profanity in posts and comments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Language</p>
                          <div className="flex gap-2">
                            <label className="inline-flex items-center gap-1">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span className="text-sm">English</span>
                            </label>
                            <label className="inline-flex items-center gap-1">
                              <input type="checkbox" className="rounded" defaultChecked />
                              <span className="text-sm">Portuguese</span>
                            </label>
                            <label className="inline-flex items-center gap-1">
                              <input type="checkbox" className="rounded" />
                              <span className="text-sm">Spanish</span>
                            </label>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="self-start">
                          <Info className="mr-2 h-4 w-4" /> View Examples
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <CardTitle className="text-base">Blocked Words</CardTitle>
                        </div>
                      </div>
                      <CardDescription>Add specific words that should be filtered</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="flex flex-wrap gap-2 mb-2">
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
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            These words will be automatically hidden or replaced with ***
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <Input placeholder="Add a blocked word" />
                          </div>
                          <Button>Add Word</Button>
                          <Button variant="outline" className="flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            Import CSV
                          </Button>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Suggested words to block:</p>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              <Plus className="mr-1 h-3 w-3" /> offensive_term1
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              <Plus className="mr-1 h-3 w-3" /> offensive_term2
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              <Plus className="mr-1 h-3 w-3" /> offensive_term3
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
                            <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <CardTitle className="text-base">Link Filtering</CardTitle>
                        </div>
                        <Switch />
                      </div>
                      <CardDescription>Review posts containing external links</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Action for links</p>
                        <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm">
                          <option>Require approval</option>
                          <option>Add warning notice</option>
                          <option>Block entirely</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restore Defaults
                    </Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Report Management Tab (formerly Reports) */}
          <TabsContent value="report-management" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Management</CardTitle>
                <CardDescription>Configure how content reports are handled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Content Reporting Card */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-red-100 dark:bg-red-900/50 p-1.5 rounded-md">
                          <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Enable Member Reporting</CardTitle>
                          <CardDescription>Allow members to report inappropriate content</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Enable reporting</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Allow anonymous reports</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Custom response message</Label>
                            <p className="text-xs text-gray-500">Shown after submitting a report</p>
                          </div>
                          <Button variant="outline" size="sm">Customize</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Threshold Card */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
                          <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Report Threshold</CardTitle>
                          <CardDescription>Number of reports before content is auto-flagged</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Threshold count</Label>
                          <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 w-24 text-center">
                            <option>3</option>
                            <option>5</option>
                            <option>10</option>
                            <option>None</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Notify moderators</Label>
                            <p className="text-xs text-gray-500">Send alerts about new reports</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Report Categories Card */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-md">
                            <Flag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Report Categories</CardTitle>
                            <CardDescription>Categories members can select when reporting content</CardDescription>
                          </div>
                        </div>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Category
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Ban className="h-4 w-4 text-red-500" />
                            <span>Harassment</span>
                          </div>
                          <button className="text-red-500 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Misinformation</span>
                          </div>
                          <button className="text-red-500 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Ban className="h-4 w-4 text-orange-500" />
                            <span>Spam</span>
                          </div>
                          <button className="text-red-500 text-sm">Remove</button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span>Inappropriate Content</span>
                          </div>
                          <button className="text-red-500 text-sm">Remove</button>
                        </div>
                      </div>
                      
                      <div className="mt-5">
                        <p className="text-sm font-medium mb-2">Common category suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="text-xs">Hate Speech</Button>
                          <Button variant="outline" size="sm" className="text-xs">Copyright Violation</Button>
                          <Button variant="outline" size="sm" className="text-xs">Violence</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Export Actions */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-md">
                          <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Export Reports</CardTitle>
                          <CardDescription>Download reports for external analysis</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Export as CSV
                        </Button>
                        <Button variant="outline" className="flex items-center">
                          <Download className="mr-2 h-4 w-4" />
                          Export as PDF
                        </Button>
                        <div className="flex items-center ml-auto">
                          <Label className="mr-2">Date range:</Label>
                          <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800">
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>All time</option>
                            <option>Custom range</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Moderation Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Team</CardTitle>
                <CardDescription>Manage your community moderators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="font-medium">Current Moderators</h4>
                      <p className="text-sm text-gray-500">Manage team members and set permissions</p>
                    </div>
                    <Button>Add Moderator</Button>
                  </div>
                  
                  {/* Active Moderators */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">ACTIVE MODERATORS</h4>
                    <div className="space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">Sarah Johnson</h5>
                              <Badge className="bg-indigo-500">Admin Mod</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Active 2h ago
                              </span>
                              <span className="hidden md:flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                154 actions
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Permissions</Button>
                          <Button variant="outline" size="sm">View Logs</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20">Remove</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                            <Users size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">Michael Chen</h5>
                              <Badge className="bg-blue-500">Content Mod</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Active yesterday
                              </span>
                              <span className="hidden md:flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                87 actions
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Permissions</Button>
                          <Button variant="outline" size="sm">View Logs</Button>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pending Invites */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">PENDING INVITES</h4>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <User size={18} />
                        </div>
                        <div>
                          <h5 className="font-medium">alex.rodriguez@example.com</h5>
                          <p className="text-sm text-gray-500">Invited 2 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Resend</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20">Cancel</Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Moderator Roles */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-3">Moderator Roles</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-500">Junior Mod</Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                        </div>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Delete Content
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Handle Reports
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-red-500">✗</span> Ban Users
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-red-500">✗</span> Edit Content
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-500">Content Mod</Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                        </div>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Delete Content
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Handle Reports
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Temporary Ban
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Edit Content
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-indigo-500">Admin Mod</Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                        </div>
                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> All Permissions
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Permanent Ban
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Create Rules
                          </li>
                          <li className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> Add Moderators
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Moderation Logs */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Recent Activity Logs</h4>
                      <Button variant="outline" size="sm">View All Logs</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="p-2 text-sm border-l-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-sm">
                        <span className="font-medium">Sarah Johnson</span> removed a post for violating community guidelines
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      
                      <div className="p-2 text-sm border-l-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-sm">
                        <span className="font-medium">Michael Chen</span> issued a warning to user JohnDoe123
                        <p className="text-xs text-gray-500 mt-1">Yesterday at 4:32 PM</p>
                      </div>
                      
                      <div className="p-2 text-sm border-l-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-sm">
                        <span className="font-medium">Sarah Johnson</span> banned SpamBot22 for 7 days
                        <p className="text-xs text-gray-500 mt-1">Apr 21, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Automated Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Actions</CardTitle>
                <CardDescription>Configure automated responses to rule violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set up automatic actions that will be taken when users violate community rules. These actions can be triggered by report thresholds or by automatic content detection.
                  </p>
                  
                  {/* First Violation */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-1.5 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <CardTitle className="text-base">First Violation</CardTitle>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Action</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>Send Warning Message</option>
                              <option>Remove Content</option>
                              <option>Restrict Posting (1 hour)</option>
                            </select>
                          </div>
                          <div>
                            <Label>Notify</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>User Only</option>
                              <option>User & Moderators</option>
                              <option>No Notifications</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Warning Message</Label>
                          <textarea 
                            className="w-full mt-1 h-24 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
                            defaultValue="Your recent post violates our community guidelines. Please review our rules to avoid further actions on your account."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Second Violation */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-orange-100 dark:bg-orange-900/50 p-1.5 rounded-md">
                            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <CardTitle className="text-base">Second Violation</CardTitle>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Action</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>Timeout (12 hours)</option>
                              <option>Remove Content</option>
                              <option>Restrict Posting (24 hours)</option>
                            </select>
                          </div>
                          <div>
                            <Label>Notify</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>User & Moderators</option>
                              <option>User Only</option>
                              <option>No Notifications</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Warning Message</Label>
                          <textarea 
                            className="w-full mt-1 h-24 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
                            defaultValue="This is your second violation of our community guidelines. Your account has been restricted temporarily. Further violations may result in permanent action."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Third Violation */}
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-100 dark:bg-red-900/50 p-1.5 rounded-md">
                            <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <CardTitle className="text-base">Third Violation</CardTitle>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Action</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>Ban (7 days)</option>
                              <option>Ban (30 days)</option>
                              <option>Permanent Ban</option>
                            </select>
                          </div>
                          <div>
                            <Label>Review</Label>
                            <select className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                              <option>Require Admin Review</option>
                              <option>Automatic</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Message</Label>
                          <textarea 
                            className="w-full mt-1 h-24 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-sm"
                            defaultValue="Due to repeated violations of our community guidelines, your account has been banned. You may appeal this decision by contacting our support team."
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="allow-appeal" className="rounded" defaultChecked />
                          <label htmlFor="allow-appeal" className="text-sm">Allow user to appeal this action</label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Reset Violations */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Label>Reset violations after</Label>
                      <select className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800">
                        <option>30 days</option>
                        <option>60 days</option>
                        <option>90 days</option>
                        <option>Never</option>
                      </select>
                      <span className="text-sm text-gray-500">of good behavior</span>
                    </div>
                  </div>
                  
                  {/* Save Button */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <SupportCTA />
      </div>
    </SettingsLayout>
  );
};

export default Moderation;
