
import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Layout, 
  Users, 
  Settings, 
  Tag, 
  PlusCircle, 
  BarChart3, 
  FileText,
  Info,
  Lock,
  Pencil,
  ChevronRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SupportCTA from '@/components/settings/marketing/SupportCTA';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

const Spaces: React.FC = () => {
  const [defaultPrefix, setDefaultPrefix] = useState("Community");
  const [categories, setCategories] = useState([
    { id: '1', name: 'General', description: 'General community spaces', color: '#4F46E5', icon: '🌎' },
    { id: '2', name: 'Learning', description: 'Educational spaces', color: '#16A34A', icon: '📚' },
    { id: '3', name: 'Social', description: 'Community interaction spaces', color: '#F59E0B', icon: '👋' }
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [autoJoinOption, setAutoJoinOption] = useState("everyone");
  const [privateSpaceVisibility, setPrivateSpaceVisibility] = useState("invite-only");
  const [discoveryPlacement, setDiscoveryPlacement] = useState("sidebar");
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { 
        id: Date.now().toString(), 
        name: newCategory, 
        description: '', 
        color: '#4F46E5',
        icon: '📎'
      }]);
      setNewCategory("");
    }
  };

  const handleUpdateCategory = (id: string, field: string, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

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
          {/* Default Space Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-500" />
                Default Space Settings
              </CardTitle>
              <CardDescription>Configure default settings for new spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="default-space-name" className="text-sm font-medium">
                    Default Space Name Prefix
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Settings className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">This prefix will be used when auto-generating new space names.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="default-space-name" 
                  placeholder="e.g., Community" 
                  value={defaultPrefix}
                  onChange={(e) => setDefaultPrefix(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-t dark:border-gray-800">
                  <div>
                    <h4 className="font-medium">Auto-join for New Members</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">New members automatically join general spaces</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <select 
                      className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm"
                      value={autoJoinOption}
                      onChange={(e) => setAutoJoinOption(e.target.value)}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="free-only">Only Free Members</option>
                      <option value="premium-only">Only Premium Members</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-t dark:border-gray-800">
                  <div>
                    <h4 className="font-medium">Enable Private Spaces</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow creation of private spaces</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <select 
                      className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm"
                      value={privateSpaceVisibility}
                      onChange={(e) => setPrivateSpaceVisibility(e.target.value)}
                    >
                      <option value="invite-only">Invite Only</option>
                      <option value="hidden">Hidden but Joinable</option>
                      <option value="request">Visible with Request</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-t dark:border-gray-800">
                  <div>
                    <h4 className="font-medium">Enable Space Discovery</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow members to discover and join available spaces</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <select 
                      className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 bg-white dark:bg-gray-800 text-sm"
                      value={discoveryPlacement}
                      onChange={(e) => setDiscoveryPlacement(e.target.value)}
                    >
                      <option value="sidebar">Sidebar</option>
                      <option value="feed">Feed Highlights</option>
                      <option value="explore">Explore Page</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Default Template Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Default Template Settings
              </CardTitle>
              <CardDescription>Set the default structure for new spaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Space Template</Label>
                <select className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-800">
                  <option>Forum Discussion</option>
                  <option>Q&A Space</option>
                  <option>Content Feed</option>
                  <option>Course Space</option>
                  <option>Project Collaboration</option>
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Templates determine default layout, post types, and features.
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium">Template Settings</span>
                <Button variant="outline" size="sm" className="text-xs">
                  Configure Templates
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Member Rules</h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                <p className="text-sm">Require approval for joining spaces</p>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between py-2 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                <p className="text-sm">Max spaces per member</p>
                <Input className="w-20 h-8 text-center" type="number" defaultValue={10} min={1} />
              </div>
            </CardContent>
          </Card>
          
          {/* Space Creation Permissions Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-500" />
                Space Creation & Management Permissions
              </CardTitle>
              <CardDescription>Control who can create and manage spaces</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Action</TableHead>
                    <TableHead className="text-center">Admins</TableHead>
                    <TableHead className="text-center">Moderators</TableHead>
                    <TableHead className="text-center">Space Creator</TableHead>
                    <TableHead className="text-center">All Members</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        Create Spaces
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Choose who can create new spaces in the community.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked disabled />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch />
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        Edit Space Settings
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Choose who can edit space settings.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked disabled />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch />
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        Manage Space Members
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Choose who can manage members within spaces.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked disabled />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch defaultChecked />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Switch />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Space Categories Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-indigo-500" />
                Space Categories
              </CardTitle>
              <CardDescription>Manage space categories for organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                    style={{ borderLeftWidth: '4px', borderLeftColor: category.color }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <h4 className="font-medium">{category.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={() => setEditingCategory(category.id === editingCategory ? null : category.id)}
                              >
                                <Pencil className="h-3.5 w-3.5 text-gray-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Edit category</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                    
                    {editingCategory === category.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
                        <div className="flex items-center gap-2">
                          <Input 
                            className="text-xs h-7" 
                            placeholder="Icon (emoji)" 
                            value={category.icon} 
                            onChange={(e) => handleUpdateCategory(category.id, 'icon', e.target.value)}
                          />
                          <Input 
                            type="color" 
                            className="w-7 h-7 p-0" 
                            value={category.color} 
                            onChange={(e) => handleUpdateCategory(category.id, 'color', e.target.value)}
                          />
                        </div>
                        <Input 
                          className="text-xs h-7" 
                          placeholder="Description" 
                          value={category.description} 
                          onChange={(e) => handleUpdateCategory(category.id, 'description', e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setEditingCategory(null)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="New category name" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory}>Add Category</Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Link */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Space Analytics
              </CardTitle>
              <CardDescription>
                View detailed engagement stats for your community spaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitor activity trends, engagement levels, and growth across all spaces.
                </p>
                <Button>
                  View Analytics
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <SupportCTA />
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Spaces;
