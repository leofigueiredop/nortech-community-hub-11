
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContentItem } from '@/types/library';
import { Share2, Bookmark, Flag, ArrowRight, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CourseViewerModalProps {
  item: ContentItem;
  onClose: () => void;
}

const CourseViewerModal: React.FC<CourseViewerModalProps> = ({ item, onClose }) => {
  const navigate = useNavigate();

  const handleStartCourse = () => {
    // Close the modal first
    onClose();
    // Then navigate to the course page
    navigate(`/course/${item.id}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The content link has been copied to your clipboard.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Content saved",
      description: "The content has been added to your saved items.",
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback. We'll review this content.",
    });
  };

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden">
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Premium badge */}
          {item.accessLevel === 'premium' && (
            <div className="absolute top-2 left-2">
              <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Lock className="h-3 w-3" /> Premium
              </span>
            </div>
          )}
          
          {/* Title and details */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
            <p className="text-slate-200 text-sm line-clamp-2 mb-4">{item.description}</p>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleStartCourse}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90"
              >
                Start Course <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="icon" onClick={handleShare} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleSave} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleReport} className="bg-black/40 border-white/30 text-white hover:bg-black/60">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <h4 className="font-medium">What you'll learn:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Build modern React applications from scratch</li>
              <li>• Master React hooks and state management</li>
              <li>• Create reusable components and custom hooks</li>
              <li>• Implement responsive designs with Tailwind CSS</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseViewerModal;
