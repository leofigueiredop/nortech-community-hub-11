
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle } from 'lucide-react';
import { ContentItem, CourseModule, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/components/library/viewer/contentViewerUtils';

interface CourseSummaryTabProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  currentModule: CourseModule | null;
  isDarkMode: boolean;
}

const CourseSummaryTab: React.FC<CourseSummaryTabProps> = ({
  course,
  currentLesson,
  currentModule,
  isDarkMode
}) => {
  // Get module lessons to display in summary
  const moduleLessons = currentModule?.items || [];
  
  return (
    <div className="p-6">
      <div className="space-y-2 mb-8">
        <h2 className="text-xl font-bold">{currentModule?.title || course.title}</h2>
        
        {currentLesson && (
          <div className="text-muted-foreground">
            Currently viewing: <span className="font-medium">{currentLesson.title}</span>
          </div>
        )}
        
        <div className="prose dark:prose-invert max-w-none mt-4">
          <p>{course.description}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Lessons in this Module</h3>
        
        <div className="space-y-3">
          {moduleLessons.map((lesson) => (
            <div 
              key={lesson.id}
              className={`flex items-center justify-between p-3 rounded-md ${
                currentLesson?.id === lesson.id
                  ? 'bg-primary/10 border border-primary/20'
                  : `border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5 text-primary" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{lesson.type}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDuration(360)}</span> {/* Replace with actual duration */}
                  </div>
                </div>
              </div>
              
              <Link to={`/course/${course.id}/${lesson.id}`}>
                <Button 
                  variant={currentLesson?.id === lesson.id ? 'secondary' : 'outline'} 
                  size="sm"
                >
                  {currentLesson?.id === lesson.id ? 'Current' : (lesson.completed ? 'Revisit' : 'Start')}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSummaryTab;
