
import React, { useState } from 'react';
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
  Lock,
  Unlock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export interface PostProps {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  title?: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
  space: string;
  type?: 'post' | 'event' | 'live' | 'content';
  isPinned?: boolean;
  isAnnouncement?: boolean;
  isPaid?: boolean;
  teaser?: string;
  tags?: string[];
  accessBadge?: 'free' | 'premium' | 'unlocked';
  showAccessBadge?: boolean;
}

const Post: React.FC<PostProps> = ({ 
  id, 
  author, 
  title, 
  content, 
  createdAt, 
  likes, 
  comments,
  space,
  type,
  isPinned,
  isAnnouncement,
  isPaid,
  teaser,
  tags,
  accessBadge = 'free',
  showAccessBadge = false
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const getTypeIcon = () => {
    switch (type) {
      case 'event':
        return <Calendar size={14} className="mr-1" />;
      case 'live':
        return <Video size={14} className="mr-1" />;
      case 'content':
        return <BookOpen size={14} className="mr-1" />;
      default:
        return null;
    }
  };
  
  const getAccessBadge = () => {
    if (!showAccessBadge) return null;
    
    switch (accessBadge) {
      case 'premium':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 ml-2 flex items-center gap-1">
            <Lock size={12} />
            Premium
          </Badge>
        );
      case 'free':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 ml-2 flex items-center gap-1">
            <Unlock size={12} />
            Free
          </Badge>
        );
      case 'unlocked':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 ml-2 flex items-center gap-1">
            <Unlock size={12} />
            Unlocked
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className={`shadow-sm ${isPinned ? 'border-l-4 border-l-purple-500' : ''}`}>
      <CardHeader className="pb-2 space-y-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-semibold">{author.name}</span>
                {author.role && (
                  <Badge variant="outline" className="ml-2 text-xs">{author.role}</Badge>
                )}
                {isPinned && (
                  <Badge variant="outline" className="ml-2 text-xs flex items-center">
                    <Pin size={10} className="mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">{createdAt}</span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{space}</span>
                {type && (
                  <>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      {getTypeIcon()}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </>
                )}
                {getAccessBadge()}
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
              <DropdownMenuItem>Save Post</DropdownMenuItem>
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <p className="whitespace-pre-line text-sm">
          {isPaid && !isAnnouncement ? teaser : content}
          {isPaid && !isAnnouncement && (
            <Button variant="link" className="text-nortech-purple p-0 h-auto">
              Unlock Premium Content
            </Button>
          )}
        </p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map(tag => (
              <Link key={tag} to={`/tag/${tag.toLowerCase()}`}>
                <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${isLiked ? 'text-purple-600' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp size={14} /> {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
            <MessageSquare size={14} /> {comments}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
          <Share size={14} /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
