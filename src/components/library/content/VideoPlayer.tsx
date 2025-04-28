
import React from 'react';

interface VideoPlayerProps {
  url: string;
  onProgress?: (progress: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onProgress }) => {
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const progress = (video.currentTime / video.duration) * 100;
    if (onProgress) {
      onProgress(progress);
    }
  };

  return (
    <video 
      src={url}
      controls
      className="w-full aspect-video"
      onTimeUpdate={handleTimeUpdate}
    />
  );
};

export default VideoPlayer;
