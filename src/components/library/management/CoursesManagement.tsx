
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Plus, Eye, BookOpen, Clock, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useLibraryContent } from '@/hooks/useLibraryContent';
import { Course } from '@/types/library';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const CoursesManagement: React.FC = () => {
  const { courses, deleteCourse } = useLibraryContent();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const confirmDelete = (id: string) => {
    deleteCourse(id);
    setDeleteId(null);
    toast({
      title: "Course deleted",
      description: "The course has been removed from your library."
    });
  };

  const countModules = (course: Course) => {
    return course.modules.length;
  };

  const countContent = (course: Course) => {
    return course.modules.reduce((total, module) => total + module.contentItems.length, 0);
  };

  const calculateTotalDuration = (course: Course) => {
    // In a real app, this would be calculated from actual content durations
    return "2h 15m"; // Placeholder
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Courses</h2>
        <Button asChild>
          <Link to="/courses/create" className="flex items-center gap-2">
            <Plus size={16} /> Create Course
          </Link>
        </Button>
      </div>

      {viewMode === 'list' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Content Items</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} className="text-purple-500" />
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{course.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{countModules(course)}</TableCell>
                <TableCell>{countContent(course)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {calculateTotalDuration(course)}
                  </div>
                </TableCell>
                <TableCell>
                  {course.accessLevel === 'premium' ? (
                    <Badge variant="secondary" className="bg-amber-500 text-white">Premium</Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(course.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/courses/edit/${course.id}`}>
                          <Edit size={14} className="mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(course.id)} className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen size={40} className="text-slate-300" />
                    <h3 className="text-lg font-medium">No courses yet</h3>
                    <p className="text-slate-500 mb-4">Create your first course to organize your content</p>
                    <Button asChild>
                      <Link to="/courses/create">
                        <Plus size={16} className="mr-2" /> Create Course
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video relative bg-slate-100 dark:bg-slate-800">
                <img 
                  src={course.thumbnailUrl || '/placeholder.svg'} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.accessLevel === 'premium' && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-amber-500 text-white">Premium</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium mb-1 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center text-xs text-slate-500 mb-2">
                      <BookOpen size={12} className="mr-1" />
                      <span className="mr-2">{countModules(course)} modules</span>
                      <Video size={12} className="mr-1" />
                      <span>{countContent(course)} items</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/courses/edit/${course.id}`}>
                          <Edit size={14} className="mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(course.id)} className="text-red-600">
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <Clock size={12} />
                  <span>{calculateTotalDuration(course)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 border rounded-lg bg-slate-50 dark:bg-slate-900">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-2" />
              <h3 className="text-lg font-medium mb-2">No courses yet</h3>
              <p className="text-slate-500 mb-4">Create your first course to organize your content</p>
              <Button asChild>
                <Link to="/courses/create">
                  <Plus size={16} className="mr-2" /> Create Course
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && confirmDelete(deleteId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesManagement;
