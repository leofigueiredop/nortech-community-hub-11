
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePointsTracking } from '@/utils/pointsTracking';
import { toast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

interface CourseCompletionButtonProps {
  courseName: string;
  onComplete?: () => void;
}

const CourseCompletionButton: React.FC<CourseCompletionButtonProps> = ({ 
  courseName,
  onComplete
}) => {
  const { trackCourseCompletion } = usePointsTracking();
  
  const handleComplete = () => {
    trackCourseCompletion(courseName);
    
    toast({
      title: "Course Completed!",
      description: `You've earned points for completing "${courseName}"`,
      duration: 5000,
    });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <Button 
      onClick={handleComplete}
      className="bg-green-600 hover:bg-green-700"
    >
      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
    </Button>
  );
};

export default CourseCompletionButton;
