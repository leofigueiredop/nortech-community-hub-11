
import React, { useRef, useState, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { Play, Pause, Volume2, Volume1, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '../contentViewerUtils';

export interface AudioPreviewProps {
  item: ContentItem;
  handleAccess: () => void;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ item, handleAccess }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  useEffect(() => {
    // Reset state when audio changes
    setIsPlaying(false);
    setCurrentTime(0);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      
      // Listen for audio events
      const setAudioData = () => {
        setDuration(audio.duration);
      };
      
      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const onEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', onEnded);
      
      // Clean up event listeners
      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [item, volume]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeChange = (newTime: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume[0];
      setVolume(newVolume[0]);
    }
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.volume > 0) {
        audio.volume = 0;
        setVolume(0);
      } else {
        audio.volume = 0.7;
        setVolume(0.7);
      }
    }
  };
  
  const restartAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audio.play();
        setIsPlaying(true);
      }
    }
  };
  
  const skipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
      setCurrentTime(audio.currentTime);
    }
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="bg-black/5 rounded-lg p-6 my-4">
      {/* Audio player */}
      <audio 
        ref={audioRef} 
        src={item.resourceUrl || ''}
        preload="metadata"
        className="hidden"
      />
      
      <div className="flex items-center mb-4">
        <img 
          src={item.thumbnail || 'https://via.placeholder.com/400x400'} 
          alt={item.title}
          className="w-16 h-16 rounded-md mr-4 object-cover"
        />
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {typeof item.author === 'string' ? item.author : item.author.name}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">Audio</Badge>
            <Badge variant="outline">{formatDuration(item.duration)}</Badge>
          </div>
        </div>
      </div>
      
      {/* Time slider */}
      <div className="mb-4">
        <Slider 
          value={[currentTime]} 
          max={duration || 100}
          step={0.1}
          onValueChange={handleTimeChange}
          className="my-2"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={restartAudio}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            size="icon" 
            variant="default"
            className="h-10 w-10 rounded-full"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={skipForward}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            <VolumeIcon />
          </Button>
          
          <Slider 
            value={[volume]} 
            max={1} 
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAccess}
          >
            Listen Full Audio
          </Button>
        </div>
      </div>
      
      {/* Preview note */}
      <p className="text-xs text-center mt-4 text-muted-foreground">
        This is a preview. Click "Listen Full Audio" to access the complete content.
      </p>
    </div>
  );
};

export default AudioPreview;
