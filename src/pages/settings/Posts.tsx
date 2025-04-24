
import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { FileText, Settings, Calendar, Lock, Clock, Tags, Save, PieChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimePicker } from '@/components/ui/time-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Posts: React.FC = () => {
  // State for new settings
  const [defaultVisibility, setDefaultVisibility] = useState('public');
  const [defaultTags, setDefaultTags] = useState<string[]>(['community']);
  const [newTag, setNewTag] = useState('');
  const [contentLength, setContentLength] = useState(1000);
  const [timeLimit, setTimeLimit] = useState('15');
  const [timezone, setTimezone] = useState('UTC');
  const [selectedTemplateType, setSelectedTemplateType] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCustomTypes, setShowCustomTypes] = useState(false);
  
  // Sample post types
  const postTypes = ['Text', 'Image', 'Video'];
  const customPostTypes = ['Quiz', 'AMA', 'Challenge', 'Poll'];
  
  // Sample analysis data
  const postAnalytics = [
    { type: 'Text', engagement: 65 },
    { type: 'Image', engagement: 82 },
    { type: 'Video', engagement: 74 },
  ];

  const addDefaultTag = () => {
    if (newTag && !defaultTags.includes(newTag)) {
      setDefaultTags([...defaultTags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setDefaultTags(defaultTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDefaultTag();
    }
  };

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
          
          {/* GENERAL TAB */}
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
                  
                  {/* New: Post Visibility */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 className="font-medium">Default Post Visibility</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Set who can view new posts by default</p>
                    </div>
                    <Select value={defaultVisibility} onValueChange={setDefaultVisibility}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="members">Members Only</SelectItem>
                        <SelectItem value="premium">Premium Members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* New: Default Tags */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Tags className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium">Default Tags</h4>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-blue-500 cursor-pointer">What's this?</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px]">These tags will be automatically applied to all new posts.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {defaultTags.map(tag => (
                        <Badge key={tag} variant="outline" className="px-2 py-1 flex items-center gap-1">
                          {tag}
                          <button 
                            onClick={() => removeTag(tag)} 
                            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add new tag..." 
                        value={newTag} 
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                      />
                      <Button 
                        onClick={addDefaultTag} 
                        variant="outline" 
                        className="whitespace-nowrap"
                        disabled={!newTag}
                      >
                        Add Tag
                      </Button>
                    </div>
                  </div>
                  
                  {/* New: Auto-Save Drafts */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Auto-Save Drafts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Save post drafts locally every 60 seconds</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  {/* New: Content Length Limit */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Content Length Limit</h4>
                      <span className="text-sm text-gray-500">{contentLength} characters</span>
                    </div>
                    <Input 
                      type="range" 
                      min="500" 
                      max="10000" 
                      step="100" 
                      value={contentLength}
                      onChange={(e) => setContentLength(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Set maximum number of characters allowed in posts
                    </p>
                  </div>
                  
                  {/* New: Template Feature */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="font-medium mb-2">Post Templates</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Save post formats as templates for reuse
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      {['Announcement', 'Weekly Update', 'Q&A'].map(template => (
                        <Toggle
                          key={template}
                          variant="outline"
                          pressed={selectedTemplateType === template}
                          onPressedChange={() => setSelectedTemplateType(selectedTemplateType === template ? '' : template)}
                          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm"
                        >
                          {template}
                        </Toggle>
                      ))}
                      
                      <Button variant="ghost" size="sm" className="text-indigo-600 px-3 py-1.5">
                        <FileText className="h-4 w-4 mr-1" />
                        Save Current as Template
                      </Button>
                    </div>
                  </div>
                  
                  {/* New: Custom Post Types */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Custom Post Types</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCustomTypes(!showCustomTypes)}
                      >
                        Manage Types
                      </Button>
                    </div>
                    
                    {showCustomTypes && (
                      <div className="mt-3 border rounded-md p-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="grid grid-cols-2 gap-2">
                          {customPostTypes.map(type => (
                            <div key={type} className="flex items-center justify-between p-2 border rounded-md bg-white dark:bg-gray-800">
                              <span>{type}</span>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center justify-center p-2 border rounded-md border-dashed bg-white dark:bg-gray-800">
                            <Button variant="ghost" className="text-indigo-600">
                              + Add New Type
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* New: Analytics Preview */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium">Post Analytics Preview</h4>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAnalytics(!showAnalytics)}
                      >
                        {showAnalytics ? 'Hide' : 'Show'} Analytics
                      </Button>
                    </div>
                    
                    {showAnalytics && (
                      <div className="mt-3 border rounded-md p-3">
                        <h5 className="text-sm font-medium mb-2">Engagement by Post Type</h5>
                        <div className="space-y-2">
                          {postAnalytics.map(item => (
                            <div key={item.type} className="flex items-center">
                              <span className="w-[80px] text-sm">{item.type}</span>
                              <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-500" 
                                  style={{ width: `${item.engagement}%` }}
                                />
                              </div>
                              <span className="w-[40px] text-right text-sm">{item.engagement}%</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Tip: Image posts generate the highest engagement in your community.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* PERMISSIONS TAB */}
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
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="premium">Premium Members Only</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="moderators">Moderators & Admins</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Edit Posts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Who can edit existing posts</p>
                      </div>
                    </div>
                    <Select defaultValue="author">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="author">Post Author</SelectItem>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="moderators">Moderators & Admins</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* New: Time Limit to Edit */}
                  <div className="ml-6 pl-6 border-l border-gray-100 dark:border-gray-800 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">Time Limit to Edit</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Time window for authors to edit posts</p>
                        </div>
                      </div>
                      <Select value={timeLimit} onValueChange={setTimeLimit}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="1440">24 hours</SelectItem>
                          <SelectItem value="10080">1 week</SelectItem>
                          <SelectItem value="unlimited">No limit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Delete Posts</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Who can delete posts</p>
                      </div>
                    </div>
                    <Select defaultValue="admins">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admins">Admins Only</SelectItem>
                        <SelectItem value="author">Post Author</SelectItem>
                        <SelectItem value="moderators">Moderators & Admins</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* New: Moderator Approval */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Moderator Approval Required</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">New posts require manual approval before publishing</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="p-3 mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-500 mt-0.5">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-700 dark:text-blue-400">Advanced Permission Settings</h4>
                        <p className="text-sm text-blue-600/80 dark:text-blue-500/80 mt-1">
                          Need more granular control? Configure role-based permissions and custom user groups in the 
                          <a href="#" className="text-blue-700 dark:text-blue-400 font-medium ml-1">Advanced Settings</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* SCHEDULING TAB */}
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
                    <Select defaultValue="30">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                        <SelectItem value="unlimited">No Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* New: Timezone Selection */}
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <h4 className="font-medium">Default Timezone</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Timezone used for scheduling posts</p>
                      </div>
                    </div>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <TimePicker value="10:00" onChange={() => {}} />
                      </div>
                      
                      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Weekends</span>
                          <Switch />
                        </div>
                        <TimePicker value="12:00" onChange={() => {}} />
                      </div>
                    </div>
                  </div>
                  
                  {/* New: Recurring Posts */}
                  <div className="py-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <h4 className="font-medium">Recurring Posts</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Enable and configure recurring post patterns</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="pl-6 border-l border-gray-100 dark:border-gray-800">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="weekly" />
                          <Label htmlFor="weekly" className="text-sm">Weekly</Label>
                          <Badge variant="outline" className="ml-2 text-xs">Most popular</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox id="biweekly" />
                          <Label htmlFor="biweekly" className="text-sm">Bi-weekly</Label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox id="monthly" />
                          <Label htmlFor="monthly" className="text-sm">Monthly</Label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox id="custom" />
                          <Label htmlFor="custom" className="text-sm">Custom schedule</Label>
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-medium mb-2">Example use cases</h5>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                          <li>Weekly discussion threads</li>
                          <li>Monthly challenges</li>
                          <li>Regular Q&A sessions</li>
                          <li>Content round-ups</li>
                        </ul>
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
