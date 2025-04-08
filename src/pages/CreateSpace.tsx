
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
  ChevronRight 
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

    // Reset form after success
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
      type: 'events', 
      icon: <Calendar className="h-5 w-5 text-nortech-purple" />, 
      title: 'Events', 
      description: 'Schedule and manage in-person or virtual events for your community.',
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
      type: 'course', 
      icon: <Layers className="h-5 w-5 text-nortech-purple" />, 
      title: 'Course', 
      description: 'Create structured learning content with lessons and modules.',
      category: 'content'
    },
    { 
      type: 'members', 
      icon: <Users className="h-5 w-5 text-nortech-purple" />, 
      title: 'Members', 
      description: 'Create a dedicated space to manage community membership.',
      category: 'community'
    },
    { 
      type: 'images', 
      icon: <Image className="h-5 w-5 text-nortech-purple" />, 
      title: 'Gallery', 
      description: 'Share photos and images with your community members.',
      category: 'content'
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium mb-2">Need inspiration?</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Check out examples of popular community spaces and how others have set them up.
            </p>
          </div>
          <Button className="shrink-0">
            Browse examples <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateSpace;
