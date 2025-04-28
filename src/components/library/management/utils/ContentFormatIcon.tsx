
import React from 'react';
import { 
  FileVideo, File, FileText, Headphones, LucideProps,
  PlayCircle, Image, Link2, FileCode, BookOpen, Youtube
} from 'lucide-react';

export interface ContentFormatIconProps {
  format: string;
  className?: string;
  size?: number; // Added size prop
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ 
  format, 
  className = "", 
  size = 16 // Default size
}) => {
  const iconProps: LucideProps = {
    className, 
    size,
    strokeWidth: 2
  };

  switch (format?.toLowerCase()) {
    case 'video':
      return <FileVideo {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'vimeo':
      return <PlayCircle {...iconProps} />;
    case 'text':
      return <FileText {...iconProps} />;
    case 'document':
      return <File {...iconProps} />;
    case 'pdf':
      return <FileText {...iconProps} />;
    case 'gdoc':
      return <FileText {...iconProps} />;
    case 'audio':
      return <Headphones {...iconProps} />;
    case 'course':
      return <BookOpen {...iconProps} />;
    case 'image':
      return <Image {...iconProps} />;
    case 'link':
      return <Link2 {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};
