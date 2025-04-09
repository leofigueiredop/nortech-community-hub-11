import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Filter, Users, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useViewContext } from '@/components/layout/MainLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

const TOPIC_CATEGORIES = [
  {
    id: "renda-extra",
    name: "Renda Extra",
    description: "Discussões sobre formas de gerar renda extra e oportunidades financeiras",
    icon: <TrendingUp size={18} />,
    discussionCount: 23,
    memberCount: 147,
    recentActivity: "1 hora atrás"
  },
  {
    id: "networking",
    name: "Networking",
    description: "Dicas e discussões sobre como expandir sua rede profissional e criar conexões valiosas",
    icon: <Users size={18} />,
    discussionCount: 42,
    memberCount: 253,
    recentActivity: "30 minutos atrás"
  },
  {
    id: "perguntas-da-semana",
    name: "Perguntas da Semana",
    description: "Questões relevantes e dúvidas frequentes desta semana na comunidade",
    icon: <Clock size={18} />,
    discussionCount: 18,
    memberCount: 312,
    recentActivity: "2 horas atrás"
  }
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

const TopicCard = ({ topic }) => {
  return (
    <Card className="mb-4 hover:border-nortech-purple/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-nortech-purple">
              {topic.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{topic.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {topic.description}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} /> {topic.discussionCount} discussões
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {topic.memberCount} membros
          </span>
          <span>Atividade recente: {topic.recentActivity}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/discussions/${topic.id}`}>
          <Button variant="outline">Explorar Tópico</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const CreateTopicDialog = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Tópico criado",
      description: `Seu tópico "${name}" foi criado com sucesso`,
      duration: 3000,
    });
    setOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
        >
          <Plus size={16} />
          <span>Criar Tópico</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Tópico</DialogTitle>
          <DialogDescription>
            Crie um novo tópico de discussão para a comunidade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Tópico</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite um nome para o tópico"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva do que se trata este tópico"
              required
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Criar Tópico
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Discussions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  
  const canCreateTopic = viewAs === 'admin' || viewAs === 'moderator';

  return (
    <MainLayout title="Discussions">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Fóruns de Discussão</h1>
          {canCreateTopic && <CreateTopicDialog />}
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Buscar tópicos..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>Filtrar</span>
          </Button>
        </div>

        <Tabs defaultValue="topics">
          <TabsList>
            <TabsTrigger value="topics">Tópicos</TabsTrigger>
            <TabsTrigger value="recent">Discussões Recentes</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
          </TabsList>
          <TabsContent value="topics" className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Tópicos da Comunidade</h2>
            {TOPIC_CATEGORIES.map(topic => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Discussões Recentes</h2>
            {DISCUSSION_TOPICS.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="popular" className="mt-4">
            <h2 className="text-lg font-semibold mb-4">Discussões Populares</h2>
            {DISCUSSION_TOPICS.filter(d => d.isHot).map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discussions;
