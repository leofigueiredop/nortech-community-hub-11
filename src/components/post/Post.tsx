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
  ExternalLink,
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
import PostComments from './PostComments';
import { UserTier, shouldBlurContent, SPACE_ACCESS } from '@/types/subscription';

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
  spaceTier?: UserTier;
  type?: 'post' | 'event' | 'live' | 'content';
  isPinned?: boolean;
  isAnnouncement?: boolean;
  isPaid?: boolean;
  teaser?: string;
  tags?: string[];
  accessBadge?: 'free' | 'premium' | 'unlocked';
  showAccessBadge?: boolean;
  onCommentClick?: (postId: string) => void;
  tier?: 'free' | 'premium' | 'mentor';
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
  spaceTier,
  type,
  isPinned,
  isAnnouncement,
  isPaid,
  teaser,
  tags,
  accessBadge = 'free',
  showAccessBadge = false,
  onCommentClick,
  tier
}) => {
  // Ensure likes and comments are always numbers
  const safeLikes = typeof likes === 'number' ? likes : 0;
  const safeComments = typeof comments === 'number' ? comments : 0;
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(safeLikes);
  const [premiumInteractions, setPremiumInteractions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch the user's like status when the component mounts
  useEffect(() => {
    if (!user || !id) return;
    
    const fetchUserLikeStatus = async () => {
      try {
        const userReaction = await api.posts.getUserReaction(id, user.id);
        setIsLiked(!!userReaction);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    
    fetchUserLikeStatus();
  }, [id, user]);
  
  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLiked) {
        // Remove the like
        await api.posts.removeReaction(id, user.id);
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        // Add the like
        await api.posts.addReaction(id, user.id, 'like');
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        
        if (isPaid && accessBadge === 'premium') {
          trackPremiumInteraction();
        }
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Failed to update reaction",
        description: "An error occurred while updating your reaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(id);
    }
    setShowComments(!showComments);
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
    const userTier = user?.tier || 'free';
    const postSpaceTier = spaceTier || SPACE_ACCESS[space]?.requiredTier || 'free';
    const postTier = tier || 'free';
    
    // Check if content should be blurred based on either space tier or post tier
    const shouldBlurBySpace = shouldBlurContent(postSpaceTier, userTier);
    const shouldBlurByTier = shouldBlurContent(postTier as UserTier, userTier);
    const shouldBlur = shouldBlurBySpace || shouldBlurByTier;
    
    if (isAnnouncement) {
      return <p className="whitespace-pre-line text-sm">{content}</p>;
    }
    
    // Check if content should be blurred based on space tier vs user tier OR post tier vs user tier
    if (shouldBlur) {
      const effectiveTier = shouldBlurByTier ? postTier : postSpaceTier;
      const tierNames = {
        premium: 'Premium',
        mentor: 'Mentor',
        free: 'Free'
      };
      
      return (
        <>
          {/* Show teaser if available */}
          {teaser && <p className="whitespace-pre-line text-sm mb-4">{teaser}</p>}
          
          {/* Blurred content preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900 z-10 pointer-events-none"></div>
            <div className="blur-sm select-none pointer-events-none">
              <p className="whitespace-pre-line text-sm mb-2">
                {content}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center mt-6 z-20 relative">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-lg text-center max-w-md">
                <Lock size={24} className="mx-auto mb-3 text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {tierNames[effectiveTier as keyof typeof tierNames]} Content
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This content is available exclusively for {tierNames[effectiveTier as keyof typeof tierNames]?.toLowerCase()} members
                </p>
                <Button 
                  onClick={handleSubscribe}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Lock size={16} className="mr-2" />
                  Upgrade to {tierNames[effectiveTier as keyof typeof tierNames]}
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    // Legacy premium content check (for backward compatibility)
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
        
        {/* Comments section */}
        <PostComments postId={id} isOpen={showComments} />
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${isLiked ? 'text-purple-600' : ''}`}
            onClick={handleLike}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin mr-1" />
            ) : (
              <ThumbsUp size={14} className={isLiked ? 'fill-purple-600' : ''} />
            )}
            {likeCount}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs flex items-center gap-1 ${showComments ? 'text-purple-600' : ''}`}
            onClick={handleCommentClick}
          >
            <MessageSquare size={14} className={showComments ? 'fill-purple-600' : ''} /> {safeComments}
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
