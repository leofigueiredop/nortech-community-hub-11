
import React from 'react';
import { Video, FileText, File, Book, Image, Link, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContentFormatIconProps {
  format: string;
  className?: string;
  size?: number;
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ format, className, size = 14 }) => {
  const getIcon = () => {
    switch (format.toLowerCase()) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return <Video size={size} className={className} />;
      case 'text':
      case 'document':
        return <FileText size={size} className={className} />;
      case 'pdf':
      case 'gdoc':
        return <File size={size} className={className} />;
      case 'course':
        return <Book size={size} className={className} />;
      case 'image':
        return <Image size={size} className={className} />;
      case 'link':
        return <Link size={size} className={className} />;
      case 'audio':
        return <Music size={size} className={className} />;
      default:
        return <File size={size} className={className} />;
    }
  };

  const getFormatColor = () => {
    switch (format.toLowerCase()) {
      case 'video':
      case 'youtube':
      case 'vimeo':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'text':
      case 'document':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pdf':
      case 'gdoc':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'course':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'image':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'link':
        return 'bg-sky-100 text-sky-800 hover:bg-sky-200';
      case 'audio':
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={`${getFormatColor()} flex items-center gap-1 capitalize px-1.5`}>
      {getIcon()}
      <span className="hidden sm:inline">{format}</span>
    </Badge>
  );
};
