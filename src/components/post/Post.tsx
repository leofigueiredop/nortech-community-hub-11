
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
  Lock,
  Unlock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

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
  const [premiumInteractions, setPremiumInteractions] = useState(0);
  const { toast } = useToast();
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
      if (isPaid && accessBadge === 'premium') {
        trackPremiumInteraction();
      }
    }
    setIsLiked(!isLiked);
  };

  const trackPremiumInteraction = () => {
    const interactions = localStorage.getItem('premiumInteractions') 
      ? parseInt(localStorage.getItem('premiumInteractions') || '0') 
      : 0;
    
    const newCount = interactions + 1;
    localStorage.setItem('premiumInteractions', newCount.toString());
    setPremiumInteractions(newCount);
    
    // Show upgrade prompt after 3 interactions with premium content
    if (newCount >= 3 && accessBadge === 'premium') {
      toast({
        title: "Enjoying premium content?",
        description: "Upgrade your subscription to access all premium content without restrictions.",
        action: (
          <Button 
            onClick={() => window.location.href = '/settings/subscriptions'} 
            variant="default" 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Upgrade Now
          </Button>
        ),
      });
    }
  };
  
  useEffect(() => {
    const interactions = localStorage.getItem('premiumInteractions');
    if (interactions) {
      setPremiumInteractions(parseInt(interactions));
    }
  }, []);
  
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

  const handleSubscribe = () => {
    window.location.href = '/settings/subscriptions';
  };
  
  const renderContent = () => {
    if (isAnnouncement) {
      return <p className="whitespace-pre-line text-sm">{content}</p>;
    }
    
    if (isPaid && accessBadge === 'premium') {
      return (
        <>
          {/* Show title and teaser for premium content */}
          {teaser && <p className="whitespace-pre-line text-sm mb-4">{teaser}</p>}
          
          {/* Blurred content preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900 z-10"></div>
            <p className="whitespace-pre-line text-sm blur-sm select-none mb-2">
              {content}
            </p>
            <div className="flex flex-col items-center justify-center mt-4 z-20 relative">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-3">
                This content is available exclusively for premium subscribers
              </p>
              <Button 
                onClick={handleSubscribe}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Lock size={16} className="mr-2" />
                Subscribe to Unlock
              </Button>
            </div>
          </div>
        </>
      );
    }
    
    return <p className="whitespace-pre-line text-sm">{content}</p>;
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
        {renderContent()}
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
        
        {accessBadge === 'free' && isPaid && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm">
            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
              <ExternalLink size={14} className="mr-2 flex-shrink-0" />
              Want access to the full guide? It's in the <Link to="/feed?segment=premium" className="font-medium underline ml-1">Premium Zone</Link>.
            </p>
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
