
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DISCUSSION_TOPICS = [
  {
    id: 1,
    title: "Getting started with React development",
    description: "Share your journey and tips for beginners in React",
    author: "Emma Wilson",
    authorImage: "/placeholder.svg",
    replies: 28,
    participants: 12,
    tags: ["Development", "React", "Beginners"],
    isHot: true,
    lastActivity: "2 hours ago"
  },
  {
    id: 2,
    title: "Best practices for state management",
    description: "Discussion about different state management solutions in modern web apps",
    author: "Alex Johnson",
    authorImage: "/placeholder.svg",
    replies: 42,
    participants: 15,
    tags: ["State Management", "Redux", "Context API"],
    isHot: true,
    lastActivity: "4 hours ago"
  },
  {
    id: 3,
    title: "Career switch to web development",
    description: "Let's talk about transitioning to web development from other fields",
    author: "Marcus Chen",
    authorImage: "/placeholder.svg",
    replies: 17,
    participants: 8,
    tags: ["Career", "Learning"],
    isHot: false,
    lastActivity: "1 day ago"
  },
  {
    id: 4,
    title: "Weekly coding challenge discussion",
    description: "Share your solutions and discuss this week's coding challenge",
    author: "Sophie Taylor",
    authorImage: "/placeholder.svg",
    replies: 9,
    participants: 5,
    tags: ["Coding Challenge", "Algorithms"],
    isHot: false,
    lastActivity: "3 days ago"
  },
];

const DiscussionCard = ({ discussion }) => {
  return (
    <Card className="mb-4 hover:border-nortech-purple/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={discussion.authorImage} alt={discussion.author} />
              <AvatarFallback>{discussion.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{discussion.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Started by {discussion.author} • {discussion.lastActivity}
              </CardDescription>
            </div>
          </div>
          {discussion.isHot && (
            <Badge variant="destructive" className="ml-2">Hot</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{discussion.description}</p>
        <div className="flex flex-wrap gap-2">
          {discussion.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} /> {discussion.replies} replies
          </span>
          <span>{discussion.participants} participants</span>
        </div>
        <Button variant="ghost" size="sm">View Discussion</Button>
      </CardFooter>
    </Card>
  );
};

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleCreateDiscussion = () => {
    toast({
      title: "Create Discussion",
      description: "The create discussion dialog would open here.",
      duration: 3000,
    });
  };

  return (
    <MainLayout title="Discussions">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discussions</h1>
          <Button 
            onClick={handleCreateDiscussion}
            className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
          >
            <Plus size={16} />
            <span>Start Discussion</span>
          </Button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search discussions..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {DISCUSSION_TOPICS.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            {DISCUSSION_TOPICS.filter(d => d.lastActivity.includes('hours')).map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="popular" className="mt-4">
            {DISCUSSION_TOPICS.filter(d => d.isHot).map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="unanswered" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              <p>No unanswered discussions at the moment.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discussions;
