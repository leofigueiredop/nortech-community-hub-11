
import { usePoints, POINTS_VALUES } from '@/context/PointsContext';
import { ContentItem } from '@/types/library';

// Adding the missing export function
export const addPointsForEventAttendance = (eventId: number, points: number, badgeName?: string) => {
  console.log(`Recording attendance for event ${eventId} with ${points} points and badge ${badgeName || 'none'}`);
  // In a real app, this would make an API call to record attendance
};

export const usePointsTracking = () => {
  const { addPoints, awardBadge } = usePoints();
  
  const trackLogin = () => {
    addPoints({
      type: 'login',
      description: 'Daily login bonus',
      points: POINTS_VALUES.login
    });
  };
  
  const trackComment = (postTitle: string) => {
    addPoints({
      type: 'comment',
      description: `Comment on "${postTitle}"`,
      points: POINTS_VALUES.comment
    });
  };
  
  const trackLike = (postTitle: string) => {
    addPoints({
      type: 'like',
      description: `Liked "${postTitle}"`,
      points: POINTS_VALUES.like
    });
  };
  
  const trackCourseCompletion = (courseName: string) => {
    addPoints({
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
  
  // Enhanced version with more tracking options and custom points
  const trackEventParticipation = (eventName: string, eventType?: string, customPoints?: number) => {
    const pointsValue = customPoints || POINTS_VALUES.event_participation;
    
    addPoints({
      type: 'event_participation',
      description: `Participated in "${eventName}" event`,
      points: pointsValue
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
    addPoints({
      type: 'referral',
      description: `Referred user ${username}`,
      points: POINTS_VALUES.referral
    });
  };
  
  const trackContentView = (content: ContentItem) => {
    if (!content.pointsEnabled) return;
    
    addPoints({
      type: 'content_view',
      description: `Viewed "${content.title}"`,
      points: content.pointsValue ? Math.floor(content.pointsValue * 0.1) : POINTS_VALUES.content_view
    });
  };
  
  const trackContentCompletion = (content: ContentItem) => {
    if (!content.pointsEnabled) return;
    
    addPoints({
      type: 'content_completion',
      description: `Completed "${content.title}"`,
      points: content.pointsValue || POINTS_VALUES.content_completion
    });
    
    // Award format-specific badges
    if (content.format === 'pdf') {
      checkPDFMilestones();
    } else if (content.format === 'video') {
      checkVideoMilestones();
    } else if (content.format === 'course') {
      awardBadge({
        name: `${content.title} Graduate`,
        description: `Completed the ${content.title} course`,
        category: 'achievement'
      });
    }
  };
  
  // Check PDF milestones for badges
  const checkPDFMilestones = () => {
    // In a real app, this would query completed PDF content count
    setTimeout(() => {
      awardBadge({
        name: 'PDF Explorer',
        description: 'Read 3 PDF documents',
        category: 'achievement'
      });
    }, 500);
  };
  
  // Check video milestones for badges
  const checkVideoMilestones = () => {
    // In a real app, this would query completed video content count
    setTimeout(() => {
      awardBadge({
        name: 'Video Enthusiast',
        description: 'Watched 5 videos',
        category: 'achievement'
      });
    }, 500);
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
    checkEventAttendanceMilestones,
    checkPDFMilestones,
    checkVideoMilestones
  };
};
