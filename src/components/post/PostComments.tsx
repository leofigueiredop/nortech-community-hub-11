import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/api/ApiClient';
import { PostComment } from '@/types/post';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PostCommentsProps {
  postId: string;
  isOpen: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId, isOpen }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
    }
  }, [postId, isOpen]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await api.posts.getComments(postId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to comment',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await api.posts.addComment(postId, {
        content: comment,
        author_id: user.id,
      });

      if (newComment) {
        setComments(prev => [newComment, ...prev]);
        setComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <MessageSquare size={18} />
        Comments ({comments.length})
      </h3>

      {/* Comment input */}
      <div className="flex gap-2 mb-6">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profile?.avatar_url} alt={user?.profile?.full_name} />
          <AvatarFallback>{user?.profile?.full_name?.charAt(0) || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="self-end">
            <Button 
              onClick={handleSubmitComment} 
              disabled={!comment.trim() || submitting}
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
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-purple-600" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((commentItem) => (
            <div key={commentItem.id} className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={commentItem.author?.avatar_url} alt={commentItem.author?.name} />
                <AvatarFallback>{commentItem.author?.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{commentItem.author?.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(commentItem.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-line">{commentItem.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default PostComments; 