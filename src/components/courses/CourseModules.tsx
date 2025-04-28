import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Play,
  FileAudio,
  ListChecks,
  Lock
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ContentItem, Course, CourseModule, CourseModuleItem } from '@/types/library';
import { Badge } from '@/components/ui/badge';
import { useContentProgress } from '@/hooks/useContentProgress';
import { formatDuration } from '@/components/library/viewer/contentViewerUtils';

interface CourseModulesProps {
  course: ContentItem;
  currentLessonId: string;
  isDarkMode: boolean;
}

const CourseModules: React.FC<CourseModulesProps> = ({
  course,
  currentLessonId,
  isDarkMode
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const { courseId } = useParams();
  const { getProgress } = useContentProgress();
  
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  const getLessonIcon = (lesson: CourseModuleItem) => {
    const isCompleted = lesson.completed;
    
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    switch (lesson.type?.toLowerCase()) {
      case 'video':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'text':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'audio':
        return <FileAudio className="h-4 w-4 text-purple-500" />;
      case 'quiz':
        return <ListChecks className="h-4 w-4 text-pink-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getModuleProgress = (module: CourseModule) => {
    const totalLessons = module.items.length;
    const completedLessons = module.items.filter(item => item.completed).length;
    
    return {
      completed: completedLessons,
      total: totalLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  };
  
  const isModuleNew = (module: CourseModule) => {
    return false; 
  };
  
  const isLessonNew = (lesson: CourseModuleItem) => {
    return false;
  };
  
  if (course.format !== 'course') {
    return <div>Not a course</div>;
  }
  
  const courseData = course as unknown as Course;
  
  return (
    <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} shadow-md`}>
      <div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-2">Course Content</h2>
        <div className="text-sm text-muted-foreground">
          {courseData.modules?.length || 0} modules · {
            courseData.modules?.reduce((acc, module) => acc + module.items.length, 0) || 0
          } lessons
        </div>
      </div>
      
      <div className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
        {courseData.modules?.map((module, index) => {
          const moduleProgress = getModuleProgress(module);
          const isExpanded = expandedModules.includes(module.id);
          
          return (
            <div key={module.id} className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div 
                className={`p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{module.title}</h3>
                      
                      {isModuleNew(module) && (
                        <Badge variant="outline" className="bg-blue-500 text-white text-xs">New</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {moduleProgress.completed} of {moduleProgress.total} completed ({moduleProgress.percentage}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              
              {isExpanded && (
                <div className={`pl-8 pr-4 pb-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <ul className="space-y-2">
                    {module.items.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === currentLessonId;
                      const isLocked = lesson.type === 'exercise' && !module.items[lessonIndex - 1]?.completed;
                      
                      return (
                        <li key={lesson.id} className="relative">
                          <Link
                            to={isLocked ? '#' : `/course/${courseId}/${lesson.id}`}
                            className={`flex items-center gap-3 p-2 rounded-md ${
                              isActive 
                                ? 'bg-primary/10 text-primary' 
                                : `hover:bg-slate-100 dark:hover:bg-slate-700 ${
                                    isLocked ? 'opacity-60 cursor-not-allowed' : ''
                                  }`
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {isLocked ? (
                                <Lock className="h-4 w-4 text-gray-500" />
                              ) : (
                                getLessonIcon(lesson)
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className={`truncate ${isActive ? 'font-medium' : ''}`}>
                                  {lesson.title}
                                </span>
                                
                                {isLessonNew(lesson) && (
                                  <Badge className="bg-blue-500 text-white text-xs" variant="outline">New</Badge>
                                )}
                              </div>
                              
                              {lesson.type === 'video' && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDuration(360)}
                                </span>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseModules;
