
import React from 'react';

interface AudioPlayerProps {
  url: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ url }) => {
  return (
    <audio 
      src={url}
      controls
      className="w-full"
    />
  );
};

export default AudioPlayer;
