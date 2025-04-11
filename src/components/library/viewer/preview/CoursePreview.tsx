
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PremiumContentOverlay from '../../PremiumContentOverlay';

interface CoursePreviewProps {
  item: ContentItem;
  onContentView: () => void;
  handleAccess: () => void;
  isFullscreen?: boolean;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ 
  item, 
  onContentView, 
  handleAccess, 
  isFullscreen = false 
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const isPremium = item.accessLevel === 'premium';

  // Toggle module expansion for course content
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Render course modules
  const renderCourseModules = () => {
    // This is mock data - in a real app, you would fetch course modules
    const mockModules = [
      { id: 'mod1', title: 'Introduction', duration: '10 mins', progress: 100 },
      { id: 'mod2', title: 'Core Concepts', duration: '25 mins', progress: 75 },
      { id: 'mod3', title: 'Advanced Techniques', duration: '30 mins', progress: 30 },
      { id: 'mod4', title: 'Project Work', duration: '45 mins', progress: 0 },
    ];

    return (
      <div className="bg-background border rounded-lg p-2 mb-6">
        <h3 className="font-medium px-2 py-1">Course Modules</h3>
        {mockModules.map(module => (
          <Collapsible key={module.id} open={expandedModules.includes(module.id)}>
            <CollapsibleTrigger asChild>
              <div 
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center">
                  {module.progress === 100 ? (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <PlayCircle className="h-4 w-4 text-primary" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                      <span className="text-xs font-medium">{module.progress}%</span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{module.title}</div>
                    <div className="text-xs text-muted-foreground">{module.duration}</div>
                  </div>
                </div>
                {expandedModules.includes(module.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-10 py-2">
                <Progress value={module.progress} className="h-1 mb-2" />
                <div className="text-xs text-muted-foreground mb-2">
                  Progress: {module.progress}% complete
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={handleAccess}>
                  {module.progress > 0 ? 'Continue' : 'Start'} Module
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className={`${isFullscreen ? 'h-[40vh]' : 'aspect-video'} bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden`}>
        <img 
          src={item.thumbnailUrl || '/placeholder.svg'} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Button 
            onClick={handleAccess} 
            size="lg"
            className="rounded-full h-16 w-16 bg-primary/90 hover:bg-primary"
          >
            <PlayCircle className="h-8 w-8" />
          </Button>
        </div>
        {isPremium && (
          <PremiumContentOverlay 
            pointsEnabled={item.pointsEnabled}
            pointsValue={item.pointsValue}
            freeAccessLeft={item.freeAccessesLeft}
            onSubscribe={handleAccess}
            onUsePoints={handleAccess}
          />
        )}
      </div>
      {renderCourseModules()}
    </div>
  );
};

export default CoursePreview;
