import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';
import { ContentItem, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import PremiumContentOverlay from '@/components/library/PremiumContentOverlay';
import { formatDuration } from '@/components/library/viewer/contentViewerUtils';
import { useAuth } from '@/context/AuthContext';

interface CoursePlayerProps {
  lesson: CourseModuleItem | null;
  course: ContentItem;
  onProgress: (progress: number) => void;
  isDarkMode: boolean;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  lesson,
  course,
  onProgress,
  isDarkMode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (course.access_level === 'premium' && user?.access_level !== 'premium') {
      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
  }, [course, user]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      if (progressPercent > 0) {
        onProgress(Math.round(progressPercent));
      }
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onProgress(100);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress]);
  
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };
  
  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.muted = false;
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };
  
  const handleSubscribe = () => {
    console.log('Subscribe clicked');
  };
  
  const handleUsePoints = () => {
    console.log('Use points clicked');
    setHasAccess(true);
  };
  
  const renderContentByType = () => {
    if (!lesson) {
      return (
        <div className="flex items-center justify-center h-[400px] bg-slate-800">
          <p>Select a lesson to begin</p>
        </div>
      );
    }
    
    if (!hasAccess) {
      return (
        <div className="relative w-full h-[400px] bg-slate-800">
          <img 
            src={course.thumbnail || '/placeholder.svg'} 
            alt={course.title} 
            className="w-full h-full object-cover opacity-40"
          />
          <PremiumContentOverlay 
            pointsEnabled={!!course.pointsEnabled}
            pointsValue={course.pointsValue || 0}
            freeAccessLeft={0}
            onSubscribe={handleSubscribe}
            onUsePoints={handleUsePoints}
          />
        </div>
      );
    }
    
    const lessonType = (lesson.type || '').toLowerCase();
    
    if (lessonType === 'video') {
      return (
        <div className={`relative aspect-video w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <video
            ref={videoRef}
            className="w-full h-full"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster={course.thumbnail}
            preload="metadata"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="mb-4">
              <Slider
                value={[duration ? (currentTime / duration) * 100 : 0]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="hidden sm:block w-24">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="text-xs text-white">
                  {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (lessonType === 'pdf') {
      return (
        <div className={`flex items-center justify-center h-[400px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <iframe 
            src={lesson.content ? `/api/pdf/${lesson.content}` : '/placeholder.svg'} 
            className="w-full h-full" 
            title="PDF Viewer"
          />
        </div>
      );
    } else if (lessonType === 'quiz') {
      return (
        <div className={`flex flex-col items-center justify-center h-[400px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} p-6`}>
          <h2 className="text-xl font-bold mb-4">Quiz: {lesson.title}</h2>
          <p className="text-center mb-6">
            Test your knowledge about this module with our interactive quiz.
          </p>
          <Button>Start Quiz</Button>
        </div>
      );
    } else {
      return (
        <div className={`flex items-center justify-center h-[400px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} p-6`}>
          <div className="prose dark:prose-invert max-w-3xl">
            <h2>{lesson.title}</h2>
            <p>This lesson contains text content that you can read at your own pace.</p>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div>
      {renderContentByType()}
    </div>
  );
};

export default CoursePlayer;
