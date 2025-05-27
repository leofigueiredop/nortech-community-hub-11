import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Space } from './types';
import SpaceTemplates from './SpaceTemplates';

interface SpaceSettingsDialogProps {
  space?: Space;
  isOpen: boolean;
  onClose: () => void;
  onSave: (space: Partial<Space>) => void;
}

const SpaceSettingsDialog: React.FC<SpaceSettingsDialogProps> = ({
  space,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Space>>({
    name: space?.name || '',
    description: space?.description || '',
    type: space?.type || 'forum',
    icon: space?.icon || '💬',
    color: space?.color || '#4F46E5',
    isPrivate: space?.isPrivate || false,
    isActive: space?.isActive ?? true,
    template: space?.template || 'forum'
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    setFormData(prev => ({
      ...prev,
      template: templateId,
      type: templateId as any
    }));
  };

  const emojiOptions = ['💬', '❓', '📰', '📚', '🔧', '🎯', '💡', '🌟', '🚀', '🎨'];
  const colorOptions = [
    '#4F46E5', '#7C3AED', '#DC2626', '#EA580C', 
    '#CA8A04', '#16A34A', '#0891B2', '#C2410C'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {space ? 'Edit Space' : 'Create New Space'}
          </DialogTitle>
          <DialogDescription>
            Configure your space settings, template, and permissions.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Space Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter space name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Space Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forum">Forum Discussion</SelectItem>
                    <SelectItem value="qa">Q&A Space</SelectItem>
                    <SelectItem value="feed">Content Feed</SelectItem>
                    <SelectItem value="course">Course Space</SelectItem>
                    <SelectItem value="project">Project Collaboration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this space is for"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`p-2 rounded border text-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        formData.icon === emoji ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        formData.color === color ? 'border-gray-800 dark:border-gray-200' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Private Space</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Only invited members can see and join this space
                </p>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Active</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Space is visible and accessible to members
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Templates determine the default layout, features, and behavior of your space.
              </p>
              <SpaceTemplates
                selectedTemplate={formData.template}
                onSelectTemplate={handleTemplateSelect}
              />
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Permission Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Posts</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Members can create new posts in this space
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Comments</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Members can comment on posts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Approval</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      New posts require moderator approval
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Reactions</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Members can react to posts and comments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {space ? 'Update Space' : 'Create Space'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpaceSettingsDialog; 