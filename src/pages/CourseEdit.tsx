
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useLibraryContent } from '@/hooks/useLibraryContent';

const CourseEdit: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useLibraryContent();
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <MainLayout title="Course Not Found">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/library/manage" className="flex items-center gap-1">
                <ChevronLeft size={16} /> Back to Content Management
              </Link>
            </Button>
          </div>
          
          <Card className="p-8">
            <div className="text-center py-16">
              <h2 className="text-xl font-medium mb-4">Course Not Found</h2>
              <p className="text-muted-foreground mb-8">
                The course you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/library/manage">Return to Content Management</Link>
              </Button>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title={`Edit Course: ${course.title}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/library/manage" className="flex items-center gap-1">
              <ChevronLeft size={16} /> Back to Content Management
            </Link>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Edit Course: {course.title}</h1>
        
        <Card className="p-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">Course Editor Coming Soon</h2>
            <p className="text-muted-foreground mb-8">
              The course editor functionality is under development. Check back soon!
            </p>
            <Button asChild>
              <Link to="/library/manage">Return to Content Management</Link>
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CourseEdit;
