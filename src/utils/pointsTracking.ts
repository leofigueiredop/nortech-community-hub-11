
import { usePoints, POINTS_VALUES } from '@/context/PointsContext';
import { ContentItem } from '@/types/library';

export const usePointsTracking = () => {
  const { awardPoints } = usePoints();
  
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
  };
  
  const trackEventParticipation = (eventName: string) => {
    awardPoints({
      type: 'event_participation',
      description: `Participated in "${eventName}" event`,
      points: POINTS_VALUES.event_participation
    });
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
  
  return {
    trackLogin,
    trackComment,
    trackLike,
    trackCourseCompletion,
    trackEventParticipation,
    trackReferral,
    trackContentView,
    trackContentCompletion
  };
};
