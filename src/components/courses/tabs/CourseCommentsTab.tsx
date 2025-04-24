
import React, { useState } from 'react';
import { ContentItem, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, MessageCircle, Flag, PinIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
  isPinned: boolean;
  replies: Reply[];
  type?: 'question' | 'suggestion' | 'official';
}

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  userLiked: boolean;
}

interface CourseCommentsTabProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  isDarkMode: boolean;
}

const CourseCommentsTab: React.FC<CourseCommentsTabProps> = ({
  course,
  currentLesson,
  isDarkMode
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      content: 'I found this explanation of blockchain to be really helpful. Could someone clarify how mining works in relation to transaction validation?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      likes: 5,
      userLiked: false,
      isPinned: true,
      type: 'question',
      replies: [
        {
          id: 'reply1',
          userId: 'instructor',
          userName: 'Prof. Alex Smith',
          userAvatar: 'https://i.pravatar.cc/150?img=4',
          content: 'Great question! Mining is the process where computers solve complex mathematical problems to validate transactions and add them to the blockchain. Miners are rewarded with cryptocurrency for their efforts.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          likes: 3,
          userLiked: true
        }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Michael Chen',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      content: 'I suggest adding some practical examples of blockchain applications beyond cryptocurrencies. There are so many interesting use cases in supply chain, healthcare, etc.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      likes: 2,
      userLiked: false,
      isPinned: false,
      type: 'suggestion',
      replies: []
    }
  ]);
  
  const handleSubmitComment = () => {
    if (newComment.trim() === '') return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.avatar,
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      userLiked: false,
      isPinned: false,
      replies: []
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };
  
  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim() === '') return;
    
    const reply: Reply = {
      id: Date.now().toString(),
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous User',
      userAvatar: user?.avatar,
      content: replyContent,
      timestamp: new Date(),
      likes: 0,
      userLiked: false
    };
    
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    
    setReplyContent('');
    setReplyingToId(null);
  };
  
  const toggleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
            userLiked: !comment.userLiked
          }
        : comment
    ));
  };
  
  const toggleReplyLike = (commentId: string, replyId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            replies: comment.replies.map(reply => 
              reply.id === replyId 
                ? {
                    ...reply,
                    likes: reply.userLiked ? reply.likes - 1 : reply.likes + 1,
                    userLiked: !reply.userLiked
                  }
                : reply
            )
          }
        : comment
    ));
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Discussion</h2>
      
      {/* New Comment Input */}
      <div className="mb-8">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className={`mb-3 resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
          rows={3}
        />
        <Button 
          onClick={handleSubmitComment} 
          disabled={newComment.trim() === ''}
        >
          Post Comment
        </Button>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No comments yet. Be the first to start the discussion.
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`${
                comment.isPinned ? 'border-l-4 border-l-primary pl-4' : ''
              }`}
            >
              <div 
                className={`p-4 rounded-md ${
                  isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                } border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
              >
                {/* Comment Header */}
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {comment.isPinned && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <PinIcon className="h-3 w-3 mr-1" />
                        Pinned
                      </div>
                    )}
                    {comment.type && (
                      <Badge 
                        variant="outline" 
                        className={
                          comment.type === 'question' 
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                            : comment.type === 'suggestion'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }
                      >
                        {comment.type === 'question' 
                          ? 'Question' 
                          : comment.type === 'suggestion' 
                            ? 'Suggestion' 
                            : 'Official'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Comment Content */}
                <p className="mb-4 whitespace-pre-wrap">{comment.content}</p>
                
                {/* Comment Actions */}
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleLike(comment.id)}
                    className={`flex items-center gap-1 ${
                      comment.userLiked ? 'text-primary' : ''
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingToId(comment.id)}
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Flag className="h-4 w-4" />
                    <span>Report</span>
                  </Button>
                </div>
              </div>
              
              {/* Reply Form */}
              {replyingToId === comment.id && (
                <div className="mt-3 ml-8">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className={`mb-2 resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={replyContent.trim() === ''}
                    >
                      Post Reply
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReplyingToId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-3 ml-8 space-y-3">
                  {comment.replies.map((reply) => (
                    <div 
                      key={reply.id} 
                      className={`p-3 rounded-md ${
                        isDarkMode ? 'bg-slate-800' : 'bg-white'
                      } border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.userAvatar} />
                          <AvatarFallback>{reply.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-sm">{reply.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(reply.timestamp)}
                        </div>
                      </div>
                      
                      <p className="mb-2 text-sm whitespace-pre-wrap">{reply.content}</p>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleReplyLike(comment.id, reply.id)}
                        className={`flex items-center gap-1 h-7 text-xs ${
                          reply.userLiked ? 'text-primary' : ''
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.likes}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCommentsTab;
