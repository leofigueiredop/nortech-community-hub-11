import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Star, 
  ThumbsUp,
  Eye,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Discussion } from '@/types/discussion';
import { useTranslation } from 'react-i18next';

interface DiscussionCardProps {
  discussion: Discussion;
  topicId?: string;
}

const DiscussionCard = ({ discussion, topicId }: DiscussionCardProps) => {
  const { t } = useTranslation('common');
  return (
    <div className={cn(
      "relative group border rounded-lg p-4 bg-card hover:border-primary/20 hover:bg-accent/50 transition-colors",
      discussion.is_featured && "border-primary/30 bg-primary/5"
    )}>
      {/* Top Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={discussion.author?.avatar || discussion.author?.avatar_url} alt={discussion.author?.name} />
            <AvatarFallback>{discussion.author?.name?.[0] || '?'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{discussion.author?.name}</span>
          <span className="text-sm text-muted-foreground">· {formatDate(discussion.created_at)}</span>
        </div>
        
        {discussion.is_featured && (
          <Badge variant="outline" className="flex items-center gap-1 border-amber-200 text-amber-600 bg-amber-50">
            <Star className="h-3 w-3" />
            <span>{t('discussions.discussionCard.featured')}</span>
          </Badge>
        )}
      </div>

      {/* Title and Content */}
      <Link to={`/discussions/${topicId || discussion.topic_id}/${discussion.id}`} className="block">
        <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
          {discussion.title}
        </h3>
        
        <p className="text-muted-foreground line-clamp-2 mb-3">
          {discussion.content || discussion.description}
        </p>
      </Link>

      {/* Bottom Stats */}
      <div className="flex items-center text-sm text-muted-foreground gap-4">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{discussion.votes || discussion.upvotes || 0}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{discussion.replies ? (typeof discussion.replies === 'number' ? discussion.replies : discussion.replies.length) : 0}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{discussion.view_count || discussion.views || 0}</span>
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          <Clock className="h-4 w-4" />
          <span>{formatDate(discussion.lastActivity || discussion.updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
