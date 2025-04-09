
import { usePoints, POINTS_VALUES } from '@/context/PointsContext';
import { ContentItem } from '@/types/library';

export const usePointsTracking = () => {
  const { awardPoints, awardBadge } = usePoints();
  
  const trackLogin = () => {
    awardPoints({
      type: 'login',
      description: 'Daily login bonus',
      points: POINTS_VALUES.login
    });
  };
  
  const trackComment = (postTitle: string) => {
    awardPoints({
      type: 'comment',
      description: `Comment on "${postTitle}"`,
      points: POINTS_VALUES.comment
    });
  };
  
  const trackLike = (postTitle: string) => {
    awardPoints({
      type: 'like',
      description: `Liked "${postTitle}"`,
      points: POINTS_VALUES.like
    });
  };
  
  const trackCourseCompletion = (courseName: string) => {
    awardPoints({
      type: 'course_completion',
      description: `Completed "${courseName}" course`,
      points: POINTS_VALUES.course_completion
    });
    
    // Award course completion badge
    awardBadge({
      name: `${courseName} Graduate`,
      description: `Completed the ${courseName} course`,
      category: 'achievement'
    });
  };
  
  // Enhanced version with more tracking options
  const trackEventParticipation = (eventName: string, eventType?: string, customPoints?: number) => {
    const pointsValue = customPoints || POINTS_VALUES.event_participation;
    
    awardPoints({
      type: 'event_participation',
      description: `Participated in "${eventName}" event`,
      points: pointsValue,
      metadata: { eventType }
    });
    
    // Award event attendance badge
    awardBadge({
      name: `${eventName} Attendee`,
      description: `Attended the ${eventName} event`,
      category: 'event'
    });
    
    // Check if this is the 5th event attended (simplified example)
    checkEventAttendanceMilestones();
  };
  
  // New function to check attendance milestones
  const checkEventAttendanceMilestones = () => {
    // In a real app, this would query the user's attendance history
    // For this example, we'll just award a special badge
    setTimeout(() => {
      awardBadge({
        name: 'Event Enthusiast',
        description: 'Attended 5 community events',
        category: 'achievement'
      });
    }, 1000);
  };
  
  const trackReferral = (username: string) => {
    awardPoints({
      type: 'referral',
      description: `Referred user ${username}`,
      points: POINTS_VALUES.referral
    });
  };
  
  const trackContentView = (content: ContentItem) => {
    if (!content.pointsEnabled) return;
    
    awardPoints({
      type: 'content_view',
      description: `Viewed "${content.title}"`,
      points: content.pointsValue || POINTS_VALUES.content_view
    });
  };
  
  const trackContentCompletion = (content: ContentItem) => {
    if (!content.pointsEnabled) return;
    
    awardPoints({
      type: 'content_completion',
      description: `Completed "${content.title}"`,
      points: content.pointsValue || POINTS_VALUES.content_completion
    });
  };
  
  // New function to award custom badge
  const awardCustomBadge = (name: string, description: string, category: 'event' | 'achievement' | 'role' | 'custom' = 'custom') => {
    awardBadge({
      name,
      description,
      category
    });
  };
  
  return {
    trackLogin,
    trackComment,
    trackLike,
    trackCourseCompletion,
    trackEventParticipation,
    trackReferral,
    trackContentView,
    trackContentCompletion,
    awardCustomBadge,
    checkEventAttendanceMilestones
  };
};
