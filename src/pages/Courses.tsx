
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Play, Lock, Star, ChevronRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const COURSES = [
  {
    id: 1,
    title: "React Fundamentals",
    description: "Learn the basics of React including components, state, props, and hooks",
    image: "/placeholder.svg",
    lessons: 12,
    duration: "4 hours",
    level: "Beginner",
    progress: 75,
    premium: false,
    rating: 4.8,
    students: 1243
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Deep dive into advanced React concepts and design patterns",
    image: "/placeholder.svg",
    lessons: 18,
    duration: "6 hours",
    level: "Advanced",
    progress: 0,
    premium: true,
    rating: 4.9,
    students: 867
  },
  {
    id: 3,
    title: "State Management Mastery",
    description: "Master different state management solutions in React applications",
    image: "/placeholder.svg",
    lessons: 10,
    duration: "3.5 hours",
    level: "Intermediate",
    progress: 30,
    premium: false,
    rating: 4.7,
    students: 983
  },
];

const CourseCard = ({ course }) => {
  return (
    <Card className={`mb-4 ${course.premium ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-none' : ''}`}>
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="h-48 w-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black opacity-40 rounded-t-lg"></div>
        {course.premium && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-nortech-purple">Premium</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-start">
          <span>{course.title}</span>
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 stroke-yellow-400" size={14} />
            <span className="text-sm">{course.rating}</span>
          </div>
        </CardTitle>
        <CardDescription className={`text-sm ${course.premium ? 'text-gray-300' : 'text-muted-foreground'}`}>
          {course.level} • {course.lessons} lessons • {course.duration}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className={`text-sm ${course.premium ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
          {course.description}
        </p>
        
        {!course.premium && course.progress > 0 && (
          <div className="mb-2">
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Your progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="text-xs">
          <span>{course.students.toLocaleString()} students</span>
        </div>
        <Button 
          variant={course.premium ? "outline" : "default"}
          size="sm"
          className={course.premium ? "text-white border-white hover:bg-white/20" : ""}
        >
          {course.premium ? (
            <>
              <Lock size={14} className="mr-1" /> Unlock Course
            </>
          ) : (
            <>
              <Play size={14} className="mr-1" /> Continue
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Courses = () => {
  return (
    <MainLayout title="Courses">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Courses</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="bg-nortech-purple/10 rounded-lg p-6 border border-nortech-purple/30">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <BookOpen className="mr-2" size={20} />
                Unlock Premium Courses
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get unlimited access to all premium courses and exclusive content.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-nortech-purple mr-2" />
                  <span>Access to all premium courses</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-nortech-purple mr-2" />
                  <span>Exclusive community discussions</span>
                </li>
                <li className="flex items-center">
                  <ChevronRight size={16} className="text-nortech-purple mr-2" />
                  <span>Monthly live Q&A sessions</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">$19.99</div>
              <div className="text-sm mb-3 line-through text-gray-500">$29.99</div>
              <Button className="bg-nortech-purple hover:bg-nortech-purple/90 w-full">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
