
import { usePoints, POINTS_VALUES } from '@/context/PointsContext';

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
  
  return {
    trackLogin,
    trackComment,
    trackLike,
    trackCourseCompletion,
    trackEventParticipation,
    trackReferral
  };
};
