
import React from 'react';
import { Film, FileText, Link, Music, Image, FileBox, BookOpen, File } from 'lucide-react';

interface ContentFormatIconProps {
  format: string;
  size?: number;
  className?: string;
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ 
  format, 
  size = 16, 
  className = '' 
}) => {
  switch (format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return <Film size={size} className={className} />;
    case 'pdf':
    case 'text':
      return <FileText size={size} className={className} />;
    case 'link':
    case 'url':
      return <Link size={size} className={className} />;
    case 'audio':
      return <Music size={size} className={className} />;
    case 'image':
      return <Image size={size} className={className} />;
    case 'gdoc':
      return <FileBox size={size} className={className} />;
    case 'course':
      return <BookOpen size={size} className={className} />;
    default:
      return <File size={size} className={className} />;
  }
};
