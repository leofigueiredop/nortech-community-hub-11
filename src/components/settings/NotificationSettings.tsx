
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar, MessageSquare, FileText, Megaphone, Award, UserPlus, Mail, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationSettings: React.FC = () => {
  const [preferences, setPreferences] = useState({
    posts: true,
    replies: true,
    mentions: true,
    events: true,
    content: true,
    invitations: true,
    milestones: true,
    announcements: true,
  });

  const [channels, setChannels] = useState({
    inApp: true,
    email: true,
    push: false,
    digest: true,
  });

  const [frequency, setFrequency] = useState('realtime');

  const handleTogglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleToggleChannel = (key: keyof typeof channels) => {
    setChannels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg text-white">
      <p className="mb-8">
        Customize how and when you receive notifications from Nortech Communities.
        These settings apply across all spaces you're a member of.
      </p>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="types">Notification Types</TabsTrigger>
          <TabsTrigger value="channels">Delivery Channels</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <Label className="text-base font-semibold text-white">New posts</Label>
                  <p className="text-gray-400 text-sm">When someone posts in a space you follow</p>
                </div>
              </div>
              <Switch 
                checked={preferences.posts} 
                onCheckedChange={() => handleTogglePreference('posts')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Replies to your posts</Label>
                  <p className="text-gray-400 text-sm">When someone replies to your post or comment</p>
                </div>
              </div>
              <Switch 
                checked={preferences.replies} 
                onCheckedChange={() => handleTogglePreference('replies')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Events and live sessions</Label>
                  <p className="text-gray-400 text-sm">Upcoming events you've registered for</p>
                </div>
              </div>
              <Switch 
                checked={preferences.events} 
                onCheckedChange={() => handleTogglePreference('events')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-teal-400" />
                <div>
                  <Label className="text-base font-semibold text-white">New content</Label>
                  <p className="text-gray-400 text-sm">When new content is added to courses you're enrolled in</p>
                </div>
              </div>
              <Switch 
                checked={preferences.content} 
                onCheckedChange={() => handleTogglePreference('content')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-pink-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Invitations</Label>
                  <p className="text-gray-400 text-sm">Space invitations and membership approvals</p>
                </div>
              </div>
              <Switch 
                checked={preferences.invitations} 
                onCheckedChange={() => handleTogglePreference('invitations')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-amber-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Milestones and achievements</Label>
                  <p className="text-gray-400 text-sm">When you complete courses or earn new badges</p>
                </div>
              </div>
              <Switch 
                checked={preferences.milestones} 
                onCheckedChange={() => handleTogglePreference('milestones')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-red-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Announcements</Label>
                  <p className="text-gray-400 text-sm">Important community announcements from admins</p>
                </div>
              </div>
              <Switch 
                checked={preferences.announcements} 
                onCheckedChange={() => handleTogglePreference('announcements')}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-indigo-400" />
                <div>
                  <Label className="text-base font-semibold text-white">In-app notifications</Label>
                  <p className="text-gray-400 text-sm">Notifications in the notification center</p>
                </div>
              </div>
              <Switch 
                checked={channels.inApp} 
                onCheckedChange={() => handleToggleChannel('inApp')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Email notifications</Label>
                  <p className="text-gray-400 text-sm">Send notifications to your email</p>
                </div>
              </div>
              <Switch 
                checked={channels.email} 
                onCheckedChange={() => handleToggleChannel('email')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-orange-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Push notifications</Label>
                  <p className="text-gray-400 text-sm">Notifications on your mobile device</p>
                </div>
              </div>
              <Switch 
                checked={channels.push} 
                onCheckedChange={() => handleToggleChannel('push')}
              />
            </div>

            <Separator className="bg-gray-800" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-rose-400" />
                <div>
                  <Label className="text-base font-semibold text-white">Digest emails</Label>
                  <p className="text-gray-400 text-sm">Receive a summary of activities</p>
                </div>
              </div>
              <Switch 
                checked={channels.digest} 
                onCheckedChange={() => handleToggleChannel('digest')}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frequency" className="space-y-6">
          <div className="space-y-6">
            <Label className="text-base font-semibold text-white">Notification frequency</Label>
            <p className="text-gray-400 text-sm mb-4">Choose how often you receive notifications</p>

            <RadioGroup 
              value={frequency} 
              onValueChange={setFrequency} 
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="realtime" id="realtime" />
                <Label htmlFor="realtime" className="text-white">
                  <span className="font-semibold">Real-time</span>
                  <p className="text-gray-400 text-sm">Receive notifications as they happen</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-white">
                  <span className="font-semibold">Daily digest</span>
                  <p className="text-gray-400 text-sm">Receive a summary once a day</p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="text-white">
                  <span className="font-semibold">Weekly digest</span>
                  <p className="text-gray-400 text-sm">Receive a summary once a week</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button className="bg-nortech-purple hover:bg-nortech-purple/90">
          Save preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
