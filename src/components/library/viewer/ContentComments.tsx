import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export interface ContentCommentsProps {
  itemId: string;
}

const ContentComments: React.FC<ContentCommentsProps> = ({ itemId }) => {
  const [comment, setComment] = useState('');
  
  // Mock comments data
  const comments = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://placehold.co/40'
      },
      text: 'This was really helpful! I especially liked the section on performance optimization.',
      date: '2 days ago',
    },
    {
      id: '2',
      user: {
        name: 'Mike Thompson',
        avatar: 'https://placehold.co/40'
      },
      text: 'Great content! Would love to see a follow-up on advanced techniques.',
      date: '1 week ago',
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('Submitting comment for item', itemId, ':', comment);
      // Here you would typically send the comment to an API
      setComment('');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://placehold.co/40" alt="Your avatar" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea 
            placeholder="Add a comment..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!comment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      </form>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentComments;
