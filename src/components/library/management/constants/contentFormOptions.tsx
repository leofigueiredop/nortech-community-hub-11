
import React from 'react';
import { FileText, FileVideo, FileAudio, Link, Image, Youtube, Video, LayoutGrid, BookOpen } from 'lucide-react';
import { ContentFormat } from '@/types/library';

export const ContentFormatOptions: { value: ContentFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'video', label: 'Video (MP4)', icon: <FileVideo size={16} /> },
  { value: 'pdf', label: 'PDF Document', icon: <FileText size={16} /> },
  { value: 'audio', label: 'Audio File', icon: <FileAudio size={16} /> },
  { value: 'youtube', label: 'YouTube Link', icon: <Youtube size={16} /> },
  { value: 'vimeo', label: 'Vimeo Link', icon: <Video size={16} /> },
  { value: 'gdoc', label: 'Google Doc', icon: <FileText size={16} /> },
  { value: 'gdrive', label: 'Google Drive', icon: <LayoutGrid size={16} /> },
  { value: 'link', label: 'External Link', icon: <Link size={16} /> },
  { value: 'image', label: 'Image', icon: <Image size={16} /> },
  { value: 'text', label: 'Plain Text', icon: <FileText size={16} /> },
  { value: 'course', label: 'Course', icon: <BookOpen size={16} /> }
];

export const needsFileUpload = (format: string): boolean => {
  return ['video', 'pdf', 'audio', 'image'].includes(format);
};

export const needsUrlInput = (format: string): boolean => {
  return ['youtube', 'vimeo', 'gdoc', 'gdrive', 'link'].includes(format);
};
