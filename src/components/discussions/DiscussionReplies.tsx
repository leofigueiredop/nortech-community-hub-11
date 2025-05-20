import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/ApiClient';
import { DiscussionReply } from '@/types/discussion';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import { cn } from '@/lib/utils';

interface DiscussionRepliesProps {
  discussionId: string;
  isOpen?: boolean;
  onReplyCountChange?: (count: number) => void;
}

const DiscussionReplies: React.FC<DiscussionRepliesProps> = ({ 
  discussionId, 
  isOpen = true,
  onReplyCountChange
}) => {
  const [content, setContent] = useState('');
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addReply, markReplyAsSolution } = useRealDiscussions();

  useEffect(() => {
    if (isOpen && discussionId) {
      fetchReplies();
    }
  }, [discussionId, isOpen]);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const discussion = await api.discussions.getDiscussion(discussionId);
      if (discussion && Array.isArray(discussion.replies)) {
        setReplies(discussion.replies as DiscussionReply[]);
        onReplyCountChange?.(discussion.replies.length);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load replies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to reply',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const newReply = await addReply(discussionId, {
        content: content,
        user_id: user.id,
      });

      if (newReply) {
        setReplies(prev => [newReply, ...prev]);
        setContent('');
        onReplyCountChange?.(replies.length + 1);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsSolution = async (replyId: string) => {
    try {
      const updatedReply = await markReplyAsSolution(replyId);
      if (updatedReply) {
        // Update the local state to reflect the change
        setReplies(prev => 
          prev.map(reply => ({
            ...reply,
            is_solution: reply.id === replyId
          }))
        );
        
        toast({
          title: 'Solution Marked',
          description: 'Reply has been marked as the solution',
        });
      }
    } catch (error) {
      console.error('Error marking solution:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark solution',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <MessageSquare size={18} />
        Replies ({replies.length})
      </h3>

      {/* Reply input */}
      <div className="flex gap-2 mb-6">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profile?.avatar_url} alt={user?.profile?.full_name} />
          <AvatarFallback>{user?.profile?.full_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            placeholder="Write a reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="self-end">
            <Button 
              onClick={handleSubmitReply} 
              disabled={!content.trim() || submitting}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={14} className="mr-2" />
                  Post Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Replies list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
      ) : replies.length > 0 ? (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={reply.author?.avatar} alt={reply.author?.name} />
                <AvatarFallback>{reply.author?.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className={cn(
                  "rounded-lg p-3",
                  reply.is_solution 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800" 
                    : "bg-gray-100 dark:bg-gray-800"
                )}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-sm">{reply.author?.name}</span>
                      {reply.is_solution && (
                        <span className="ml-2 inline-flex items-center text-xs text-green-600 dark:text-green-400">
                          <CheckCircle2 size={12} className="mr-1" />
                          Solution
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-line">{reply.content}</p>
                </div>
                
                {/* Only show if user is author of the discussion or admin/moderator */}
                {!reply.is_solution && user && (
                  <div className="mt-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => handleMarkAsSolution(reply.id)}
                    >
                      <CheckCircle2 size={12} className="mr-1" />
                      Mark as Solution
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No replies yet. Be the first to reply!
        </div>
      )}
    </div>
  );
};

export default DiscussionReplies; 