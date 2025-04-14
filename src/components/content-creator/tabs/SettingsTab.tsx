
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Upload, Globe, MessageSquare, EyeIcon, BellIcon } from 'lucide-react';

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>
            Manage settings for your content publication and distribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-publish scheduled content</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically publish content when it reaches its scheduled publish date
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Notify subscribers on publication</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Send notifications to your subscribers when you publish new content
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Allow comments on content</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Enable or disable commenting ability on your published content
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base font-medium mb-2 block">Default content visibility</Label>
            <Select defaultValue="public">
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (visible to everyone)</SelectItem>
                <SelectItem value="members">Members only</SelectItem>
                <SelectItem value="premium">Premium members only</SelectItem>
                <SelectItem value="private">Private (only visible to you)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              Set the default visibility for newly created content
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Publication Preferences</CardTitle>
          <CardDescription>
            Configure how your content is shared and distributed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="default-category">Default Category</Label>
              <Select defaultValue="general">
                <SelectTrigger id="default-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="tutorials">Tutorials</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="announcements">Announcements</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Default category for new content
              </p>
            </div>
            <div>
              <Label htmlFor="points-award">Default points to award</Label>
              <Input id="points-award" type="number" defaultValue="10" />
              <p className="text-sm text-muted-foreground mt-1">
                Points awarded to users for consuming this content
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Social media sharing</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically share new content to connected social media accounts
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Feature in discovery section</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Allow your content to be featured in the community discovery section
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SettingsTab;
