
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  date: Date;
}

interface ContentCommentsProps {
  contentId: string;
}

const ContentComments: React.FC<ContentCommentsProps> = ({ contentId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      text: 'This was incredibly helpful! I especially liked the section on implementation.',
      date: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: '2',
      author: {
        name: 'Taylor Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      text: 'Great resource. Would love to see more examples like this.',
      date: new Date(Date.now() - 3600000), // 1 hour ago
    },
  ]);
  
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would be an API call
    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      text: newComment,
      date: new Date(),
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    
    toast({
      title: 'Comment added',
      description: 'Your comment has been added successfully.',
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSecs < 60) return 'just now';
    if (diffInMins === 1) return '1 minute ago';
    if (diffInMins < 60) return `${diffInMins} minutes ago`;
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return 'yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Comments ({comments.length})</h3>
      
      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">{comment.author.name}</p>
                <span className="text-xs text-muted-foreground">{formatDate(comment.date)}</span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Separator />
      
      <div className="flex gap-2">
        <Input 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
        />
        <Button onClick={handleSubmitComment} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContentComments;
