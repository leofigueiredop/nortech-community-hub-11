
import React from 'react';
import { FileText, FileVideo, FileAudio, Link, Image, BookOpen, Youtube, Video, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentFormatIconProps {
  format: string;
  size?: number;
  className?: string; // Add className prop to the interface
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ format, size = 16, className }) => {
  switch (format.toLowerCase()) {
    case 'video':
      return <FileVideo size={size} className={className} />;
    case 'youtube':
    case 'vimeo':
      return <Video size={size} className={className} />;
    case 'pdf':
      return <File size={size} className={className} />;
    case 'gdoc':
    case 'text':
      return <FileText size={size} className={className} />;
    case 'audio':
      return <FileAudio size={size} className={className} />;
    case 'image':
      return <Image size={size} className={className} />;
    case 'course':
      return <BookOpen size={size} className={className} />;
    case 'link':
    case 'gdrive':
    default:
      return <Link size={size} className={className} />;
  }
};
