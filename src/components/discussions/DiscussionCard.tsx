import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  MessageCircleIcon,
  EyeIcon,
  UserIcon,
  ThumbsUpIcon,
  ThumbsUpFilledIcon,
  ReplyIcon,
  ShareIcon,
  TrophyIcon,
  PinIcon,
  Loader2Icon
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { Discussion, DiscussionReply } from '@/types/discussion';

interface DiscussionCardProps {
  discussion: Discussion;
  isDetailView?: boolean;
  onReplyAdded?: () => void;
}

// Mock API calls (replace with actual API calls)
const likeDiscussion = (discussionId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const unlikeDiscussion = (discussionId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

const createReply = (reply: Partial<DiscussionReply>) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (reply.content && reply.content.length > 0) {
        resolve(reply);
      } else {
        reject(new Error("Reply content is required"));
      }
    }, 500);
  });
};

export default function DiscussionCard({ 
  discussion,
  isDetailView = false,
  onReplyAdded
}: DiscussionCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(discussion.votes || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showReplyField, setShowReplyField] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const { toast } = useToast();

  // Handle compatibility with different properties
  const participants = discussion.participants || [];
  const isPinned = discussion.isPinned || false;
  const viewCount = discussion.viewCount || discussion.view_count || 0;
  const author = discussion.author || {
    id: '',
    name: 'Unknown User',
    avatar_url: '',
    level: 1,
    xp: 0
  };
  
  const handleLike = async () => {
    setLikeLoading(true);
    try {
      if (liked) {
        await unlikeDiscussion(discussion.id);
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await likeDiscussion(discussion.id);
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error: any) {
      toast({
        title: "Error liking discussion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLikeLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast({
        title: "Missing reply content",
        description: "Please write something before posting your reply",
        variant: "destructive",
      });
      return;
    }
    
    setReplyLoading(true);
    try {
      const newReply: Partial<DiscussionReply> = {
        discussion_id: discussion.id,
        content: replyContent,
        user_id: 'current-user-id', // Replace with actual user ID
        author: {
          id: 'current-user-id', // Replace with actual user ID
          name: 'Current User', // Replace with actual user name
          avatar_url: 'https://example.com/avatar.jpg', // Replace with actual user avatar
          level: 1,
          xp: 0
        }
      };
      
      await createReply(newReply);
      toast({
        title: "Reply posted",
        description: "Your reply has been added to the discussion",
      });
      setReplyContent('');
      setShowReplyField(false);
      onReplyAdded?.();
    } catch (error: any) {
      toast({
        title: "Error posting reply",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <Card className={cn(
      "w-full transition-all duration-200",
      isDetailView ? "border-none shadow-none" : "hover:border-primary/20"
    )}>
      <CardContent className={cn(
        "p-4 md:p-6",
        !isDetailView && "hover:bg-secondary/5"
      )}>
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={author.avatar_url} alt={author.name} />
              <AvatarFallback>
                {author.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-foreground mr-2">
                  {author.name}
                </h3>
                {isPinned && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 text-[10px] h-5">
                    <PinIcon className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <p>Level {author.level || 1}</p>
                <Separator className="mx-2 h-3 w-px bg-muted-foreground/30" orientation="vertical" />
                <p>{formatDate(discussion.created_at || discussion.createdAt || new Date().toISOString())}</p>
              </div>
            </div>
          </div>

          {/* Actions button (example) */}
          {isDetailView && (
            <div>
              {/* Add action buttons here if needed */}
            </div>
          )}
        </div>

        {/* Content section */}
        <Link to={`/discussions/${discussion.id}`} className={cn(
          "block mb-4",
          isDetailView && "pointer-events-none"
        )}>
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            {discussion.title}
          </h2>
          <div className={cn(
            "text-muted-foreground",
            !isDetailView && "line-clamp-2"
          )}>
            {isDetailView ? (
              <div dangerouslySetInnerHTML={{ __html: discussion.content }} />
            ) : (
              <>
                {discussion.content.replace(/(<([^>]+)>)/gi, '').substring(0, 120)}
                {discussion.content.length > 120 && "..."}
              </>
            )}
          </div>
        </Link>

        {/* Tags and metrics */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {discussion.format && (
              <Badge variant={discussion.format === 'question' ? 'default' : 'secondary'} className="text-xs capitalize">
                {discussion.format}
              </Badge>
            )}
            {discussion.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs bg-secondary/20">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex text-xs text-muted-foreground">
            <div className="flex items-center mr-4">
              <MessageCircleIcon className="h-3.5 w-3.5 mr-1" />
              <span>{discussion.replies?.length || 0} replies</span>
            </div>
            <div className="flex items-center mr-4">
              <EyeIcon className="h-3.5 w-3.5 mr-1" />
              <span>{viewCount} views</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-3.5 w-3.5 mr-1" />
              <span>{participants.length || 0} participants</span>
            </div>
          </div>
        </div>

        {/* Actions section */}
        <div className="flex justify-between items-center border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center text-xs h-8 px-3">
              {likeLoading ? (
                <Loader2Icon className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : liked ? (
                <ThumbsUpFilledIcon className="h-3.5 w-3.5 mr-2 text-primary" />
              ) : (
                <ThumbsUpIcon className="h-3.5 w-3.5 mr-2" />
              )}
              <span>{likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-xs h-8 px-3"
              onClick={() => setShowReplyField(prev => !prev)}
            >
              <ReplyIcon className="h-3.5 w-3.5 mr-2" />
              <span>Reply</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center text-xs h-8 px-3">
              <ShareIcon className="h-3.5 w-3.5 mr-2" />
              <span>Share</span>
            </Button>
          </div>
          
          <div>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-8"
              disabled={!discussion.author?.xp}
            >
              <TrophyIcon className="h-3.5 w-3.5 mr-2 text-amber-500" />
              <span>{discussion.author?.xp || 0} XP</span>
            </Button>
          </div>
        </div>

        {/* Reply field */}
        {showReplyField && (
          <div className="mt-4 border-t border-border pt-4">
            <form onSubmit={handleReply} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea 
                  id="reply"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="w-full resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setShowReplyField(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={replyLoading || !replyContent.trim()}
                >
                  {replyLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Reply'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
