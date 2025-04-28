
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { File, FileText, Video, FileQuestion, Code } from 'lucide-react';

interface ContentFormatIconProps {
  format?: string;
}

export const ContentFormatIcon: React.FC<ContentFormatIconProps> = ({ format }) => {
  if (!format) return null;
  
  switch (format.toLowerCase()) {
    case 'video':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
          <Video className="w-3 h-3 mr-1" />
          Video
        </Badge>
      );
    case 'document':
    case 'pdf':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-0">
          <File className="w-3 h-3 mr-1" />
          Document
        </Badge>
      );
    case 'text':
    case 'article':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
          <FileText className="w-3 h-3 mr-1" />
          Article
        </Badge>
      );
    case 'quiz':
    case 'assessment':
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-0">
          <FileQuestion className="w-3 h-3 mr-1" />
          Quiz
        </Badge>
      );
    case 'code':
    case 'exercise':
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0">
          <Code className="w-3 h-3 mr-1" />
          Exercise
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-0">
          {format}
        </Badge>
      );
  }
};
