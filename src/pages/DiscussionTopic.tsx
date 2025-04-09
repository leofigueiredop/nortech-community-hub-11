
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Filter, ArrowLeft } from 'lucide-react';
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

// Mock topics data with discussions
const TOPIC_DISCUSSIONS = {
  "renda-extra": {
    name: "Renda Extra",
    description: "Discussões sobre formas de gerar renda extra e oportunidades financeiras",
    discussions: [
      {
        id: 101,
        title: "Como iniciar com freelancing?",
        description: "Gostaria de dicas sobre como iniciar no mundo do freelancing como desenvolvedor",
        author: "Juliana Mendes",
        authorImage: "/placeholder.svg",
        replies: 14,
        participants: 7,
        tags: ["Freelancing", "Desenvolvimento", "Iniciantes"],
        isHot: true,
        lastActivity: "1 hora atrás"
      },
      {
        id: 102,
        title: "Mercado financeiro para iniciantes",
        description: "Quais são os melhores caminhos para quem quer começar a investir com pouco dinheiro?",
        author: "Rafael Costa",
        authorImage: "/placeholder.svg",
        replies: 23,
        participants: 9,
        tags: ["Investimentos", "Finanças", "Iniciantes"],
        isHot: false,
        lastActivity: "5 horas atrás"
      }
    ]
  },
  "networking": {
    name: "Networking",
    description: "Dicas e discussões sobre como expandir sua rede profissional e criar conexões valiosas",
    discussions: [
      {
        id: 201,
        title: "Eventos de networking em São Paulo",
        description: "Alguém conhece bons eventos para networking na área de tecnologia em São Paulo?",
        author: "Carlos Almeida",
        authorImage: "/placeholder.svg",
        replies: 17,
        participants: 12,
        tags: ["Eventos", "São Paulo", "Tecnologia"],
        isHot: true,
        lastActivity: "2 horas atrás"
      },
      {
        id: 202,
        title: "LinkedIn: estratégias eficazes",
        description: "Vamos compartilhar estratégias que realmente funcionam para networking no LinkedIn",
        author: "Mariana Silva",
        authorImage: "/placeholder.svg",
        replies: 31,
        participants: 15,
        tags: ["LinkedIn", "Estratégia", "Carreira"],
        isHot: true,
        lastActivity: "6 horas atrás"
      }
    ]
  },
  "perguntas-da-semana": {
    name: "Perguntas da Semana",
    description: "Questões relevantes e dúvidas frequentes desta semana na comunidade",
    discussions: [
      {
        id: 301,
        title: "Como lidar com síndrome do impostor?",
        description: "Estou começando em uma nova empresa e sinto que não estou à altura do cargo. Como lidar?",
        author: "Amanda Rocha",
        authorImage: "/placeholder.svg",
        replies: 42,
        participants: 18,
        tags: ["Psicologia", "Carreira", "Autoconfiança"],
        isHot: true,
        lastActivity: "3 horas atrás"
      },
      {
        id: 302,
        title: "Melhor stack para um novo projeto?",
        description: "Estou começando um novo projeto pessoal e gostaria de sugestões sobre a melhor stack para usar",
        author: "Bruno Ferreira",
        authorImage: "/placeholder.svg",
        replies: 27,
        participants: 14,
        tags: ["Desenvolvimento", "Stack", "Tecnologia"],
        isHot: false,
        lastActivity: "1 dia atrás"
      }
    ]
  }
};

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
                Iniciado por {discussion.author} • {discussion.lastActivity}
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
            <MessageSquare size={14} /> {discussion.replies} respostas
          </span>
          <span>{discussion.participants} participantes</span>
        </div>
        <Button variant="ghost" size="sm">Ver Discussão</Button>
      </CardFooter>
    </Card>
  );
};

const CreateDiscussionDialog = ({ topicId, topicName }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Discussão criada",
      description: `Sua discussão "${title}" foi criada no tópico ${topicName}`,
      duration: 3000,
    });
    setOpen(false);
    setTitle('');
    setDescription('');
    setTags('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
        >
          <Plus size={16} />
          <span>Iniciar Discussão</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nova Discussão em {topicName}</DialogTitle>
          <DialogDescription>
            Crie uma nova discussão para compartilhar com a comunidade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título claro e conciso"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione mais detalhes sobre sua discussão"
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Carreira, Desenvolvimento, Iniciantes"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Publicar Discussão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DiscussionTopic = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  
  // Determine if user can create discussions (admin or moderator)
  const canCreateDiscussion = viewAs === 'admin' || viewAs === 'moderator';

  // Get topic data
  const topicData = TOPIC_DISCUSSIONS[topicId];

  // Handle if topic doesn't exist
  useEffect(() => {
    if (!topicData && topicId) {
      toast({
        title: "Tópico não encontrado",
        description: "O tópico que você procura não existe ou foi removido.",
        variant: "destructive",
        duration: 3000,
      });
      navigate('/discussions');
    }
  }, [topicId, topicData, toast, navigate]);

  if (!topicData) {
    return null;
  }

  return (
    <MainLayout title={`Discussões: ${topicData.name}`}>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate('/discussions')}
          >
            <ArrowLeft size={16} />
            <span>Voltar para Tópicos</span>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{topicData.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{topicData.description}</p>
          </div>
          
          {canCreateDiscussion && (
            <CreateDiscussionDialog topicId={topicId} topicName={topicData.name} />
          )}
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Buscar discussões..." 
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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todas Discussões</TabsTrigger>
            <TabsTrigger value="active">Ativas</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
            <TabsTrigger value="unanswered">Sem Resposta</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {topicData.discussions.map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            {topicData.discussions.filter(d => d.lastActivity.includes('hora')).map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="popular" className="mt-4">
            {topicData.discussions.filter(d => d.isHot).map(discussion => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))}
          </TabsContent>
          <TabsContent value="unanswered" className="mt-4">
            <div className="text-center py-8 text-gray-500">
              <p>Não há discussões sem resposta no momento.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DiscussionTopic;
