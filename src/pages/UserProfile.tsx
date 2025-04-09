
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EventsAttendanceHistory from '@/components/profile/EventsAttendanceHistory';
import { CalendarDays, MapPin, MessageSquare, Settings, User } from 'lucide-react';

// Mock user data
const USER = {
  id: '1',
  name: 'Ana Silva',
  username: 'anasilva',
  avatar: 'https://i.pravatar.cc/150?img=29',
  bio: 'Full-stack developer passionate about React and TypeScript. I love attending tech events and learning new things!',
  location: 'São Paulo, Brazil',
  memberSince: 'January 2023',
  role: 'Community Member',
  badges: [
    { name: 'Early Adopter', color: 'bg-amber-100 text-amber-800' },
    { name: 'Event Enthusiast', color: 'bg-blue-100 text-blue-800' },
    { name: 'Course Champion', color: 'bg-green-100 text-green-800' },
  ]
};

const UserProfile: React.FC = () => {
  return (
    <MainLayout title="User Profile">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={USER.avatar} alt={USER.name} />
                  <AvatarFallback>{USER.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{USER.name}</h2>
                  <p className="text-muted-foreground">@{USER.username}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2 flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {USER.role}
                  </p>
                  <p className="text-muted-foreground mb-4 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {USER.location}
                  </p>
                  <p className="text-muted-foreground mb-4 flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Member since {USER.memberSince}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Bio</h3>
                  <p>{USER.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {USER.badges.map((badge, index) => (
                      <Badge key={index} className={badge.color}>
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Events History</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="points">Points & Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsAttendanceHistory userId={USER.id} />
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent community activity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">User activity will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Contributions</CardTitle>
                <CardDescription>Posts, articles, and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">User content will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Points & Badges</CardTitle>
                <CardDescription>Gamification achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">Points and badges details will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
