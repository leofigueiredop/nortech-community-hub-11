
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Bookmark, BookmarkCheck, 
  Sun, Moon, Maximize, Minimize, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { useContentProgress } from '@/hooks/useContentProgress';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { useAuth } from '@/context/AuthContext';
import CourseTopBar from '@/components/courses/CourseTopBar';
import CoursePlayer from '@/components/courses/CoursePlayer';
import CourseModules from '@/components/courses/CourseModules';
import CourseContentTabs from '@/components/courses/CourseContentTabs';
import CourseAchievements from '@/components/courses/CourseAchievements';
import { ContentItem, Course, CourseModule, CourseModuleItem } from '@/types/library';
import { toast } from '@/hooks/use-toast';

const CourseViewer: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { content } = useLibraryContent();
  const { user } = useAuth();
  const { updateProgress, getProgress } = useContentProgress();
  
  // Course viewer states
  const [currentCourse, setCurrentCourse] = useState<ContentItem | null>(null);
  const [currentLesson, setCurrentLesson] = useState<CourseModuleItem | null>(null);
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find course in content
  useEffect(() => {
    if (courseId && content.length > 0) {
      const foundCourse = content.find(item => item.id === courseId && item.format === 'course');
      
      if (foundCourse) {
        setCurrentCourse(foundCourse);
        
        // Calculate course progress
        if (foundCourse.id) {
          const progress = getProgress(foundCourse.id);
          setCourseProgress(progress?.progress || 0);
        }
        
        // Set first lesson if none specified
        if (!lessonId && foundCourse.format === 'course') {
          const courseData = foundCourse as unknown as Course;
          if (courseData.modules?.length > 0 && courseData.modules[0].items?.length > 0) {
            const firstLesson = courseData.modules[0].items[0];
            navigate(`/course/${courseId}/${firstLesson.id}`);
          }
        }
      } else {
        toast({
          title: "Course not found",
          description: "The course you're looking for could not be found.",
          variant: "destructive"
        });
        navigate('/library');
      }
    }
  }, [courseId, content, navigate, getProgress, lessonId]);
  
  // Find current lesson and module
  useEffect(() => {
    if (currentCourse?.format === 'course' && lessonId) {
      const courseData = currentCourse as unknown as Course;
      
      for (const module of courseData.modules || []) {
        const lesson = module.items.find(item => item.id === lessonId);
        if (lesson) {
          setCurrentLesson(lesson);
          setCurrentModule(module);
          break;
        }
      }
    }
  }, [currentCourse, lessonId]);
  
  // Update progress when lesson changes
  useEffect(() => {
    if (currentLesson && currentLesson.contentId) {
      // Mark the current lesson as started
      updateProgress(currentLesson.contentId, 10);
    }
  }, [currentLesson, updateProgress]);
  
  const handleFavoriteToggle = () => {
    setIsFavorite(prev => !prev);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Course removed from your favorites" : "Course added to your favorites",
    });
  };
  
  const handleDarkModeToggle = () => {
    setIsDarkMode(prev => !prev);
    // In a real implementation, this would change the theme
  };
  
  const handleCompactModeToggle = () => {
    setIsCompactMode(prev => !prev);
  };
  
  const handleGoBack = () => {
    navigate('/library');
  };
  
  if (!currentCourse) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading course...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Bar */}
      <CourseTopBar 
        course={currentCourse}
        progress={courseProgress}
        isFavorite={isFavorite}
        onFavoriteToggle={handleFavoriteToggle}
        onBack={handleGoBack}
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Player and Tabs */}
          <div className={`${isCompactMode ? 'w-full' : 'lg:w-8/12'} space-y-6`}>
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/library">Library</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={`/course/${courseId}`}>{currentCourse.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentModule && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <span className="text-muted-foreground">{currentModule.title}</span>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* Course Player */}
            <CoursePlayer 
              lesson={currentLesson}
              course={currentCourse}
              onProgress={(progress) => {
                if (currentLesson?.contentId) {
                  updateProgress(currentLesson.contentId, progress);
                }
              }}
              isDarkMode={isDarkMode}
            />
            
            {/* Layout Controls */}
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCompactModeToggle}
                className="flex items-center gap-2"
              >
                {isCompactMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                {isCompactMode ? 'Normal Mode' : 'Focus Mode'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDarkModeToggle}
                className="flex items-center gap-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            
            {/* Content Tabs */}
            <CourseContentTabs 
              course={currentCourse}
              currentLesson={currentLesson}
              currentModule={currentModule}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Right Section - Modules and Achievements */}
          {!isCompactMode && (
            <div className="lg:w-4/12 space-y-6">
              {/* Course Modules */}
              <CourseModules 
                course={currentCourse}
                currentLessonId={lessonId || ''}
                isDarkMode={isDarkMode}
              />
              
              {/* Achievements and Certification */}
              <CourseAchievements 
                course={currentCourse}
                progress={courseProgress}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
