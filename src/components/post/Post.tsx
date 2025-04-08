
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal, Flag } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export interface PostProps {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  title?: string;
  createdAt: string;
  likes: number;
  comments: number;
  space: string;
  isPinned?: boolean;
  isAnnouncement?: boolean;
}

const Post: React.FC<PostProps> = ({
  id,
  author,
  content,
  title,
  createdAt,
  likes,
  comments,
  space,
  isPinned,
  isAnnouncement
}) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to this post.",
    });
    
    setNewComment('');
  };

  return (
    <Card className="mb-4 border-gray-200 dark:border-gray-800">
      <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-base">{author.name}</span>
              {author.role && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {author.role}
                </span>
              )}
              {isPinned && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  Pinned
                </span>
              )}
              {isAnnouncement && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full">
                  Announcement
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span>{createdAt}</span>
              <span className="mx-1">•</span>
              <span>{space}</span>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem className="cursor-pointer">
              Save post
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="whitespace-pre-wrap">{content}</div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {likeCount} likes • {comments} comments
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full pt-3 border-t mt-3 border-gray-200 dark:border-gray-800">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 ${liked ? 'text-blue-600 dark:text-blue-400' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Like
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comment
          </Button>
          
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-4 w-full">
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    className="bg-nortech-purple hover:bg-nortech-purple/90"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Post;
