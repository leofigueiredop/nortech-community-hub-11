
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CourseCreate: React.FC = () => {
  return (
    <MainLayout title="Create Course">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/library/manage" className="flex items-center gap-1">
              <ChevronLeft size={16} /> Back to Content Management
            </Link>
          </Button>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
        
        <Card className="p-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">Course Builder Coming Soon</h2>
            <p className="text-muted-foreground mb-8">
              The course builder functionality is under development. Check back soon!
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

export default CourseCreate;
