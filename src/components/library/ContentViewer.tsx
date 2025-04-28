
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Check } from 'lucide-react';
import { useContentItem } from '@/hooks/useContentItem';
import { useUser } from '@/hooks/use-user';
import { usePoints } from '@/context/PointsContext';
import VideoPlayer from './content/VideoPlayer';
import PdfViewer from './content/PdfViewer';
import AudioPlayer from './content/AudioPlayer';
import ContentText from './content/ContentText';
import LinkPreview from './content/LinkPreview';
import CourseViewer from './course/CourseViewer';
import ProgressBar from './ProgressBar';
import { ContentProgress } from '@/types/library';
import { createClient } from '@/api/supabase';

const ContentViewer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { awardPoints } = usePoints();
  const { contentItem, loading, error } = useContentItem(id || '');
  
  const [progress, setProgress] = useState<ContentProgress | null>(null);
  const supabase = createClient();
  
  useEffect(() => {
    // Load user's progress for this content
    const loadProgress = async () => {
      if (!id || !user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('content_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_id', id)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "not found" error code
            console.error('Error loading progress:', error);
          }
          return;
        }
        
        setProgress(data);
      } catch (err) {
        console.error('Error loading progress:', err);
      }
    };
    
    loadProgress();
  }, [id, user?.id]);
  
  const updateProgress = async (newProgressPercent: number) => {
    if (!id || !user?.id) return;
    
    const isCompleted = newProgressPercent >= 100;
    const now = new Date().toISOString();
    
    try {
      if (progress) {
        // Update existing progress
        const { error } = await supabase
          .from('content_progress')
          .update({
            progress_percent: newProgressPercent,
            completed_at: isCompleted ? now : progress.completed_at,
            last_accessed_at: now,
          })
          .eq('id', progress.id);
          
        if (error) throw error;
        
        setProgress({
          ...progress,
          progress_percent: newProgressPercent,
          completed_at: isCompleted ? now : progress.completed_at,
          last_accessed_at: now
        });
      } else {
        // Create new progress record
        const { data, error } = await supabase
          .from('content_progress')
          .insert({
            user_id: user.id,
            content_id: id,
            progress_percent: newProgressPercent,
            completed_at: isCompleted ? now : null,
            last_accessed_at: now,
            points_awarded: false
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setProgress(data);
      }
      
      // Award points for completion if needed
      if (isCompleted && 
          contentItem?.pointsEnabled && 
          contentItem?.pointsValue && 
          (!progress?.points_awarded)) {
        
        // Award points
        awardPoints({
          type: 'content_completion',
          description: `Completed "${contentItem.title}"`,
          points: contentItem.pointsValue
        });
        
        // Mark points as awarded
        if (progress?.id) {
          await supabase
            .from('content_progress')
            .update({ points_awarded: true })
            .eq('id', progress.id);
            
          setProgress({
            ...progress,
            points_awarded: true
          });
        }
        
        toast({
          title: "Points Awarded!",
          description: `You earned ${contentItem.pointsValue} points for completing this content.`,
        });
      }
      
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };
  
  const handleMarkAsComplete = () => {
    updateProgress(100);
  };
  
  const handleGoBack = () => {
    navigate('/library');
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading content...</div>;
  }
  
  if (error || !contentItem) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error loading content</p>
        <Button onClick={handleGoBack}>Back to Library</Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-1">
          <ArrowLeft size={16} />
          <span>Back to Library</span>
        </Button>
        
        <div className="flex items-center gap-2">
          {progress?.completed_at && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check size={14} />
              Completed
            </span>
          )}
          
          <Button 
            onClick={handleMarkAsComplete} 
            disabled={progress?.completed_at !== undefined}
            variant="outline"
          >
            Mark as Complete
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{contentItem.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{contentItem.description}</p>
        
        <div className="w-full mb-4">
          <ProgressBar 
            progress={progress?.progress_percent || 0} 
            onProgressChange={updateProgress}
          />
        </div>
      </div>
      
      <div className="content-viewer bg-card border rounded-lg overflow-hidden">
        {contentItem.format === 'video' && <VideoPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" onProgress={updateProgress} />}
        {contentItem.format === 'pdf' && <PdfViewer url="/sample.pdf" onProgress={updateProgress} />}
        {contentItem.format === 'audio' && <AudioPlayer url="/sample.mp3" onProgress={updateProgress} />}
        {contentItem.format === 'text' && <ContentText content={contentItem.content || contentItem.description} />}
        {contentItem.format === 'link' && <LinkPreview url={contentItem.url || "https://example.com"} />}
        {contentItem.format === 'course' && <CourseViewer course={contentItem} onProgress={updateProgress} />}
      </div>
    </div>
  );
};

export default ContentViewer;
