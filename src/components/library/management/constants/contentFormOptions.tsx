
import React from 'react';
import { Film, Book, FileText, Link, Music, Image, FileBox, BookOpen } from 'lucide-react';
import { ContentFormat } from '@/types/library';

export const contentFormatOptions = [
  {
    value: 'video',
    label: 'Video',
    icon: <Film className="h-4 w-4 mr-2" />,
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: <Music className="h-4 w-4 mr-2" />,
  },
  {
    value: 'pdf',
    label: 'PDF Document',
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    value: 'text',
    label: 'Text/Article',
    icon: <Book className="h-4 w-4 mr-2" />,
  },
  {
    value: 'image',
    label: 'Image',
    icon: <Image className="h-4 w-4 mr-2" />,
  },
  {
    value: 'link',
    label: 'External Link',
    icon: <Link className="h-4 w-4 mr-2" />,
  },
  {
    value: 'youtube',
    label: 'YouTube Video',
    icon: <Film className="h-4 w-4 mr-2" />,
  },
  {
    value: 'vimeo',
    label: 'Vimeo Video',
    icon: <Film className="h-4 w-4 mr-2" />,
  },
  {
    value: 'gdoc',
    label: 'Google Document',
    icon: <FileBox className="h-4 w-4 mr-2" />,
  },
  {
    value: 'course',
    label: 'Course',
    icon: <BookOpen className="h-4 w-4 mr-2" />,
  },
];

// Helper functions for content form
export const needsFileUpload = (format: string): boolean => {
  return ['video', 'audio', 'pdf', 'image'].includes(format);
};

export const needsUrlInput = (format: string): boolean => {
  return ['link', 'youtube', 'vimeo', 'gdoc', 'url'].includes(format);
};
