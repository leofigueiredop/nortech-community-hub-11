
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share, 
  MoreHorizontal,
  Star,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useViewContext } from '@/components/layout/MainLayout';
import { useDiscussions } from '@/hooks/useDiscussions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { usePoints } from '@/context/PointsContext';

const DiscussionDetail = () => {
  const { topicId, discussionId } = useParams<{ topicId: string; discussionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { viewAs } = useViewContext();
  const { addPoints } = usePoints();
  const { 
    getTopic, 
    getDiscussion, 
    getReplies, 
    addReply, 
    voteDiscussion, 
    voteReply, 
    acceptAnswer 
  } = useDiscussions();
  
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedDiscussion, setLikedDiscussion] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({});
  
  // Get topic and discussion data
  const topicData = topicId ? getTopic(topicId) : null;
  const discussion = discussionId ? getDiscussion(discussionId) : null;
  const replies = discussionId ? getReplies(discussionId) : [];
  
  // Handle submission of a new reply
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topicId || !discussionId || !replyContent.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Mock author data - in a real app, this would come from auth context
    const author = {
      id: 'current-user',
      name: 'Você',
      avatar: '/placeholder.svg',
      level: 2,
      xp: 150
    };
    
    addReply(discussionId, {
      content: replyContent,
      author,
      parent_id: undefined,
      user_id: 'current-user',
      discussion_id: discussionId
    });
    
    toast({
      title: "Resposta enviada",
      description: "Sua resposta foi adicionada à discussão",
      duration: 3000,
    });
    
    setReplyContent('');
    setIsSubmitting(false);
  };
  
  // Handle liking a discussion
  const handleLikeDiscussion = () => {
    if (!discussionId || likedDiscussion) return;
    
    voteDiscussion(discussionId, true);
    setLikedDiscussion(true);
    
    toast({
      title: "Apoiado!",
      description: "Você deu um upvote nesta discussão",
      duration: 1500,
    });
  };
  
  // Handle liking a reply
  const handleLikeReply = (replyId: string) => {
    if (likedReplies[replyId]) return;
    
    voteReply(discussionId || '', replyId, true);
    setLikedReplies(prev => ({
      ...prev,
      [replyId]: true
    }));
    
    toast({
      title: "Apoiado!",
      description: "Você deu um upvote nesta resposta",
      duration: 1500,
    });
  };
  
  // Handle accepting an answer
  const handleAcceptAnswer = (replyId: string) => {
    if (!discussionId) return;
    
    acceptAnswer(discussionId, replyId);
    
    toast({
      title: "Resposta aceita",
      description: "Você marcou esta resposta como solução para a pergunta",
      duration: 3000,
    });
  };
  
  // Handle share action
  const handleShare = () => {
    if (navigator.share && discussionId) {
      navigator.share({
        title: discussion?.title || 'Discussão',
        text: discussion?.description || '',
        url: window.location.href,
      }).catch(() => {
        // Fallback if share API fails
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado",
          description: "O link da discussão foi copiado para a área de transferência",
          duration: 3000,
        });
      });
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado",
        description: "O link da discussão foi copiado para a área de transferência",
        duration: 3000,
      });
    }
  };
  
  // Redirect if resources are not found
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
    
    if (topicData && !discussion && discussionId) {
      toast({
        title: "Discussão não encontrada",
        description: "A discussão que você procura não existe ou foi removida.",
        variant: "destructive",
        duration: 3000,
      });
      navigate(`/discussions/${topicId}`);
    }
  }, [topicId, discussionId, topicData, discussion, toast, navigate]);

  if (!topicData || !discussion) {
    return null;
  }

  // Determine if current user is the author (in real app, compare with user ID)
  const isAuthor = discussion.author?.id === 'current-user';
  
  // Determine if current user can mark answers as accepted
  const canAcceptAnswer = isAuthor || viewAs === 'admin' || viewAs === 'moderator';
  
  return (
    <MainLayout title={discussion.title}>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => navigate(`/discussions/${topicId}`)}
          >
            <ArrowLeft size={16} />
            <span>Voltar para {topicData.name}</span>
          </Button>
        </div>

        {/* Discussion main card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h1 className="text-xl font-bold">{discussion.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Por {discussion.author?.name}</span>
                  <span className="text-gray-400">•</span>
                  <span>{discussion.created_at}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{discussion.view_count || 0} visualizações</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {discussion.isHot && (
                  <Badge variant="destructive">Hot</Badge>
                )}
                {discussion.format && (
                  <Badge className={`${discussion.format === 'question' ? 'bg-blue-500' : 'bg-slate-500'}`}>
                    {discussion.format === 'question' ? 'Pergunta' : 'Discussão'}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleShare}>Compartilhar</DropdownMenuItem>
                    <DropdownMenuItem>Reportar</DropdownMenuItem>
                    {(viewAs === 'admin' || viewAs === 'moderator') && (
                      <>
                        <DropdownMenuItem>Fixar discussão</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Remover discussão</DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-start space-x-4 mt-2">
              <div className="hidden sm:block">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={discussion.author?.avatar} alt={discussion.author?.name} />
                  <AvatarFallback>{discussion.author?.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{discussion.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {discussion.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs flex items-center gap-1 ${likedDiscussion ? 'text-purple-600' : ''}`}
                onClick={handleLikeDiscussion}
              >
                <ThumbsUp size={14} /> {discussion.upvotes || 0} {likedDiscussion && '(votado)'}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                <MessageSquare size={14} /> {typeof discussion.replies === 'number' ? discussion.replies : (Array.isArray(discussion.replies) ? discussion.replies.length : 0)} respostas
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-xs flex items-center gap-1">
              <Share size={14} /> Compartilhar
            </Button>
          </CardFooter>
        </Card>

        {/* Replies section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Respostas ({replies.length})</h2>
          
          {replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply.id} className={`${reply.isAcceptedAnswer ? 'border-green-500 dark:border-green-700' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={reply.author?.avatar} alt={reply.author?.name} />
                          <AvatarFallback>{reply.author?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reply.author?.name}</span>
                            {reply.author?.level && (
                              <Badge variant="outline" className="text-xs h-5 px-1.5">
                                Nível {reply.author.level}
                              </Badge>
                            )}
                            {reply.isAcceptedAnswer && (
                              <Badge className="bg-green-500 text-white flex items-center gap-1">
                                <CheckCircle size={12} />
                                <span>Solução</span>
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {reply.createdAt || reply.created_at}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleShare}>Compartilhar</DropdownMenuItem>
                          <DropdownMenuItem>Reportar</DropdownMenuItem>
                          {canAcceptAnswer && discussion.format === 'question' && !reply.isAcceptedAnswer && (
                            <DropdownMenuItem onClick={() => handleAcceptAnswer(reply.id)}>
                              Marcar como solução
                            </DropdownMenuItem>
                          )}
                          {(viewAs === 'admin' || viewAs === 'moderator') && (
                            <DropdownMenuItem className="text-red-500">Remover resposta</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{reply.content}</p>
                    </div>
                    {reply.author?.xp !== undefined && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-amber-500 flex items-center">
                          <Star size={12} className="mr-0.5" />
                          {reply.author.xp} XP
                        </span>
                        <Progress value={reply.author.xp % 100} className="h-1.5 w-24" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-xs flex items-center gap-1 ${likedReplies[reply.id] ? 'text-purple-600' : ''}`}
                      onClick={() => handleLikeReply(reply.id)}
                    >
                      <ThumbsUp size={14} /> 
                      {reply.upvotes} 
                      {likedReplies[reply.id] && ' (votado)'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                      Responder
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>Seja o primeiro a responder esta discussão!</p>
            </Card>
          )}
        </div>

        {/* Reply form */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Sua Resposta</h3>
          <form onSubmit={handleSubmitReply}>
            <Textarea
              placeholder="Escreva sua resposta aqui..."
              className="min-h-[150px] mb-3"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-nortech-purple hover:bg-nortech-purple/90"
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Resposta'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscussionDetail;
