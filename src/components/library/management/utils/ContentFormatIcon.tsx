
import React from 'react';
import { FileText, FileVideo, FileAudio, Link, Image } from 'lucide-react';

interface ContentFormatIconProps {
  format: string;
  size?: number;
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ format, size = 16 }) => {
  switch (format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return <FileVideo size={size} />;
    case 'pdf':
    case 'gdoc':
    case 'text':
      return <FileText size={size} />;
    case 'audio':
      return <FileAudio size={size} />;
    case 'image':
      return <Image size={size} />;
    case 'link':
    case 'gdrive':
    default:
      return <Link size={size} />;
  }
};
