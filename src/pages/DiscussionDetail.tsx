import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { 
  ArrowLeft, 
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useRealDiscussions } from '@/hooks/useRealDiscussions';
import Discussion from '@/components/discussions/Discussion';

const DiscussionDetail = () => {
  const { topicId, discussionId } = useParams<{ topicId: string; discussionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    loadDiscussion, 
    currentDiscussion, 
    currentTopic, 
    loadDiscussionsByTopic
  } = useRealDiscussions();
  
  // Load the discussion on component mount
  useEffect(() => {
    if (discussionId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Load the discussion with replies
          await loadDiscussion(discussionId);
          
          // If we have a topicId, also load the topic information
          if (topicId) {
            await loadDiscussionsByTopic(topicId);
          }
        } catch (error) {
          console.error('Error loading discussion:', error);
          toast({
            title: 'Error',
            description: 'Failed to load discussion',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [discussionId, topicId, loadDiscussion, loadDiscussionsByTopic, toast]);
  
  const handleBackClick = () => {
    if (topicId) {
      navigate(`/discussions/topic/${topicId}`);
    } else {
      navigate('/discussions');
    }
  };
  
  if (loading) {
    return (
      <MainLayout title="Discussion">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!currentDiscussion) {
    return (
      <MainLayout title="Discussion Not Found">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-xl font-semibold">Discussion not found</h2>
          <p className="text-muted-foreground">The discussion you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discussions
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const topicName = currentTopic?.title || currentTopic?.name || 'Discussion';
  
  return (
    <MainLayout title={currentDiscussion.title}>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {topicName}
        </Button>
        
        <Separator className="my-4" />
        
        <Discussion 
          discussion={currentDiscussion} 
          isDetailView={true}
          topicName={topicName}
        />
      </div>
    </MainLayout>
  );
};

export default DiscussionDetail;
