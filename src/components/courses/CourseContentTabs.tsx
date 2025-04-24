
import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ContentItem, CourseModule, CourseModuleItem } from '@/types/library';
import CourseSummaryTab from './tabs/CourseSummaryTab';
import CourseNotesTab from './tabs/CourseNotesTab';
import CourseTranscriptTab from './tabs/CourseTranscriptTab';
import CourseCommentsTab from './tabs/CourseCommentsTab';
import CourseMaterialsTab from './tabs/CourseMaterialsTab';

interface CourseContentTabsProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  currentModule: CourseModule | null;
  isDarkMode: boolean;
}

const CourseContentTabs: React.FC<CourseContentTabsProps> = ({
  course,
  currentLesson,
  currentModule,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} shadow-md`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="summary" className="text-sm">Summary</TabsTrigger>
            <TabsTrigger value="notes" className="text-sm">Notes</TabsTrigger>
            <TabsTrigger value="transcript" className="text-sm">Transcript</TabsTrigger>
            <TabsTrigger value="comments" className="text-sm">Comments</TabsTrigger>
            <TabsTrigger value="materials" className="text-sm">Materials</TabsTrigger>
          </TabsList>
        </div>
        
        <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} min-h-[300px]`}>
          <TabsContent value="summary">
            <CourseSummaryTab 
              course={course}
              currentLesson={currentLesson}
              currentModule={currentModule}
              isDarkMode={isDarkMode}
            />
          </TabsContent>
          
          <TabsContent value="notes">
            <CourseNotesTab 
              course={course}
              currentLesson={currentLesson}
              isDarkMode={isDarkMode}
            />
          </TabsContent>
          
          <TabsContent value="transcript">
            <CourseTranscriptTab 
              course={course}
              currentLesson={currentLesson}
              isDarkMode={isDarkMode}
            />
          </TabsContent>
          
          <TabsContent value="comments">
            <CourseCommentsTab 
              course={course}
              currentLesson={currentLesson}
              isDarkMode={isDarkMode}
            />
          </TabsContent>
          
          <TabsContent value="materials">
            <CourseMaterialsTab 
              course={course}
              currentLesson={currentLesson}
              currentModule={currentModule}
              isDarkMode={isDarkMode}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CourseContentTabs;
