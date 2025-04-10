
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, Lock, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PreviewTabProps {
  title: string;
  content: string;
  postType: string;
  visibilityOption: string;
  selectedSpace: string;
  spaces: Array<{id: number, name: string}>;
  selectedTags: string[];
  attachedFiles: File[];
  previewUrls: string[];
  embeds: Array<{type: string, url: string}>;
  monetizeWithPoints: boolean;
  pointsAmount: number;
  isScheduled: boolean;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  getPostTypeIcon: () => string;
  getVisibilityIcon: () => string;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  title,
  content,
  postType,
  visibilityOption,
  selectedSpace,
  spaces,
  selectedTags,
  attachedFiles,
  previewUrls,
  embeds,
  monetizeWithPoints,
  pointsAmount,
  isScheduled,
  scheduledDate,
  scheduledTime,
  getPostTypeIcon,
  getVisibilityIcon
}) => {
  // Dynamically render Lucide icons based on their name
  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent ? <IconComponent size={14} /> : null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-gray-900 dark:text-gray-100">
        {title && <h2 className="text-xl font-bold mb-3">{title}</h2>}
        
        <div className="mb-3 flex items-center">
          <div className="flex items-center mr-3">
            {renderIcon(getPostTypeIcon())}
            <span className="ml-1 text-sm">{postType.charAt(0).toUpperCase() + postType.slice(1)}</span>
          </div>
          
          <div className="flex items-center">
            {renderIcon(getVisibilityIcon())}
            <span className="ml-1 text-sm">
              {visibilityOption === 'free' ? 'Free' : 
                visibilityOption === 'premium' ? 'Premium' : 
                visibilityOption === 'teaser' ? 'Public Teaser' : 'Free'}
            </span>
          </div>
          
          {selectedSpace && spaces.find(s => s.id.toString() === selectedSpace) && (
            <Badge className="ml-3">
              {spaces.find(s => s.id.toString() === selectedSpace)?.name}
            </Badge>
          )}
        </div>
        
        <div className="whitespace-pre-line mb-4">
          {visibilityOption === 'teaser' ? (
            <>
              <p>{content.substring(0, 150)}...</p>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                  <Lock size={14} className="mr-2 flex-shrink-0" />
                  Subscribe to see the full content
                </p>
              </div>
            </>
          ) : visibilityOption === 'premium' && !monetizeWithPoints ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800 z-10"></div>
              <p className="blur-sm select-none mb-2">{content}</p>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm relative z-20">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                  <Lock size={14} className="mr-2 flex-shrink-0" />
                  This premium content is for subscribers only
                </p>
              </div>
            </div>
          ) : (
            <p>{content}</p>
          )}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 mb-4">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {attachedFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                {attachedFiles[index].type.includes('image') ? (
                  <img 
                    src={url} 
                    alt={`Attachment ${index + 1}`} 
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700">
                    <FileText size={32} className="text-gray-400" />
                    <span className="ml-2 text-sm truncate max-w-[100px]">
                      {attachedFiles[index].name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {embeds.length > 0 && (
          <div className="mt-4 space-y-3">
            {embeds.map((embed, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center mb-2">
                  {/* The icons are handled differently from a UI perspective in the preview */}
                  <span className={`mr-2 ${
                    embed.type === 'youtube' ? 'text-red-500' : 
                    embed.type === 'loom' ? 'text-green-500' : 
                    'text-blue-400'}`}>
                    {embed.type === 'youtube' ? 'YouTube' : 
                     embed.type === 'loom' ? 'Loom' : 
                     'Link'}
                  </span>
                  <a href={embed.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                    {embed.url}
                  </a>
                </div>
                
                {embed.type === 'youtube' && (
                  <div className="bg-gray-200 dark:bg-gray-700 aspect-video flex items-center justify-center">
                    <span className="text-red-500 opacity-50">YouTube Preview</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {monetizeWithPoints && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-sm">
            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
              <span className="mr-2 flex-shrink-0">💰</span>
              Unlock with {pointsAmount} points
            </p>
          </div>
        )}
        
        {isScheduled && scheduledDate && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} className="inline-block mr-1" />
            Scheduled for {format(scheduledDate, 'PPP')} at {scheduledTime}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewTab;
