import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Layers, 
  Users, 
  Image, 
  HelpCircle, 
  Inbox, 
  ChevronRight,
  BookOpen,
  FileImage,
  Video,
  Music,
  Sparkles,
  Search,
  Lightbulb,
  LayoutTemplate,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SpaceTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SpaceTypeCard: React.FC<SpaceTypeCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <Card className="cursor-pointer hover:border-nortech-purple transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-nortech-purple/10 p-2 rounded-lg">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const CreateSpace: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [detailsStep, setDetailsStep] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const { toast } = useToast();

  const handleCreateSpace = () => {
    if (!spaceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a name for your space.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Space created",
      description: `Your ${selectedType} space "${spaceName}" has been created successfully.`,
    });

    setSelectedType(null);
    setDetailsStep(false);
    setSpaceName('');
    setSpaceDescription('');
  };

  const spaceTypes = [
    { 
      type: 'posts', 
      icon: <FileText className="h-5 w-5 text-nortech-purple" />, 
      title: 'Posts', 
      description: 'Create and share articles, updates and news with your community.',
      category: 'content'
    },
    { 
      type: 'library', 
      icon: <BookOpen className="h-5 w-5 text-nortech-purple" />, 
      title: 'Content Library', 
      description: 'Organize and share rich media content with your community.',
      category: 'content'
    },
    { 
      type: 'course', 
      icon: <Layers className="h-5 w-5 text-nortech-purple" />, 
      title: 'Course', 
      description: 'Create structured learning content with lessons and modules.',
      category: 'content'
    },
    { 
      type: 'gallery', 
      icon: <FileImage className="h-5 w-5 text-nortech-purple" />, 
      title: 'Image Gallery', 
      description: 'Share photos and image collections with your community.',
      category: 'content'
    },
    { 
      type: 'videos', 
      icon: <Video className="h-5 w-5 text-nortech-purple" />, 
      title: 'Video Collection', 
      description: 'Organize and share video content with your members.',
      category: 'content'
    },
    { 
      type: 'podcast', 
      icon: <Music className="h-5 w-5 text-nortech-purple" />, 
      title: 'Podcast', 
      description: 'Create and share audio content and episodes.',
      category: 'content'
    },
    
    { 
      type: 'events', 
      icon: <Calendar className="h-5 w-5 text-nortech-purple" />, 
      title: 'Events', 
      description: 'Schedule and manage in-person or virtual events for your community.',
      category: 'community'
    },
    { 
      type: 'members', 
      icon: <Users className="h-5 w-5 text-nortech-purple" />, 
      title: 'Members Hub', 
      description: 'Create a dedicated space to manage community membership.',
      category: 'community'
    },
    
    { 
      type: 'chat', 
      icon: <MessageSquare className="h-5 w-5 text-nortech-purple" />, 
      title: 'Chat', 
      description: 'Enable real-time conversations between community members.',
      category: 'communication'
    },
    { 
      type: 'support', 
      icon: <Inbox className="h-5 w-5 text-nortech-purple" />, 
      title: 'Support', 
      description: 'Provide help and support for your community members.',
      category: 'communication'
    },
    { 
      type: 'faq', 
      icon: <HelpCircle className="h-5 w-5 text-nortech-purple" />, 
      title: 'FAQ', 
      description: 'Create a space for frequently asked questions and answers.',
      category: 'communication'
    },
    
    { 
      type: 'ai-matchmaker', 
      icon: <Sparkles className="h-5 w-5 text-nortech-purple" />, 
      title: 'AI Matchmaker', 
      description: 'Connect members with shared interests using AI algorithms.',
      category: 'ai'
    },
    { 
      type: 'ai-content', 
      icon: <Wand2 className="h-5 w-5 text-nortech-purple" />, 
      title: 'AI Content Generator', 
      description: 'Create content automatically based on your community needs.',
      category: 'ai'
    },
    { 
      type: 'ai-search', 
      icon: <Search className="h-5 w-5 text-nortech-purple" />, 
      title: 'Smart Search', 
      description: 'AI-powered search to help members find what they need quickly.',
      category: 'ai'
    },
  ];

  const templateOptions = [
    {
      title: "Community Hub",
      description: "Complete community space with posts, events, and member sections",
      icon: <Users className="h-5 w-5 text-nortech-purple" />
    },
    {
      title: "Learning Academy",
      description: "Educational space with courses, resources, and assessments",
      icon: <BookOpen className="h-5 w-5 text-nortech-purple" />
    },
    {
      title: "Content Creator",
      description: "Publish and monetize articles, videos, and podcasts",
      icon: <FileText className="h-5 w-5 text-nortech-purple" />
    },
    {
      title: "Events Platform",
      description: "Manage registrations, RSVPs, and virtual events",
      icon: <Calendar className="h-5 w-5 text-nortech-purple" />
    }
  ];

  const filteredSpaces = currentTab === 'all' 
    ? spaceTypes 
    : spaceTypes.filter(space => space.category === currentTab);

  if (detailsStep && selectedType) {
    const spaceType = spaceTypes.find(s => s.type === selectedType);
    
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setDetailsStep(false)}
              className="mb-4"
            >
              ← Back to space types
            </Button>
            
            <h1 className="text-2xl font-bold mb-2">Create {spaceType?.title} Space</h1>
            <p className="text-gray-500 dark:text-gray-400">{spaceType?.description}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Space Details</CardTitle>
              <CardDescription>Configure the basic information for your new space.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Space name *</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name for your space" 
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide a short description of what this space is about" 
                  className="min-h-[100px]"
                  value={spaceDescription}
                  onChange={(e) => setSpaceDescription(e.target.value)}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={handleCreateSpace}
                >
                  Create Space
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create a Space</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Spaces help you organize content and engage with your community in different ways.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="ai">AI-Powered</TabsTrigger>
        </TabsList>
        
        <TabsContent value={currentTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <SpaceTypeCard 
                key={space.type}
                icon={space.icon}
                title={space.title}
                description={space.description}
                onClick={() => {
                  setSelectedType(space.type);
                  setDetailsStep(true);
                }}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Start with a template</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Get started quickly with pre-configured spaces designed for specific use cases.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {templateOptions.map((template, index) => (
            <Card key={index} className="cursor-pointer hover:border-nortech-purple transition-colors">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-nortech-purple/10 p-2 rounded-lg">
                    {template.icon}
                  </div>
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button className="shrink-0">
            Browse all templates <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateSpace;
