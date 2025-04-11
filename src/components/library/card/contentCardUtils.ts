
/**
 * Get the appropriate icon based on content format
 */
import { FileText, Download, Play } from 'lucide-react';
import React from 'react';

export const getContentIcon = (format: string) => {
  switch (format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return React.createElement(Play, { className: "h-8 w-8 text-white" });
    case 'pdf':
    case 'text':
    case 'gdoc':
      return React.createElement(FileText, { className: "h-8 w-8 text-white" });
    default:
      return React.createElement(Download, { className: "h-8 w-8 text-white" });
  }
};

/**
 * Get the appropriate action text based on content format
 */
export const getContentActionText = (format: string) => {
  switch (format) {
    case 'video':
    case 'youtube':
    case 'vimeo':
      return 'Watch';
    case 'pdf':
    case 'text':
    case 'gdoc':
      return 'Read';
    case 'audio':
      return 'Listen';
    default:
      return 'View';
  }
};
