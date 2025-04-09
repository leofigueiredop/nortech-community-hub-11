
import { useState, useCallback } from 'react';
import { Course } from '@/types/library';
import { COURSES } from '@/data/mockLibraryData';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>(COURSES);

  // Course functions
  const addCourse = useCallback((newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  }, []);

  const updateCourse = useCallback((updatedCourse: Course) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse
  };
};
