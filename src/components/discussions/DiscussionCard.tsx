
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Eye, Star, CornerDownRight, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Discussion } from '@/types/discussion';
import { Progress } from '@/components/ui/progress';

interface DiscussionCardProps {
  discussion: Discussion;
  topicId: string;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion, topicId }) => {
  const {
    id,
    title,
    description,
    author,
    lastActivity,
    replies,
    participants,
    tags,
    isHot,
    isPinned,
    isAnswered,
    viewCount,
    upvotes,
    format
  } = discussion;

  return (
    <Card className={`mb-4 hover:border-nortech-purple/30 transition-colors ${isPinned ? 'border-l-4 border-l-purple-500' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{title}</CardTitle>
                {isHot && (
                  <Badge variant="destructive" className="ml-auto">Hot</Badge>
                )}
                {isAnswered && (
                  <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 ml-auto flex items-center gap-1">
                    <CheckCircle size={12} />
                    <span>Resolvido</span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
                <span>Por {author.name}</span>
                {author.level && (
                  <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0 h-4">Nível {author.level}</Badge>
                )}
                <span className="mx-1">•</span>
                <span>{lastActivity}</span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {format && (
            <Badge className={`text-xs ${format === 'question' ? 'bg-blue-500' : format === 'announcement' ? 'bg-amber-500' : 'bg-slate-500'}`}>
              {format === 'question' ? 'Pergunta' : format === 'announcement' ? 'Anúncio' : 'Discussão'}
            </Badge>
          )}
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare size={14} /> {replies} respostas
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {viewCount || 0}
          </span>
          {upvotes !== undefined && (
            <span className="flex items-center gap-1">
              <ThumbsUp size={14} /> {upvotes}
            </span>
          )}
        </div>
        <Link to={`/discussions/${topicId}/${id}`}>
          <Button variant="ghost" size="sm">Ver Discussão</Button>
        </Link>
      </CardFooter>

      {author.xp !== undefined && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-amber-500 flex items-center gap-1">
              <Star size={12} />
              <span>{author.xp} XP</span>
            </span>
            <Progress value={author.xp % 100} className="h-1.5 flex-1" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default DiscussionCard;
