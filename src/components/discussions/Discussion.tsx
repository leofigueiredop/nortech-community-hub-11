import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  ThumbsUp, 
  Share, 
  MoreHorizontal, 
  Calendar,
  Video,
  BookOpen,
  Pin,
  CheckCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { Discussion as DiscussionType } from '@/types/discussion';
import DiscussionReplies from './DiscussionReplies';
import { formatDistanceToNow } from 'date-fns';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';

export interface DiscussionProps {
  discussion: DiscussionType;
  isDetailView?: boolean;
  topicName?: string;
}

const Discussion: React.FC<DiscussionProps> = ({ 
  discussion,
  isDetailView = false,
  topicName
}) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(discussion.upvotes || 0);
  const [replyCount, setReplyCount] = useState(
    typeof discussion.replies === 'number' 
      ? discussion.replies 
      : Array.isArray(discussion.replies) 
        ? discussion.replies.length 
        : 0
  );
  const [upvoteLoading, setUpvoteLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(isDetailView);
  const { toast } = useToast();
  const { user } = useAuth();
  const { upvoteDiscussion, checkUpvoted } = useRealDiscussions();
  
  // Update counts when discussion prop changes
  useEffect(() => {
    setUpvoteCount(discussion.upvotes || 0);
    setReplyCount(
      typeof discussion.replies === 'number'
        ? discussion.replies
        : Array.isArray(discussion.replies)
          ? discussion.replies.length
          : 0
    );
  }, [discussion]);
  
  // Check if the current user has upvoted this discussion
  useEffect(() => {
    if (user) {
      const checkUserUpvote = async () => {
        try {
          const hasUpvoted = await checkUpvoted(discussion.id);
          setIsUpvoted(hasUpvoted);
        } catch (error) {
          console.error('Error checking upvote status:', error);
        }
      };
      
      checkUserUpvote();
    }
  }, [user, discussion.id, checkUpvoted]);
  
  const handleUpvote = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote discussions",
        variant: "destructive"
      });
      return;
    }
    
    setUpvoteLoading(true);
    
    try {
      // Toggle local upvote state optimistically
      const newUpvoteState = !isUpvoted;
      setIsUpvoted(newUpvoteState);
      setUpvoteCount(prev => prev + (newUpvoteState ? 1 : -1));
      
      // Call API to update server
      const success = await upvoteDiscussion(discussion.id, newUpvoteState);
      
      if (!success) {
        // Revert state if API call failed
        setIsUpvoted(!newUpvoteState);
        setUpvoteCount(prev => prev + (newUpvoteState ? -1 : 1));
        
        toast({
          title: "Failed to update vote",
          description: "An error occurred while updating your vote",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating upvote:', error);
      
      // Revert state in case of error
      setIsUpvoted(prev => !prev);
      setUpvoteCount(prev => prev + (isUpvoted ? 1 : -1));
      
      toast({
        title: "Failed to update vote",
        description: "An error occurred while updating your vote",
        variant: "destructive"
      });
    } finally {
      setUpvoteLoading(false);
    }
  };

  const handleReplyClick = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyCountChange = (count: number) => {
    setReplyCount(count);
  };
  
  const getFormatBadge = () => {
    switch (discussion.format) {
      case 'question':
        return (
          <Badge variant="outline" className="text-xs">
            Question
          </Badge>
        );
      case 'announcement':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            Announcement
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className={`shadow-sm ${discussion.is_pinned ? 'border-l-4 border-l-purple-500' : ''}`}>
      <CardHeader className="pb-2 space-y-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src={discussion.author?.avatar || discussion.author?.avatar_url} alt={discussion.author?.name} />
              <AvatarFallback>{discussion.author?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-semibold">{discussion.author?.name}</span>
                {getFormatBadge()}
                {discussion.is_pinned && (
                  <Badge variant="outline" className="ml-2 text-xs flex items-center">
                    <Pin size={10} className="mr-1" />
                    Pinned
                  </Badge>
                )}
                {discussion.isAnswered && (
                  <Badge variant="outline" className="ml-2 text-xs flex items-center bg-green-50 text-green-700 border-green-200">
                    <CheckCircle size={10} className="mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                </span>
                {topicName && (
                  <>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{topicName}</span>
                  </>
                )}
                {discussion.view_count !== undefined && (
                  <>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Eye size={10} className="mr-1" />
                      {discussion.view_count} views
                    </span>
                  </>
                )}
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
              <DropdownMenuItem>Save Discussion</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {!isDetailView ? (
          <Link to={`/discussions/topic/${discussion.topic_id}/discussion/${discussion.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-purple-600 transition-colors">
              {discussion.title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-lg font-semibold mb-2">{discussion.title}</h3>
        )}
        
        <div className="whitespace-pre-line text-sm">
          {discussion.content || discussion.description}
        </div>
        
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {discussion.tags.map(tag => (
              <Link key={tag} to={`/discussions/tag/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        
        {/* Replies section (only shown when expanded) */}
        {showReplies && (
          <DiscussionReplies 
            discussionId={discussion.id} 
            isOpen={showReplies}
            onReplyCountChange={handleReplyCountChange}
          />
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${isUpvoted ? 'text-purple-600' : ''}`}
            onClick={handleUpvote}
            disabled={upvoteLoading}
          >
            {upvoteLoading ? (
              <Loader2 size={14} className="animate-spin mr-1" />
            ) : (
              <ThumbsUp size={14} className={isUpvoted ? 'fill-purple-600' : ''} />
            )}
            {upvoteCount}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${showReplies ? 'text-purple-600' : ''}`}
            onClick={handleReplyClick}
          >
            <MessageSquare size={14} className={showReplies ? 'fill-purple-600' : ''} /> {replyCount}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
          <Share size={14} /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Discussion; 