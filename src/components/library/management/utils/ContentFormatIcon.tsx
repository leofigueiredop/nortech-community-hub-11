
import React from 'react';
import { FileText, FileVideo, FileAudio, Link, Image, BookOpen, Youtube, Video, File } from 'lucide-react';

interface ContentFormatIconProps {
  format: string;
  size?: number;
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ format, size = 16 }) => {
  switch (format.toLowerCase()) {
    case 'video':
      return <FileVideo size={size} />;
    case 'youtube':
    case 'vimeo':
      return <Video size={size} />;
    case 'pdf':
      return <File size={size} />;
    case 'gdoc':
    case 'text':
      return <FileText size={size} />;
    case 'audio':
      return <FileAudio size={size} />;
    case 'image':
      return <Image size={size} />;
    case 'course':
      return <BookOpen size={size} />;
    case 'link':
    case 'gdrive':
    default:
      return <Link size={size} />;
  }
};
