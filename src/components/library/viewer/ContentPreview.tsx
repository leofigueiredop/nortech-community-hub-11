
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  FileText, 
  Download, 
  ExternalLink, 
  Video, 
  FileVideo, 
  File, 
  BookOpen, 
  Image,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  Headphones
} from 'lucide-react';
import { ContentItem } from '@/types/library';
import { handleExternalContentAccess } from './contentViewerUtils';
import PremiumContentOverlay from '../PremiumContentOverlay';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';

interface ContentPreviewProps {
  item: ContentItem;
  onContentView: () => void;
  isFullscreen?: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ item, onContentView, isFullscreen = false }) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAccess = () => {
    handleExternalContentAccess(item, onContentView);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1].split('?')[0]
        : url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    if (url.includes('drive.google.com/file/d')) {
      const fileId = url.match(/\/d\/(.*?)\//) ? url.match(/\/d\/(.*?)\//)![1] : '';
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    if (url.includes('docs.google.com/document')) {
      return url.replace('/edit', '/preview');
    }
    
    return url;
  };

  const previewClass = isFullscreen 
    ? "w-full max-h-[70vh] bg-slate-900 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden"
    : "aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden";

  // Check if content is premium
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

  // Render audio player
  const renderAudioPlayer = () => {
    return (
      <div className="bg-background border rounded-lg p-4 mb-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <Headphones className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center mb-3">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.author || 'Unknown artist'}</p>
        </div>
        <div className="w-full mb-2">
          <Progress value={30} className="h-1" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:30</span>
            <span>5:00</span>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-10 h-10"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <div className="h-3 w-3 bg-primary"></div>
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  };

  // Render different preview types
  const renderPreview = () => {
    switch (item.format) {
      case 'course':
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
        
      case 'video':
      case 'youtube':
      case 'vimeo':
        if (item.resourceUrl.includes('youtube.com') || 
            item.resourceUrl.includes('youtu.be') || 
            item.resourceUrl.includes('vimeo.com')) {
          return (
            <div className={previewClass}>
              <iframe 
                src={getEmbedUrl(item.resourceUrl)}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
                onLoad={onContentView}
              />
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
          );
        }
        return (
          <div className={previewClass}>
            <div className="text-center">
              <FileVideo size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Video preview not available</p>
              <Button 
                onClick={handleAccess} 
                className="mt-4"
              >
                {isPremium ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Unlock Premium Video
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" /> Watch Video
                  </>
                )}
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
        );
        
      case 'pdf':
        if (item.accessLevel === 'free' && 
            (item.resourceUrl.endsWith('.pdf') || item.resourceUrl.includes('drive.google.com'))) {
          return (
            <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg mb-6 relative overflow-hidden`}>
              <iframe 
                src={getEmbedUrl(item.resourceUrl)}
                className="w-full h-full rounded-lg"
                title={item.title}
                onLoad={onContentView}
              />
            </div>
          );
        }
        return (
          <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-[3/4]'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden`}>
            <div className="text-center">
              <File size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">PDF preview not available</p>
              <div className="mt-4 space-y-2">
                <Button onClick={handleAccess} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button variant="outline" onClick={handleAccess} className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" /> View in Browser
                </Button>
              </div>
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
        );
        
      case 'audio':
        return renderAudioPlayer();
        
      case 'image':
        return (
          <div className={`${isFullscreen ? 'max-h-[70vh] flex justify-center relative' : 'relative'} mb-6 overflow-hidden`}>
            <img 
              src={item.resourceUrl || item.thumbnailUrl || '/placeholder.svg'} 
              alt={item.title} 
              className={`${isFullscreen ? 'max-h-[70vh] object-contain' : 'w-full'} rounded-lg`}
              onLoad={onContentView}
            />
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
        );
        
      case 'gdoc':
      case 'gdrive':
        return (
          <div className={previewClass}>
            <iframe 
              src={getEmbedUrl(item.resourceUrl)}
              className="w-full h-full rounded-lg"
              title={item.title}
              onLoad={onContentView}
            />
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
        );
        
      default:
        return (
          <div className={`${isFullscreen ? 'h-[70vh]' : 'aspect-video'} bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden`}>
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Preview not available</p>
              <Button 
                onClick={handleAccess} 
                className="mt-4"
              >
                {isPremium ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Unlock Premium Content
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" /> Access Content
                  </>
                )}
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
        );
    }
  };

  return renderPreview();
};

export default ContentPreview;
