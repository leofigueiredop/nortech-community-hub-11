
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Headphones, ChevronRight, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ 
  item, 
  onContentView,
  handleAccess
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-background border rounded-lg p-4 mb-6 flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
        <Headphones className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center mb-3">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.author || 'Unknown artist'}</p>
      </div>
      <div className="w-full mb-2">
        <Progress value={30} className="h-1" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1:30</span>
          <span>5:00</span>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5 rotate-180" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-10 h-10"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <div className="h-3 w-3 bg-primary"></div>
          ) : (
            <PlayCircle className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AudioPreview;
