
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Play, Plus, Calendar, Users, Clock, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UPCOMING_STREAMS = [
  {
    id: 1,
    title: "Building a Full-Stack App with React and Node.js",
    description: "Join us as we build a complete full-stack application from scratch using React and Node.js",
    thumbnail: "/placeholder.svg",
    date: "April 15, 2025",
    time: "2:00 PM - 4:00 PM",
    host: "Emma Wilson",
    hostImage: "/placeholder.svg",
    attendees: 67,
    isPremium: false
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    description: "Discover advanced TypeScript patterns and techniques to improve your code quality",
    thumbnail: "/placeholder.svg",
    date: "April 22, 2025",
    time: "3:00 PM - 5:00 PM",
    host: "Alex Johnson",
    hostImage: "/placeholder.svg",
    attendees: 42,
    isPremium: true
  },
  {
    id: 3,
    title: "Responsive Design Masterclass",
    description: "Learn how to create truly responsive designs that work on any device",
    thumbnail: "/placeholder.svg",
    date: "May 5, 2025",
    time: "1:00 PM - 3:00 PM",
    host: "Marcus Chen",
    hostImage: "/placeholder.svg",
    attendees: 38,
    isPremium: false
  },
];

const PAST_STREAMS = [
  {
    id: 4,
    title: "Getting Started with CSS Grid",
    description: "An introduction to CSS Grid layout and how to use it effectively",
    thumbnail: "/placeholder.svg",
    date: "March 28, 2025",
    duration: "1h 45m",
    views: 1243,
    host: "Emma Wilson",
    hostImage: "/placeholder.svg",
    isPremium: false
  },
  {
    id: 5,
    title: "JavaScript Performance Optimization",
    description: "Techniques to optimize your JavaScript code for better performance",
    thumbnail: "/placeholder.svg",
    date: "March 15, 2025",
    duration: "2h 10m",
    views: 876,
    host: "Alex Johnson",
    hostImage: "/placeholder.svg",
    isPremium: true
  },
  {
    id: 6,
    title: "Building Accessible Web Applications",
    description: "Ensure your web applications are accessible to everyone",
    thumbnail: "/placeholder.svg",
    date: "February 20, 2025",
    duration: "1h 30m",
    views: 642,
    host: "Sophie Taylor",
    hostImage: "/placeholder.svg",
    isPremium: false
  },
];

const UpcomingStreamCard = ({ stream }) => {
  return (
    <Card className="overflow-hidden mb-4">
      <div className="relative">
        <img 
          src={stream.thumbnail} 
          alt={stream.title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          {stream.isPremium && (
            <Badge className="bg-nortech-purple">Premium</Badge>
          )}
          <Badge className="bg-green-600">Upcoming</Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button variant="default" className="bg-red-600 hover:bg-red-700">
            <Play size={14} className="mr-1" /> Reminder
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{stream.title}</CardTitle>
        <CardDescription className="text-sm flex items-center gap-2">
          <Calendar size={14} /> {stream.date}
          <Clock size={14} className="ml-2" /> {stream.time}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{stream.description}</p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={stream.hostImage} alt={stream.host} />
            <AvatarFallback>{stream.host[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{stream.host}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Users size={14} /> {stream.attendees}
        </div>
      </CardFooter>
    </Card>
  );
};

const PastStreamCard = ({ stream }) => {
  return (
    <Card className="overflow-hidden mb-4">
      <div className="relative">
        <img 
          src={stream.thumbnail} 
          alt={stream.title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        {stream.isPremium && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-nortech-purple">Premium</Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4">
          <Button variant="default">
            <Play size={14} className="mr-1" /> Watch
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <Badge variant="outline" className="bg-black/60 text-white border-none">
            {stream.duration}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{stream.title}</CardTitle>
        <CardDescription className="text-sm flex justify-between">
          <span>{stream.date}</span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {stream.views} views
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{stream.description}</p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={stream.hostImage} alt={stream.host} />
            <AvatarFallback>{stream.host[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{stream.host}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const LiveStreams = () => {
  const [currentStream, setCurrentStream] = useState(null);
  
  const handleCreateStream = () => {
    // Implementation would go here
  };

  return (
    <MainLayout title="Live Streams">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Live Streams</h1>
          <Button 
            onClick={handleCreateStream}
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
          >
            <Plus size={16} />
            <span>New Stream</span>
          </Button>
        </div>

        {currentStream ? (
          <div className="mb-8">
            <Card>
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <Video size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Stream Would Appear Here</h3>
                  <p className="text-gray-400">This is a placeholder for the live stream player</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{currentStream.title}</CardTitle>
                <CardDescription>
                  Streaming now • {currentStream.attendees} watching
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ) : null}

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Streams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {UPCOMING_STREAMS.map(stream => (
                <UpcomingStreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PAST_STREAMS.map(stream => (
                <PastStreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default LiveStreams;
