import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  HelpCircle, 
  Rss, 
  BookOpen, 
  FolderOpen,
  Check
} from 'lucide-react';
import { SpaceTemplate } from './types';

interface SpaceTemplatesProps {
  selectedTemplate?: string;
  onSelectTemplate: (templateId: string) => void;
}

const SpaceTemplates: React.FC<SpaceTemplatesProps> = ({
  selectedTemplate,
  onSelectTemplate
}) => {
  const templates: SpaceTemplate[] = [
    {
      id: 'forum',
      name: 'Forum Discussion',
      description: 'Traditional forum-style discussions with threads and replies',
      icon: 'MessageSquare',
      features: ['Threaded discussions', 'Post reactions', 'Moderation tools', 'Categories'],
      defaultSettings: {
        allowReplies: true,
        allowReactions: true,
        requireApproval: false
      }
    },
    {
      id: 'qa',
      name: 'Q&A Space',
      description: 'Question and answer format with voting and best answers',
      icon: 'HelpCircle',
      features: ['Question voting', 'Best answer selection', 'Tags', 'Reputation system'],
      defaultSettings: {
        allowVoting: true,
        requireTags: true,
        allowBestAnswer: true
      }
    },
    {
      id: 'feed',
      name: 'Content Feed',
      description: 'Social media style feed with posts, images, and quick interactions',
      icon: 'Rss',
      features: ['Rich media posts', 'Quick reactions', 'Comments', 'Hashtags'],
      defaultSettings: {
        allowMedia: true,
        allowHashtags: true,
        showTimeline: true
      }
    },
    {
      id: 'course',
      name: 'Course Space',
      description: 'Structured learning environment with lessons and progress tracking',
      icon: 'BookOpen',
      features: ['Lesson structure', 'Progress tracking', 'Assignments', 'Certificates'],
      defaultSettings: {
        trackProgress: true,
        allowAssignments: true,
        requireCompletion: false
      }
    },
    {
      id: 'project',
      name: 'Project Collaboration',
      description: 'Team collaboration space with tasks, files, and project management',
      icon: 'FolderOpen',
      features: ['Task management', 'File sharing', 'Team chat', 'Milestones'],
      defaultSettings: {
        allowTasks: true,
        allowFiles: true,
        showMilestones: true
      }
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return MessageSquare;
      case 'HelpCircle': return HelpCircle;
      case 'Rss': return Rss;
      case 'BookOpen': return BookOpen;
      case 'FolderOpen': return FolderOpen;
      default: return MessageSquare;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const IconComponent = getIcon(template.icon);
        const isSelected = selectedTemplate === template.id;
        
        return (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected 
                ? 'ring-2 ring-indigo-500 border-indigo-200 dark:border-indigo-800' 
                : 'hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {template.name}
                    </CardTitle>
                  </div>
                </div>
                {isSelected && (
                  <div className="p-1 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900 dark:text-indigo-400">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Features included:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant={isSelected ? "default" : "outline"}
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select Template'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SpaceTemplates; 