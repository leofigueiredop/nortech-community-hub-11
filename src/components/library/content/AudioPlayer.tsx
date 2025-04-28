
import React from 'react';

interface AudioPlayerProps {
  url: string;
  onProgress?: (progress: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, onProgress }) => {
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    const progress = (audio.currentTime / audio.duration) * 100;
    
    if (onProgress) {
      onProgress(progress);
    }
  };

  return (
    <div className="p-6 bg-card">
      <audio 
        src={url}
        controls
        className="w-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => onProgress && onProgress(100)}
      />
    </div>
  );
};

export default AudioPlayer;
