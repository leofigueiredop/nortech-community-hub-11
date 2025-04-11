
import React, { useState, useRef, useEffect } from 'react';
import { ContentItem } from '@/types/library';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Volume1,
  VolumeX 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AudioPreviewProps {
  item: ContentItem;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Format time from seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };

  // Render author avatar/image
  const renderAuthorAvatar = () => {
    if (typeof item.author === 'string') {
      return (
        <Avatar className="h-16 w-16">
          <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    } else {
      return (
        <Avatar className="h-16 w-16">
          <AvatarImage src={item.author.avatar} alt={item.author.name} />
          <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
      );
    }
  };

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <audio ref={audioRef} src={item.resourceUrl} preload="metadata" />
      
      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Album art or podcast cover */}
        <div className="flex-shrink-0">
          {item.thumbnail ? (
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
            />
          ) : (
            renderAuthorAvatar()
          )}
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex flex-col items-center md:items-start space-y-4 w-full">
            {/* Title and author */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {typeof item.author === 'string' ? item.author : item.author.name}
              </p>
            </div>
            
            {/* Time slider */}
            <div className="w-full space-y-2">
              <Slider 
                value={[currentTime]} 
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={skipBackward}
                className="h-8 w-8"
              >
                <SkipBack size={16} />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={skipForward}
                className="h-8 w-8"
              >
                <SkipForward size={16} />
              </Button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center space-x-2 w-full max-w-[200px]">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              >
                {getVolumeIcon()}
              </Button>
              <Slider 
                value={[volume]} 
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPreview;
