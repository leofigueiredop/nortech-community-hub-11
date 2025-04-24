
import React from 'react';
import { ContentItem, CourseModule, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Download, FileText, Link2, FileBox, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'resource' | 'code';
  url: string;
  size?: string; // For files
  description?: string;
  isNew?: boolean;
  isPremium?: boolean;
}

interface CourseMaterialsTabProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  currentModule: CourseModule | null;
  isDarkMode: boolean;
}

const CourseMaterialsTab: React.FC<CourseMaterialsTabProps> = ({
  course,
  currentLesson,
  currentModule,
  isDarkMode
}) => {
  // Mock materials data
  const courseMaterials: Material[] = [
    {
      id: '1',
      title: 'Course Syllabus',
      type: 'pdf',
      url: '/materials/syllabus.pdf',
      size: '2.4 MB',
      description: 'Complete course outline and topics covered'
    },
    {
      id: '2',
      title: 'Blockchain Basics Quick Reference',
      type: 'pdf',
      url: '/materials/blockchain-basics.pdf',
      size: '1.8 MB',
      description: 'Key concepts and terminology',
      isNew: true
    },
    {
      id: '3',
      title: 'Cryptocurrency Exchange Tutorial',
      type: 'link',
      url: 'https://example.com/crypto-exchange-tutorial',
      description: 'Step-by-step guide to using exchanges'
    },
    {
      id: '4',
      title: 'Blockchain Demo Code',
      type: 'code',
      url: 'https://github.com/example/blockchain-demo',
      description: 'Simple blockchain implementation in Python',
      isPremium: true
    }
  ];
  
  const lessonMaterials: Material[] = currentLesson ? [
    {
      id: '5',
      title: `${currentLesson.title} - Supplementary Notes`,
      type: 'doc',
      url: '/materials/lesson-notes.docx',
      size: '540 KB',
      description: 'Detailed notes expanding on video content'
    },
    {
      id: '6',
      title: 'Practice Exercise',
      type: 'resource',
      url: '/materials/exercise.zip',
      size: '4.2 MB',
      description: 'Hands-on exercises related to this lesson'
    }
  ] : [];
  
  const allMaterials = [...courseMaterials, ...lessonMaterials];
  
  // Define the getIconForType function
  const getIconForType = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      case 'code':
        return <FileText className="h-5 w-5" />;
      case 'resource':
      default:
        return <FileBox className="h-5 w-5" />;
    }
  };
  
  const handleDownload = (material: Material) => {
    if (material.isPremium) {
      // Handle premium content access
      console.log('Access premium content:', material);
      return;
    }
    
    // In a real app, this would download or open the material
    console.log('Download material:', material);
    
    // If it's a link, open in a new tab
    if (material.type === 'link') {
      window.open(material.url, '_blank');
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Course Materials</h2>
      
      {allMaterials.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No materials available for this course.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Course Materials Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Course Materials</h3>
            <div className="space-y-3">
              {courseMaterials.map((material) => (
                <MaterialItem 
                  key={material.id} 
                  material={material} 
                  onDownload={handleDownload}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
          
          {/* Lesson Materials Section (if any) */}
          {lessonMaterials.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">
                Materials for "{currentLesson?.title}"
              </h3>
              <div className="space-y-3">
                {lessonMaterials.map((material) => (
                  <MaterialItem 
                    key={material.id} 
                    material={material} 
                    onDownload={handleDownload}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MaterialItemProps {
  material: Material;
  onDownload: (material: Material) => void;
  isDarkMode: boolean;
}

const MaterialItem: React.FC<MaterialItemProps> = ({
  material,
  onDownload,
  isDarkMode
}) => {
  return (
    <div 
      className={`p-4 rounded-md border flex items-center justify-between ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`w-10 h-10 rounded flex items-center justify-center ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}
        >
          {getIconForType(material.type)}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{material.title}</h4>
            {material.isNew && (
              <Badge variant="outline" className="bg-blue-500 text-white border-none text-xs">
                New
              </Badge>
            )}
            {material.isPremium && (
              <Badge variant="outline" className="bg-amber-500 text-white border-none text-xs">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{material.type.toUpperCase()}</span>
            {material.size && (
              <>
                <span className="text-xs">•</span>
                <span>{material.size}</span>
              </>
            )}
            {material.description && (
              <>
                <span className="text-xs">•</span>
                <span className="truncate max-w-[200px]">{material.description}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Button 
        variant={material.isPremium ? "default" : "outline"} 
        size="sm"
        onClick={() => onDownload(material)}
        className="gap-1"
      >
        {material.type === 'link' ? (
          <>
            <Link2 className="h-4 w-4" />
            <span>Visit</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span>{material.isPremium ? 'Unlock' : 'Download'}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default CourseMaterialsTab;
